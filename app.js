
const http = require('http');
const port = process.env.PORT || 3000;

// --- Web Server ---
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  if (req.url === '/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }));
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World from DevOps Lab!\n');
  }
});

// --- Run App Normally ---
if (process.argv[2] !== 'test') {
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}

// --- Inline Test (no separate file needed) ---
if (process.argv[2] === 'test') {
  const assert = require('assert');

  // Test basic math
  assert.strictEqual(2 + 2, 4, 'Math test failed');

  // Test /health endpoint
  server.listen(0, () => {
    const addr = server.address();
    const url = `http://localhost:${addr.port}/health`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        assert.strictEqual(res.statusCode, 200, 'Health endpoint should return 200');
        assert.strictEqual(json.status, 'healthy', 'Health status should be healthy');
        console.log('✅ All tests passed');
        process.exit(0);
      });
    }).on('error', (err) => {
      console.error('❌ Test failed', err);
      process.exit(1);
    });
  });
}
