const http = require('http');
const fs = require('fs');
const path = require('path');

const INITIAL_PORT = Number(process.env.PORT) || 3000;
const rootDir = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function getSafeFilePath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
  const requested = cleanPath === '/' ? '/index.html' : cleanPath;
  const normalizedPath = path.normalize(requested).replace(/^([.][.][/\\])+/, '');
  return path.join(rootDir, normalizedPath);
}

const server = http.createServer((req, res) => {
  const filePath = getSafeFilePath(req.url || '/');

  if (!filePath.startsWith(rootDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 - Forbidden');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 - Not Found');
        return;
      }

      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 - Internal Server Error');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

function startServer(port) {
  server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    const currentPort = Number(server.address()?.port || INITIAL_PORT);
    const nextPort = currentPort + 1;
    console.log(`Porta ${currentPort} ocupada. Tentando porta ${nextPort}...`);
    setTimeout(() => startServer(nextPort), 100);
    return;
  }

  console.error('Erro ao iniciar servidor:', error);
  process.exit(1);
});

startServer(INITIAL_PORT);
