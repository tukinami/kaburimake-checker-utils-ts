#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const build_ghost_list_1 = require("./build_ghost_list");
const program = new commander_1.Command();
program
    .requiredOption('-o, --output <path>', 'output path', './ghost_list.json')
    .option('-i --input [paths...]', 'input paths for ghost data json');
program.parse(process.argv);
const options = program.opts();
(0, build_ghost_list_1.merge)(options.output, options.input);
