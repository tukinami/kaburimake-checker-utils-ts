#!/usr/bin/env node
import { Command } from 'commander';

export const cli = () => {
  const program = new Command();

  program.name('kaburimake-checker-utils-ts')
    .version('0.1.0')
    .command('build [options]', 'build ghost data json from directories in input directories.').alias('b')
    .command('append [options]', 'append ghost data from directories in input directories').alias('a')
    .command('merge [options]', 'merge ghost data from input data').alias('m')
    .command('erase [options]', 'erase ghost data from json').alias('e');

  program.parse(process.argv);
};

cli();
