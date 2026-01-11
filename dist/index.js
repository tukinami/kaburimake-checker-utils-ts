#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cli = void 0;
const commander_1 = require("commander");
const cli = () => {
    const program = new commander_1.Command();
    program.name('kaburimake-checker-utils-ts')
        .version('0.1.1')
        .command('build [options]', 'build ghost data json from directories in input directories.').alias('b')
        .command('append [options]', 'append ghost data from directories in input directories').alias('a')
        .command('merge [options]', 'merge ghost data from input data').alias('m')
        .command('erase [options]', 'erase ghost data from json').alias('e');
    program.parse(process.argv);
};
exports.cli = cli;
(0, exports.cli)();
