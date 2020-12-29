const http = require('http');

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.write('hello');
    res.end();
});

server.listen(3000, 'localhost', () => {
    console.log('listening')
})