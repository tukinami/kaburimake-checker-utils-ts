#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const build_ghost_list_1 = require("./build_ghost_list");
const program = new commander_1.Command();
program
    .requiredOption('-o, --output <path>', 'output path', './ghost_list.json')
    .requiredOption('-i, --input [dirs...]', 'path where installed ghost directory e.g. C:/SSP/ghost');
program.parse(process.argv);
const options = program.opts();
(0, build_ghost_list_1.build)(options.output, options.input);
