import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import process from "node:process";

const [url, output, widthArg = "390", heightArg = "844"] =
  process.argv.slice(2);

if (!url || !output) {
  console.error(
    "Usage: node scripts/local-visual-qa.mjs <url> <output.png> [width] [height]",
  );
  process.exit(1);
}

const width = Number(widthArg);
const height = Number(heightArg);
const port = 9300 + Math.floor(Math.random() * 500);
const profile = `/tmp/novaclean-cdp-${process.pid}`;
const chromePath =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

await mkdir(profile, { recursive: true });

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--disable-background-networking",
    `--remote-debugging-port=${port}`,
    "--remote-allow-origins=*",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

const pause = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function getPageTarget() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await response.json();
      const page = targets.find((target) => target.type === "page");
      if (page) return page;
    } catch {}
    await pause(100);
  }
  throw new Error("Chrome DevTools endpoint did not become ready.");
}

let socket;
let sequence = 0;
const pending = new Map();

function call(method, params = {}) {
  sequence += 1;
  const id = sequence;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

try {
  const target = await getPageTarget();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id || !pending.has(message.id)) return;
    const entry = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) entry.reject(new Error(message.error.message));
    else entry.resolve(message.result);
  });

  await call("Page.enable");
  await call("Runtime.enable");
  await call("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 760,
    screenWidth: width,
    screenHeight: height,
  });
  await call("Emulation.setTouchEmulationEnabled", {
    enabled: width <= 760,
    maxTouchPoints: 5,
  });
  await call("Page.navigate", { url });
  await pause(1800);
  await call("Runtime.evaluate", {
    expression: "document.fonts && document.fonts.ready",
    awaitPromise: true,
  });
  await pause(300);

  const metrics = await call("Runtime.evaluate", {
    expression:
      "({ width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth })",
    returnByValue: true,
  });
  if (metrics.result.value.scrollWidth > width) {
    throw new Error(
      `Horizontal overflow: ${metrics.result.value.scrollWidth}px in a ${width}px viewport`,
    );
  }

  const screenshot = await call("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await writeFile(output, Buffer.from(screenshot.data, "base64"));
  console.log(JSON.stringify(metrics.result.value));
} finally {
  socket?.close();
  chrome.kill("SIGTERM");
  await pause(150);
  await rm(profile, { recursive: true, force: true });
}
