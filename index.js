#!/usr/bin/env node

const { spawn } = require("child_process");
const readline = require("readline");
const asciichart = require("asciichart");

const host = process.argv[2] || "192.168.0.1";

const pad = 14;
const width = process.stdout.getWindowSize()[0] - pad;
const data = [0];
let maxPing = 0;
let skip = 2;

const ping = spawn("ping", [host, "-t"]);

readline.createInterface(ping.stdout).on("line", (line) => {
  if (skip) return skip--;

  const ms = parseInt(line.match(/time[<=](\d+)/)?.[1] ?? 9999);

  data.push(ms);
  if (data.length === width) data.shift();
  maxPing = Math.max(maxPing, ms);

  console.clear();
  console.log("Pinging", host);
  console.log(asciichart.plot(data, { height: 20 }));
  console.log("PING:", ms, "ms", "|", "MAX:", maxPing, "ms");
});
