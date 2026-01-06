# DSA Based Search Engine

A full-stack project that scrapes, aggregates, and enables search for DSA (Data Structures & Algorithms) problems from LeetCode, Codeforces, CodeChef, and AtCoder.

## Features
- Scrapes problems and descriptions from four major competitive programming platforms.
- Aggregates and stores problems in JSON files for each platform.
- Provides a Node.js/Express backend for searching problems by keyword.
- Modern frontend with a dark theme for searching and viewing problems.
- Supports English problem statements (AtCoder scraping ensures English extraction).

## Project Structure
```
assets                # Platform logos
corpus                # (Reserved for future: NLP/search data, not required for basic use)
problems              # Scraped JSON data (generated)
utils                 # (Reserved for future: utility scripts/modules)
index.html            # Frontend UI
index.js              # Express backend
styles.css            # Dark theme styles
script.js             # Frontend logic (if present)
scrape.js             # Scraper for all platforms
package.json          # Node.js dependencies
README.md             # Project info (this file)
```

## Scraping Instructions
- Run `node scrape.js` to scrape all platforms (edit the script to select platforms as needed).
- Scraped data is saved in the `problems/` directory as JSON files (e.g., `atcoder_problems.json`).
- AtCoder scraping covers contests abc100 to abc439 and up to 2000 problems, extracting only English statements.

## Backend Instructions
- Start the backend server with `node index.js`.
- The backend exposes a search API for the frontend to query problems by keyword.

## Frontend Instructions
- Open `index.html` in your browser to use the search UI.
- The frontend fetches search results from the backend and displays them in a user-friendly, dark-themed interface.

## Customization
- To change scraping limits or contest ranges, edit the constants in `scrape.js`.
- To change the theme, edit `styles.css`.

## Requirements
- Node.js (v14+ recommended)
- npm install (to install dependencies)
- Chrome/Chromium (Puppeteer downloads automatically)

## Deployment
- You can deploy the backend to platforms like Heroku, Render, or Vercel (Node.js server required).
- The frontend is static and can be hosted on any static file server.

## Credits
- Developed by Nishkarsh0Sharma
- Powered by Puppeteer, Express, and modern web technologies.

## License
MIT License
