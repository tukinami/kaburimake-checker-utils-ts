#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const build_ghost_list_1 = require("./build_ghost_list");
const program = new commander_1.Command();
program
    .requiredOption('-o, --output <path>', 'output path', './ghost_list.json')
    .option('-d --directory <directory>', 'directory name you want to erase')
    .option('-s --sakuraname <name>', 'sakuraName you want to erase')
    .option('-k --keroname <name>', 'keroName you want to erase');
program.parse(process.argv);
const options = program.opts();
(0, build_ghost_list_1.erase)(options.output, options.directory, options.sakuraname, options.keroname);
