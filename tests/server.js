/**
 * Precept QA Audit — In-Process Static Server
 * Serves native HTML5/CSS3/ES6 static assets with clean URL resolution,
 * MIME type mapping, and standard 404 fallback routing.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8'
};

function resolveFilePath(rootDir, pathname) {
  let decodedPath = decodeURIComponent(pathname);
  if (decodedPath.startsWith('/')) {
    decodedPath = decodedPath.slice(1);
  }

  // Exact file path
  let targetPath = path.join(rootDir, decodedPath);

  // Security check: cannot escape rootDir
  if (!targetPath.startsWith(rootDir)) {
    return null;
  }

  if (fs.existsSync(targetPath)) {
    const stat = fs.statSync(targetPath);
    if (stat.isDirectory()) {
      const indexFile = path.join(targetPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        return indexFile;
      }
    } else if (stat.isFile()) {
      return targetPath;
    }
  }

  // Clean URL check 1: pathname + '/index.html'
  const dirIndex = path.join(targetPath, 'index.html');
  if (fs.existsSync(dirIndex)) {
    return dirIndex;
  }

  // Clean URL check 2: pathname + '.html'
  const htmlFile = targetPath + '.html';
  if (fs.existsSync(htmlFile)) {
    return htmlFile;
  }

  return null;
}

function startServer(port = 8099, rootDir = path.resolve(__dirname, '..')) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url);
      const filePath = resolveFilePath(rootDir, parsedUrl.pathname);

      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
        return;
      }

      if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const fileContent = fs.readFileSync(filePath);

        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Length': fileContent.length,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });

        if (req.method === 'HEAD') {
          res.end();
        } else {
          res.end(fileContent);
        }
      } else {
        // 404 Fallback
        const notFound404Path = path.join(rootDir, '404.html');
        let notFoundContent = Buffer.from('404 Not Found');
        if (fs.existsSync(notFound404Path)) {
          notFoundContent = fs.readFileSync(notFound404Path);
        }

        res.writeHead(404, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Length': notFoundContent.length,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });

        if (req.method === 'HEAD') {
          res.end();
        } else {
          res.end(notFoundContent);
        }
      }
    });

    server.on('error', (err) => {
      reject(err);
    });

    server.listen(port, () => {
      const actualPort = server.address().port;
      const baseUrl = `http://127.0.0.1:${actualPort}`;
      resolve({
        server,
        port: actualPort,
        baseUrl,
        close: () => new Promise((resClose) => server.close(resClose))
      });
    });
  });
}

module.exports = {
  startServer,
  resolveFilePath,
  MIME_TYPES
};
