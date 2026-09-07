"use strict";

/**
 * Hostinger Node entry file — binds to the platform PORT.
 * Set "Entry file" in hPanel Deployments to: server.js
 */
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const port = process.env.PORT || "3000";
const nextBin = path.join(
  __dirname,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);

if (!fs.existsSync(nextBin)) {
  console.error(
    "[server] next binary missing at",
    nextBin,
    "- ensure npm install and npm run build completed successfully.",
  );
  process.exit(1);
}

const child = spawn(
  process.execPath,
  [nextBin, "start", "-H", "0.0.0.0", "-p", String(port)],
  { stdio: "inherit", env: process.env },
);

function shutdown(signal) {
  if (!child.killed) child.kill(signal);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
