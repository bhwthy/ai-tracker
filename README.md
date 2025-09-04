# AI Search Tracker

This web app allows you to input keywords and client domains, then checks AI search engines (Google SGE, Bing Copilot, Perplexity) for each keyword, retrieves the top 20 results, and displays if/where the client domain appears in the results, including its position.

## How to Run

### Server
1. Go to the `server` folder
2. Run `npm install`
3. Run `npm start`

### Client
1. Go to the `client` folder
2. Run `npm install`
3. Run `npm start`

The client will run on port 3000 and the server on port 5000.

## Note
- The search engine integration is currently mocked. You can replace the logic in `server/index.js` with real API calls.
