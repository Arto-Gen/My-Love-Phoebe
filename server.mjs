import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stat, realpath } from 'node:fs/promises';
import { createReadStream } from 'node:fs';

// Only this project directory is served, regardless of the terminal's cwd.
const root = path.dirname(fileURLToPath(import.meta.url));
const canonicalRoot = await realpath(root);
const args = process.argv.slice(2);
function option(name, fallback) {
  const index = args.indexOf(name);
  return index < 0 ? fallback : args[index + 1];
}
const port = Number(option('--port', process.env.PORT || 4173));
const host = option('--host', '127.0.0.1');
if (!Number.isInteger(port) || port < 1 || port > 65535 || !host || host.startsWith('--')) {
  console.error('Usage: node server.mjs [--port 4173] [--host 127.0.0.1]');
  process.exit(1);
}

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

function insideRoot(target) {
  const relative = path.relative(canonicalRoot, target);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

const server = http.createServer(async (request, response) => {
  const reply = (status, message) => {
    response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : message);
  };
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Cache-Control', 'no-cache');
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    reply(405, 'Method not allowed');
    return;
  }
  try {
    // Decode before resolving, including encoded traversal and Windows separators.
    const pathname = decodeURIComponent((request.url || '/').split(/[?#]/)[0]);
    if (!pathname.startsWith('/') || /[\u0000-\u001f\\:]/.test(pathname)) {
      reply(400, 'Invalid path');
      return;
    }
    const segments = pathname.split('/').filter(Boolean);
    if (segments.some(segment => segment.startsWith('.'))) {
      reply(403, 'Forbidden');
      return;
    }
    let target = path.resolve(root, `.${pathname}`);
    if (!insideRoot(target)) {
      reply(403, 'Forbidden');
      return;
    }
    let details = await stat(target);
    if (details.isDirectory()) {
      target = path.join(target, 'index.html');
      details = await stat(target);
    }
    const canonicalTarget = await realpath(target);
    const canonicalSegments = path.relative(canonicalRoot, canonicalTarget).split(path.sep);
    if (!insideRoot(canonicalTarget) || canonicalSegments.some(segment => segment.startsWith('.')) || !details.isFile()) {
      reply(403, 'Forbidden');
      return;
    }
    const extension = path.extname(target).toLowerCase();
    // Serve only browser assets; scripts/configuration for the server stay private.
    if (!mime[extension] || path.basename(target).toLowerCase() === 'package.json' || path.basename(canonicalTarget).toLowerCase() === 'package.json') {
      reply(403, 'Forbidden');
      return;
    }
    response.writeHead(200, {
      'Content-Type': mime[extension],
      'Content-Length': details.size,
      'Last-Modified': details.mtime.toUTCString(),
    });
    if (request.method === 'HEAD') {
      response.end();
      return;
    }
    const stream = createReadStream(canonicalTarget);
    stream.on('error', () => response.destroy());
    response.on('close', () => stream.destroy());
    stream.pipe(response);
  } catch (error) {
    if (error instanceof URIError) reply(400, 'Invalid URL');
    else if (error.code === 'ENOENT' || error.code === 'ENOTDIR') reply(404, 'Not found');
    else if (error.code === 'EACCES' || error.code === 'EPERM') reply(403, 'Forbidden');
    else reply(500, 'Unable to serve this file');
  }
});

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use. Try --port ${port + 1}.` : error.message);
  process.exitCode = 1;
});
server.listen(port, host, () => console.log(`Us, always → http://${host}:${port}`));
