[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://leonkariukii.github.io/interactive-user-form/)

Interactive Form — Minimal static site

Files:
- index.html — HTML structure and page sections
- styles.css — minimal, responsive styling
- script.js — client-side logic: validation, localStorage, conditional rendering, months calc, quotes loop

How to run:
Open index.html in any modern browser (no server required). Or host the folder on GitHub Pages or any static host.

Notes:
- Data stored only in browser localStorage under key 'userProfile_v1'.
- Age validation accepts integers 0..130.
- Accessibility: aria-live for greeting and error roles for alerts.
