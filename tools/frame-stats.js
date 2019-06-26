#!/usr/bin/env node
let dict = require('./../dictionary.json');
let stats = dict.reduce(
  (tally, {frame}) => {
    tally[frame] = (tally[frame] || 0) + 1;
    return tally
  }, {});
let sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
sorted.forEach(([frame, count]) =>
  process.stdout.write(`${count}\t${frame}\n`));
process.stdout.write(`\n${dict.length}\ttotal\n`);
