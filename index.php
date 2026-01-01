<?php
$now = new DateTime('2026-01-01T11:26:52.753Z');
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>clicking components demo</title>
  <link rel="stylesheet" href="/web.css" />
  <style>
    /* Scoped to #container to avoid interference */
    #container { padding: 1rem; }
    #container #numbers-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.5rem; }
    #container #numbers-list li { padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px; user-select: none; }
    #container #numbers-list li:hover { cursor: pointer; background: #f7f7f7; }
    #container #displayer { margin-top: 1rem; min-height: 2rem; padding: 0.5rem; border: 1px dashed #aaa; border-radius: 6px; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
    #container #button1 { margin-top: 0.75rem; padding: 0.5rem 0.8rem; border: 1px solid #888; border-radius: 6px; background: #fff; }
    #container #button1:hover { cursor: pointer; background: #f3f3f3; }
  </style>
</head>
<body>
  <div id="container">
    <ul id="numbers-list">
      <?php
        // Generate 15 random numbers between 1 and 150 (scoped to this UL)
        $nums = [];
        for ($i = 0; $i < 15; $i++) { $nums[] = random_int(1, 150); }
        foreach ($nums as $n) {
          $type = ($n % 2 === 1) ? 'odd' : 'even';
          $text = ($type === 'odd') ? "odd number {$n}" : "even number {$n}";
          echo '<li data-number="' . htmlspecialchars((string)$n, ENT_QUOTES) . '" data-type="' . $type . '">' . htmlspecialchars($text, ENT_QUOTES) . '</li>';
        }
      ?>
    </ul>
    <div id="displayer" aria-live="polite"></div>
    <button id="button1" type="button">button 1</button>
  </div>
  <script>
    (() => {
      // Strictly scope to #container to avoid interfering with other elements
      const container = document.getElementById('container');
      if (!container) return;

      const displayer = container.querySelector('#displayer');
      const list = container.querySelector('#numbers-list');
      const button1 = container.querySelector('#button1');

      // Scoped event delegation for list items
      if (list && displayer) {
        list.addEventListener('click', (ev) => {
          const li = ev.target && ev.target.closest('#container #numbers-list li');
          if (!li || !list.contains(li)) return;
          const num = li.getAttribute('data-number');
          const type = li.getAttribute('data-type');
          if (!num || !type) return;
          const msg = (type === 'odd')
            ? `clicked on odd number ${num} in the list`
            : `clicked on even number ${num} in the list`;
          displayer.innerHTML = msg;
        }, { passive: true });
      }

      // Scoped counter using closure, isolated to #button1
      if (button1 && displayer) {
        let counter = 0;
        button1.addEventListener('click', () => {
          counter += 1;
          displayer.innerHTML = `buton 1 counter ${counter}`;
        }, { passive: true });
      }
    })();
  </script>
</body>
</html>
