#!/usr/bin/env node

import { Command } from 'commander';
import { merge } from './build_ghost_list';

const program = new Command();

program
  .requiredOption('-o, --output <path>', 'output path', './ghost_list.json')
  .option('-i --input [paths...]', 'input paths for ghost data json');

program.parse(process.argv);

const options = program.opts();

merge(options.output, options.input);
