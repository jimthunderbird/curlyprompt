#!/bin/bash
#
# ask_gemini.sh - Send a prompt file to Gemini via Chrome automation (macOS)
#
# Prerequisites:
#   - macOS with Google Chrome installed
#   - Already logged into your Google account in Chrome
#   - Accessibility permissions granted for Terminal/iTerm (System Settings > Privacy > Accessibility)
#
# Usage:
#   sh ask_gemini.sh -f hello.prompt
#   sh ask_gemini.sh -p "Write a Python hello world"
#

set -e

usage() {
  echo "Usage: $0 -f <prompt_file>"
  echo "       $0 -p <prompt_text>"
  echo "  -f  Path to the prompt file to send to Gemini"
  echo "  -p  Inline prompt text to send to Gemini"
  exit 1
}

PROMPT_FILE=""
PROMPT_TEXT=""
while getopts "f:p:" opt; do
  case $opt in
    f) PROMPT_FILE="$OPTARG" ;;
    p) PROMPT_TEXT="$OPTARG" ;;
    *) usage ;;
  esac
done

if [ -z "$PROMPT_FILE" ] && [ -z "$PROMPT_TEXT" ]; then
  echo "Error: either -f or -p flag is required"
  usage
fi

if [ -n "$PROMPT_FILE" ] && [ -n "$PROMPT_TEXT" ]; then
  echo "Error: -f and -p are mutually exclusive"
  usage
fi

if [ -n "$PROMPT_FILE" ]; then
  if [ ! -f "$PROMPT_FILE" ]; then
    echo "Error: File '$PROMPT_FILE' not found"
    exit 1
  fi
  PROMPT_CONTENT=$(cat "$PROMPT_FILE")
  TARGET_PY="${PROMPT_FILE%.prompt}.py"
else
  PROMPT_CONTENT="$PROMPT_TEXT"
  TARGET_PY="gemini_output.py"
fi

# Copy prompt to clipboard
printf '%s' "$PROMPT_CONTENT" | pbcopy

if [ -n "$PROMPT_FILE" ]; then
  echo "[1/5] Prompt copied to clipboard from: $PROMPT_FILE"
else
  echo "[1/5] Prompt copied to clipboard from inline -p argument"
fi
echo "       Target output file: $TARGET_PY"

# Step 1: Open or focus Gemini in Chrome (always start a fresh chat)
echo "[2/5] Opening Gemini in Chrome..."

osascript <<'ASCRIPT'
tell application "Google Chrome"
  activate

  set geminiURL to "https://gemini.google.com/app"
  set foundTab to false

  if (count of windows) > 0 then
    repeat with w in windows
      set tabIdx to 0
      repeat with t in tabs of w
        set tabIdx to tabIdx + 1
        if URL of t starts with "https://gemini.google.com" then
          set active tab index of w to tabIdx
          set index of w to 1
          set URL of active tab of front window to geminiURL
          set foundTab to true
          exit repeat
        end if
      end repeat
      if foundTab then exit repeat
    end repeat
  end if

  if not foundTab then
    if (count of windows) = 0 then
      make new window
    end if
    tell front window
      make new tab with properties {URL:geminiURL}
    end tell
  end if
end tell
ASCRIPT

# Wait for page to load
sleep 2

# Step 2: Check if logged in
LOGIN_CHECK=$(osascript <<'ASCRIPT' 2>/dev/null || echo "unknown"
tell application "Google Chrome"
  set jsResult to execute active tab of front window javascript "
    window.location.href.includes('accounts.google.com') ? 'not_logged_in' : 'logged_in';
  "
  return jsResult
end tell
ASCRIPT
)

if [ "$LOGIN_CHECK" = "not_logged_in" ]; then
  echo "ERROR: You are not logged in to Google."
  echo "Please log in manually in Chrome first, then re-run this script."
  exit 1
fi

echo "[3/5] Gemini loaded. Pasting prompt and submitting..."

# Step 3: Focus input, paste from clipboard, and submit
osascript <<'ASCRIPT'
tell application "Google Chrome"
  activate

  -- Try to focus the input area via JavaScript
  execute active tab of front window javascript "
    (function() {
      var el = document.querySelector('div[contenteditable=\"true\"]')
            || document.querySelector('.ql-editor')
            || document.querySelector('rich-textarea div[contenteditable]')
            || document.querySelector('textarea');
      if (el) { el.focus(); el.click(); }
    })();
  "
end tell

delay 0.5

-- Paste from clipboard
tell application "System Events"
  tell process "Google Chrome"
    set frontmost to true
    keystroke "v" using command down
  end tell
end tell

delay 1

-- Try clicking the send button via JavaScript first
tell application "Google Chrome"
  execute active tab of front window javascript "
    (function() {
      // Try various selectors for the send/submit button
      var btn = document.querySelector('button[aria-label=\"Send message\"]')
             || document.querySelector('button[aria-label*=\"Send\"]')
             || document.querySelector('.send-button')
             || document.querySelector('button.send-button')
             || document.querySelector('[data-mat-icon-name=\"send\"]');

      if (btn) {
        btn.click();
        return 'clicked';
      }

      // Fallback: find button with a send icon (mat-icon)
      var icons = document.querySelectorAll('mat-icon');
      for (var i = 0; i < icons.length; i++) {
        if (icons[i].textContent.trim() === 'send' || icons[i].textContent.trim() === 'arrow_upward') {
          var parent = icons[i].closest('button');
          if (parent) { parent.click(); return 'clicked_icon'; }
        }
      }

      return 'not_found';
    })();
  "
end tell

delay 0.5

-- Fallback: press Enter key in case JS button click didn't work
tell application "System Events"
  tell process "Google Chrome"
    key code 36
  end tell
end tell
ASCRIPT

echo "[4/5] Prompt submitted. Waiting for response..."

# Step 4: Poll until response stabilizes
MAX_WAIT=120
INTERVAL=3
ELAPSED=0
PREV_LEN=0
STABLE_COUNT=0

# Initial wait for response to start generating
sleep 10

while [ $ELAPSED -lt $MAX_WAIT ]; do
  CURRENT_LEN=$(osascript <<'ASCRIPT' 2>/dev/null || echo "0"
tell application "Google Chrome"
  set jsResult to execute active tab of front window javascript "
    (function() {
      var selectors = [
        'message-content .markdown',
        '.model-response-text .markdown',
        '.response-container .markdown',
        '[data-message-author-role=\"model\"] .markdown-main-panel',
        '.conversation-container .model-response-text',
        '.response-content',
        '.markdown'
      ];

      var responses = null;
      for (var i = 0; i < selectors.length; i++) {
        responses = document.querySelectorAll(selectors[i]);
        if (responses.length > 0) break;
      }

      if (responses && responses.length > 0) {
        return String(responses[responses.length - 1].innerText.length);
      }
      return '0';
    })();
  "
  return jsResult
end tell
ASCRIPT
  )

  if [ "$CURRENT_LEN" != "0" ] && [ "$CURRENT_LEN" = "$PREV_LEN" ]; then
    STABLE_COUNT=$((STABLE_COUNT + 1))
    if [ $STABLE_COUNT -ge 3 ]; then
      break
    fi
  else
    STABLE_COUNT=0
  fi

  PREV_LEN="$CURRENT_LEN"
  sleep $INTERVAL
  ELAPSED=$((ELAPSED + INTERVAL))
done

# Step 5: Extract code block from the response
echo "[5/5] Capturing code block from response..."

RESULT_B64=$(osascript <<'ASCRIPT' 2>/dev/null || echo ""
tell application "Google Chrome"
  set jsResult to execute active tab of front window javascript "
    (function() {
      var text = '';

      // Try to extract code block content specifically
      var codeSelectors = [
        'code-block pre',
        'code-block code',
        '.code-container pre',
        '.code-container code',
        'pre code',
        'pre'
      ];

      var codeEl = null;
      for (var i = 0; i < codeSelectors.length; i++) {
        var els = document.querySelectorAll(codeSelectors[i]);
        if (els.length > 0) {
          codeEl = els[els.length - 1];
          break;
        }
      }

      if (codeEl) {
        text = codeEl.innerText || codeEl.textContent;
      } else {
        // Fallback: extract from full response markdown
        var mdSelectors = [
          'message-content .markdown',
          '.model-response-text .markdown',
          '.response-container .markdown',
          '[data-message-author-role=\"model\"] .markdown-main-panel',
          '.response-content',
          '.markdown'
        ];

        var responses = null;
        for (var j = 0; j < mdSelectors.length; j++) {
          responses = document.querySelectorAll(mdSelectors[j]);
          if (responses.length > 0) break;
        }

        if (responses && responses.length > 0) {
          text = responses[responses.length - 1].innerText;
        }
      }

      if (!text) return '';
      // Base64-encode to preserve escape sequences through the AppleScript bridge
      return btoa(unescape(encodeURIComponent(text)));
    })();
  "
  return jsResult
end tell
ASCRIPT
)

# Decode the base64 result
if [ -n "$RESULT_B64" ]; then
  RESULT=$(printf '%s' "$RESULT_B64" | base64 --decode 2>/dev/null || echo "")
else
  RESULT=""
fi

if [ -z "$RESULT" ]; then
  echo ""
  echo "WARNING: Could not capture the response automatically."
  echo "This usually means the DOM selectors need updating for the current Gemini UI."
  echo "Please check Chrome manually for the response."
  exit 1
fi

# Remove "Python" from the first line if present, then save to .py file
printf '%s\n' "$RESULT" | sed '1{s/^Python$//;/^$/d;}' > "$TARGET_PY"

echo ""
echo "=== Saved to $TARGET_PY ==="
echo ""
cat "$TARGET_PY"
