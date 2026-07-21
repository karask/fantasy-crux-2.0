import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = path.resolve('_site');
const host = process.env.FANTASY_CRUX_PREVIEW_HOST ?? '127.0.0.1';
const port = Number(process.env.FANTASY_CRUX_PREVIEW_PORT ?? 8080);
const pathPrefix =
  `/${(process.env.FANTASY_CRUX_PATH_PREFIX ?? '').replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.wasm', 'application/wasm'],
  ['.woff2', 'font/woff2'],
]);

function safePathname(requestUrl) {
  let pathname = decodeURIComponent(new URL(requestUrl, 'http://preview.invalid').pathname);
  if (pathPrefix !== '/') {
    if (pathname === pathPrefix.slice(0, -1)) pathname = pathPrefix;
    if (!pathname.startsWith(pathPrefix)) return null;
    pathname = `/${pathname.slice(pathPrefix.length)}`;
  }
  const relative = pathname.replace(/^\/+/, '');
  const location = path.resolve(siteRoot, relative);
  const withinSite = location === siteRoot || location.startsWith(`${siteRoot}${path.sep}`);
  return withinSite ? location : null;
}

async function resolveFile(requestUrl) {
  let location = safePathname(requestUrl);
  if (!location) return null;

  try {
    const details = await stat(location);
    if (details.isDirectory()) location = path.join(location, 'index.html');
  } catch {
    if (!path.extname(location)) location = path.join(location, 'index.html');
  }

  try {
    return (await stat(location)).isFile() ? location : null;
  } catch {
    return null;
  }
}

function streamFile(response, location, statusCode, method) {
  response.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    'Content-Type': contentTypes.get(path.extname(location)) ?? 'application/octet-stream',
  });

  if (method === 'HEAD') {
    response.end();
    return;
  }

  createReadStream(location).pipe(response);
}

const server = createServer(async (request, response) => {
  try {
    const location = await resolveFile(request.url ?? '/');
    if (location) {
      streamFile(response, location, 200, request.method);
      return;
    }

    const notFound = path.join(siteRoot, '404.html');
    streamFile(response, notFound, 404, request.method);
  } catch (error) {
    console.error(error);
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Preview server error.');
  }
});

export async function startPreviewServer() {
  await new Promise((resolve, reject) => {
    const handleError = (error) => reject(error);
    server.once('error', handleError);
    server.listen(port, host, () => {
      server.off('error', handleError);
      resolve();
    });
  });

  console.log(`Fantasy Crux Lite preview: http://${host}:${port}${pathPrefix}`);
  return server;
}

export async function stopPreviewServer() {
  if (!server.listening) return;
  server.closeAllConnections?.();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

const isCommandLine =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCommandLine) {
  await startPreviewServer();

  const close = async () => {
    await stopPreviewServer();
    process.exit(0);
  };

  process.on('SIGINT', close);
  process.on('SIGTERM', close);
}
