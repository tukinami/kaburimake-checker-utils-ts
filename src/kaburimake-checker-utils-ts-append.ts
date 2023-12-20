#!/usr/bin/env node

import { Command } from 'commander';
import { append } from './build_ghost_list';

const program = new Command();

program
  .requiredOption('-o, --output <path>', 'output path', './ghost_list.json')
  .option('-i --input [dirs...]', 'path where installed ghost directory e.g. C:/SSP/ghost');

program.parse(process.argv);

const options = program.opts();

append(options.output, options.input);
