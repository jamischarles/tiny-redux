# tiny-redux
Simplified redux implementation for learning purposes. **Not meant for Production use**.

This is primarily meant to show what the core redux functions do in a simplified manner.

Study `tiny-redux.js` for the main redux library functions.  
Study `index.js` for 2 very simple redux app examples (almost no abstractions).

You should be able to swap out tiny-redux.js with regular redux and everything should work just fine.

## Loading this in a browser
If you're dying to run this...

Opening index.html in Chrome will work, but you'll need to use a webserver like https://www.npmjs.com/package/http-server to serve up the js files to get around CORS limitations (because of the `script type="module"`).

## Loading this in node.js
You could just paste tiny-redux.js into index.js and run `node index.js`


