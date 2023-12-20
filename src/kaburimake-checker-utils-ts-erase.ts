#!/usr/bin/env node

import { Command } from 'commander';
import { erase } from './build_ghost_list';

const program = new Command();

program
  .requiredOption('-o, --output <path>', 'output path', './ghost_list.json')
  .option('-d --directory <directory>', 'directory name you want to erase')
  .option('-s --sakuraname <name>', 'sakuraName you want to erase')
  .option('-k --keroname <name>', 'keroName you want to erase');

program.parse(process.argv);

const options = program.opts();

erase(options.output, options.directory, options.sakuraname, options.keroname);
