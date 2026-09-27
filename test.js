const assert = require('assert');
const http = require('http');

const PORT = process.env.PORT || 8080;

// Start server test
const server = require('./server.js');

setTimeout(() => {
  http.get(`http://127.0.0.1:${PORT}/health`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(json.status, 'ok');
        console.log('Test passed: /health endpoint responded successfully.');
        process.exit(0);
      } catch (e) {
        console.error('Test failed: Invalid response', e);
        process.exit(1);
      }
    });
  }).on('error', (err) => {
    console.error('Test failed: Could not connect to server', err);
    process.exit(1);
  });
}, 1500);
