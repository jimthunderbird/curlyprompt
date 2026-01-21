SESSION_ID=$(ls -t ~/.copilot/logs/session-*.log | head -n 1 | sed 's/.*session-\(.*\)\.log/\1/')

cat app.prompt | copilot --allow-all-tools --resume $SESSION_ID
