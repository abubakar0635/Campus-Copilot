const http = require('http');
const data = JSON.stringify({ mode: 'help', code: 'print("hello")' });
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/ai',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
}, res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => console.log(b));
});
req.write(data);
req.end();
