#!/usr/bin/env node

/**
 * Local HTTP & Dev Server for Anubhav Patel Portfolio
 * 
 * Usage:
 *   node server.js             -> Serves production build (dist/) on localhost:5173
 *   node server.js --dev       -> Starts Vite dev server with Hot Module Reloading (HMR)
 *   node server.js --port 3000 -> Custom port (default: 5173 or PORT env var)
 *   node server.js --open      -> Automatically opens browser on start
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec, execSync } from 'node:child_process';
import os from 'node:os';
import zlib from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CLI flags
const args = process.argv.slice(2);
const isDev = args.includes('--dev') || args.includes('-d');
const shouldOpen = args.includes('--open') || args.includes('-o');

const portArgIdx = args.findIndex(a => a === '--port' || a === '-p');
const customPort = portArgIdx !== -1 && args[portArgIdx + 1] ? parseInt(args[portArgIdx + 1], 10) : null;
const DEFAULT_PORT = customPort || parseInt(process.env.PORT || '5173', 10);

const DIST_DIR = path.resolve(__dirname, 'dist');
const ASSETS_DIR = path.resolve(__dirname, 'assets');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.wasm': 'application/wasm',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.pdf': 'application/pdf',
};

// Helper: open browser
function openBrowser(url) {
  const startCmd = process.platform === 'win32'
    ? `start "" "${url}"`
    : process.platform === 'darwin'
      ? `open "${url}"`
      : `xdg-open "${url}"`;
  exec(startCmd, () => {});
}

// Helper: get local LAN IP
function getNetworkAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

// -------------------------------------------------------------
// Dev Server Mode (Vite with HMR)
// -------------------------------------------------------------
async function startDevServer(port) {
  try {
    const { createServer } = await import('vite');
    const server = await createServer({
      configFile: path.resolve(__dirname, 'vite.config.ts'),
      server: {
        port,
        host: '0.0.0.0',
        open: shouldOpen,
      },
    });

    await server.listen();
    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  } catch (err) {
    console.error('Failed to start Vite dev server:', err);
    process.exit(1);
  }
}

// -------------------------------------------------------------
// Production Static Server (Serving dist/ with SPA fallback)
// -------------------------------------------------------------
function ensureBuild() {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.log('⚡ Production build (dist/) not found. Running build first...');
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    try {
      execSync(`${npmCmd} run build`, { stdio: 'inherit', cwd: __dirname });
    } catch {
      console.warn('⚠️ Build failed. Falling back to Vite dev server...');
      return false;
    }
  }
  return true;
}

function startStaticServer(port) {
  const server = http.createServer((req, res) => {
    // Only handle GET and HEAD
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Method Not Allowed');
      return;
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    } catch {
      res.statusCode = 400;
      res.end('Bad Request');
      return;
    }

    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Resolve safe path inside DIST_DIR
    let filePath = path.normalize(path.join(DIST_DIR, pathname));
    if (!filePath.startsWith(DIST_DIR)) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }

    // Check if target is a file in dist
    let stat = null;
    try {
      stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        const potentialIndex = path.join(filePath, 'index.html');
        if (fs.existsSync(potentialIndex)) {
          filePath = potentialIndex;
          stat = fs.statSync(filePath);
        } else {
          stat = null;
        }
      }
    } catch {
      stat = null;
    }

    // Fallback: check assets folder for static files not bundled directly into dist
    if (!stat && pathname.startsWith('/assets/')) {
      const assetRelative = pathname.slice('/assets/'.length);
      const fallbackAsset = path.normalize(path.join(ASSETS_DIR, assetRelative));
      if (fallbackAsset.startsWith(ASSETS_DIR) && fs.existsSync(fallbackAsset)) {
        try {
          const s = fs.statSync(fallbackAsset);
          if (s.isFile()) {
            filePath = fallbackAsset;
            stat = s;
          }
        } catch {}
      }
    }

    // SPA fallback: If not a static file and does not have an extension, serve index.html
    const hasExtension = path.extname(pathname) !== '';
    if (!stat) {
      if (!hasExtension || req.headers.accept?.includes('text/html')) {
        filePath = path.join(DIST_DIR, 'index.html');
        try {
          stat = fs.statSync(filePath);
        } catch {
          res.statusCode = 404;
          res.end('index.html not found');
          return;
        }
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end(`404 Not Found: ${pathname}`);
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isHtml = ext === '.html';

    // Headers
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);

    // Cache control
    if (filePath.includes(`${path.sep}assets${path.sep}`) && !isHtml) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'no-cache');
    }

    // Gzip compression for text-based assets if accepted
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const shouldGzip = /\b(text|javascript|json|xml|svg)\b/.test(contentType) && acceptEncoding.includes('gzip') && stat.size > 1024;

    if (req.method === 'HEAD') {
      res.setHeader('Content-Length', stat.size);
      res.end();
      return;
    }

    if (shouldGzip) {
      res.setHeader('Content-Encoding', 'gzip');
      const rawStream = fs.createReadStream(filePath);
      const gzipStream = zlib.createGzip();
      rawStream.pipe(gzipStream).pipe(res);
      rawStream.on('error', () => {
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Server Error');
        }
      });
    } else {
      res.setHeader('Content-Length', stat.size);
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      stream.on('error', () => {
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Server Error');
        }
      });
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`\n⚠️  Port ${port} is already in use. Trying port ${port + 1}...`);
      startStaticServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, '0.0.0.0', () => {
    const localUrl = `http://localhost:${port}/`;
    const lanIp = getNetworkAddress();
    const lanUrl = lanIp ? `http://${lanIp}:${port}/` : null;

    console.log('\n┌────────────────────────────────────────────────────────┐');
    console.log('│  PORTFOLIO PRODUCTION SERVER RUNNING                   │');
    console.log('├────────────────────────────────────────────────────────┤');
    console.log(`│  > Local:   \x1b[36m${localUrl.padEnd(41)}\x1b[0m  │`);
    if (lanUrl) {
      console.log(`│  > Network: \x1b[36m${lanUrl.padEnd(41)}\x1b[0m  │`);
    }
    console.log('├────────────────────────────────────────────────────────┤');
    console.log('│  • Mode: Production (SPA with gzip & caching)          │');
    console.log('│  • For Vite HMR dev server: run \x1b[33mnode server.js --dev\x1b[0m  │');
    console.log('│  • Press Ctrl+C to stop                                │');
    console.log('└────────────────────────────────────────────────────────┘\n');

    if (shouldOpen) {
      openBrowser(localUrl);
    }
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('\nStopping server...');
    server.close(() => {
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// -------------------------------------------------------------
// Entry Point
// -------------------------------------------------------------
async function main() {
  if (isDev) {
    console.log('🚀 Starting Vite development server...');
    await startDevServer(DEFAULT_PORT);
  } else {
    const hasDist = ensureBuild();
    if (hasDist) {
      startStaticServer(DEFAULT_PORT);
    } else {
      await startDevServer(DEFAULT_PORT);
    }
  }
}

main().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
