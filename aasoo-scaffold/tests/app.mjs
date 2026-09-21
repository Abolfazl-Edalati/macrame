// Boot the built app on a free port and hand out a fetch bound to it.
// Route-boundary seam: tests assert on HTTP responses, nothing below.
import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { seedFixtures, TEST_DB } from "./seed-fixtures.mjs";

let port = 0;
let child = null;

/** A free TCP port the server can bind. */
function freePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const p = srv.address().port;
      srv.close(() => resolve(p));
    });
  });
}

/**
 * Seed the test DB and start `next start` on a free port.
 * Resolves once the port accepts connections. Idempotent: every call after
 * the first returns the already-running app.
 */
export async function startApp() {
  if (child) return port;
  await seedFixtures();
  port = await freePort();

  // Boot the built app the same way the developer does in production.
  const command = ["npx", "next", "start", "-p", String(port)];

  // Spawn and don't wait on it: the port poll below is the only readiness
  // gate. Awaiting the child here would deadlock — the child never exits,
  // so the promise would never settle.
  child = spawn(command[0], command.slice(1), {
    cwd: process.cwd(),
    // Hard-code SQLITE_FILE so the child server never touches the dev DB.
    // bare `npm test` will get this from the shell env, which is unset — but
    // the harness sets it here, so every spawn always gets the test DB.
    env: { ...process.env, PORT: String(port), HOSTNAME: "127.0.0.1", SQLITE_FILE: TEST_DB },
    stdio: ["ignore", "inherit", "inherit"],
    shell: process.platform === "win32",
  });
  child.on("error", (err) => {
    throw err;
  });

  // Wait for the port to actually accept connections — the only reliable
  // readiness signal across platforms; never depends on log text.
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null || child.signalCode)
      throw new Error(`server exited code=${child.exitCode} signal=${child.signalCode}`);
    if (await isUp(port)) return port;
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error(`server never answered on port ${port}`);
}

function isUp(p) {
  return new Promise((resolve) => {
    const socket = net.connect(p, "127.0.0.1");
    socket.setTimeout(500);
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("error", () => resolve(false));
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
  });
}

/** fetch bound to the running app; the only way tests touch it. */
export function appFetch(pathname, init) {
  if (!child) throw new Error("call startApp() first");
  return fetch(`http://127.0.0.1:${port}${pathname}`, {
    redirect: "manual",
    ...init,
  });
}

/** Full body text of a response, for asserting on domain facts. */
export async function renderedText(res) {
  // React 19 emits `<!-- -->` separators between adjacent text nodes, which
  // would split multi-word strings mid-phrase. Strip them so assertions match
  // the rendered text as the user reads it.
  return (await res.text()).replace(/<!--.*?-->/g, "");
}

export async function stopApp() {
  if (!child) return;
  const proc = child;
  await new Promise((r) => {
    proc.on("exit", r);
    proc.kill();
    setTimeout(r, 5000);
  });
  child = null;
}
