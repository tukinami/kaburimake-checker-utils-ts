#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueArray = exports.getValue = exports.writeJSON = exports.loadText = exports.readGhostDatafromGhostMaster = exports.readDirnameFromInstallTxt = exports.buildGhostDatafromGhostDir = exports.buildGhostListBody = exports.buildGhostList = exports.build = exports.append = exports.merge = exports.erase = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const erase = (outPath, directory, sakuraName, keroName) => __awaiter(void 0, void 0, void 0, function* () {
    const normalizePath = node_path_1.default.normalize(outPath);
    const resolvedPath = node_path_1.default.resolve(normalizePath);
    return (0, promises_1.readFile)(resolvedPath)
        .then((buf) => {
        const contents = JSON.parse(buf.toString('utf8'));
        if (!contents.ghostList) {
            throw new Error(`${outPath} is not ghost data JSON file.`);
        }
        let filterd = contents.ghostList.slice();
        if (directory) {
            filterd = filterd.filter((v) => v.directory !== directory);
        }
        if (sakuraName) {
            filterd = filterd.filter((v) => v.sakuraName !== sakuraName);
        }
        if (keroName) {
            filterd = filterd.filter((v) => v.keroName !== keroName);
        }
        console.log(`input raw length: ${contents.ghostList.length}`);
        const ghostList = (0, exports.uniqueArray)(filterd);
        console.log(`output length: ${ghostList.length}`);
        return (0, exports.writeJSON)(outPath, ghostList);
    });
});
exports.erase = erase;
const merge = (outPath, inputDirs) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.allSettled(inputDirs.map((v) => __awaiter(void 0, void 0, void 0, function* () {
        const normalizePath = node_path_1.default.normalize(v);
        const resolvedPath = node_path_1.default.resolve(normalizePath);
        return (0, promises_1.readFile)(resolvedPath)
            .then((buf) => {
            return JSON.parse(buf.toString('utf8'));
        });
    })))
        .then((v) => {
        const results = v.flatMap((item) => { var _a; return (item.status === 'fulfilled' && ((_a = item.value) === null || _a === void 0 ? void 0 : _a.ghostList) ? item.value.ghostList : []); });
        const errors = v.map((item) => (item.status === 'rejected' ? item.reason : null));
        for (const err of errors) {
            if (err) {
                console.error(err);
            }
        }
        console.log(`input raw length: ${results.length}`);
        const ghostList = (0, exports.uniqueArray)(results);
        console.log(`output length: ${ghostList.length}`);
        return (0, exports.writeJSON)(outPath, ghostList);
    });
});
exports.merge = merge;
const append = (outPath, inputDirs) => __awaiter(void 0, void 0, void 0, function* () {
    const outPathNormalize = node_path_1.default.normalize(outPath);
    const outPathResolved = node_path_1.default.resolve(outPathNormalize);
    (0, promises_1.readFile)(outPathResolved)
        .then((buffer) => __awaiter(void 0, void 0, void 0, function* () {
        const contentStr = buffer.toString('utf8');
        let content = JSON.parse(contentStr);
        return (0, exports.buildGhostList)(inputDirs).then((v) => [content, v !== null && v !== void 0 ? v : []]);
    }))
        .then((v) => {
        const ghostList = (0, exports.uniqueArray)([...v[0].ghostList, ...v[1]]);
        const rawTotal = v[0].ghostList.length + v[1].length;
        const resultTotal = ghostList.length;
        console.log(`raw length: orginal: ${v[0].ghostList.length} + append: ${v[1].length} = ${rawTotal}.`);
        console.log(`result length: ${resultTotal}.`);
        return (0, exports.writeJSON)(outPath, ghostList);
    });
});
exports.append = append;
const build = (outPath, inputDirs) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ghostList = (_a = (yield (0, exports.buildGhostList)(inputDirs))) !== null && _a !== void 0 ? _a : [];
    yield (0, exports.writeJSON)(outPath, ghostList);
});
exports.build = build;
const buildGhostList = (inputDirs) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.allSettled(inputDirs.map((v) => (0, exports.buildGhostListBody)(v)))
        .then((v) => {
        const results = v.flatMap((item) => (item.status === 'fulfilled' && item.value ? [item.value] : []));
        const errors = v.map((item) => (item.status === 'rejected' ? item.reason : null));
        for (const err of errors) {
            if (err) {
                console.error(err);
            }
        }
        console.log(`raw length: ${results.flat().length}`);
        const r = (0, exports.uniqueArray)(results.flat());
        console.log(`result length: ${r.length}`);
        return r;
    })
        .catch((err) => {
        console.error(err);
        return undefined;
    });
});
exports.buildGhostList = buildGhostList;
const buildGhostListBody = (dirname) => __awaiter(void 0, void 0, void 0, function* () {
    const pathname = node_path_1.default.normalize(dirname);
    const files = yield (0, promises_1.readdir)(pathname, { withFileTypes: true });
    const dirs = files.filter((v) => v.isDirectory()).map((v) => v.name);
    return Promise.allSettled(dirs.map((v) => (0, exports.buildGhostDatafromGhostDir)(pathname, v)))
        .then((v) => {
        const results = v.flatMap((item) => (item.status === 'fulfilled' && item.value ? [item.value] : []));
        const errors = v.map((item) => (item.status === 'rejected' ? item.reason : null));
        for (const err of errors) {
            if (err) {
                console.error(err);
            }
        }
        return results;
    })
        .catch((err) => {
        console.error(err);
        return undefined;
    });
});
exports.buildGhostListBody = buildGhostListBody;
const buildGhostDatafromGhostDir = (rootDir, dirname) => __awaiter(void 0, void 0, void 0, function* () {
    const pathname = node_path_1.default.join(rootDir, dirname);
    return (0, promises_1.readdir)(pathname, { withFileTypes: true })
        .then((files) => {
        const installTxt = files.find((v) => v.isFile() && v.name === 'install.txt');
        const ghostDir = files.find((v) => v.isDirectory() && v.name === 'ghost');
        if (!installTxt || !ghostDir) {
            return null;
        }
        else {
            return Promise.all([
                (0, exports.readDirnameFromInstallTxt)(pathname),
                (0, exports.readGhostDatafromGhostMaster)(pathname)
            ]).then((v) => {
                return {
                    directory: v[0],
                    sakuraName: v[1].sakuraName,
                    keroName: v[1].keroName
                };
            });
        }
    })
        .catch((err) => {
        console.error(err.message);
        return null;
    });
});
exports.buildGhostDatafromGhostDir = buildGhostDatafromGhostDir;
const readDirnameFromInstallTxt = (rootDir) => __awaiter(void 0, void 0, void 0, function* () {
    const pathname = node_path_1.default.join(rootDir, 'install.txt');
    return (0, exports.loadText)(pathname)
        .then((buffer) => {
        var _a;
        const contents = buffer.split(/\r\n|\r|\n/);
        const directoryRaw = (_a = contents.find((v) => v.startsWith('directory,'))) !== null && _a !== void 0 ? _a : '';
        const directory = (0, exports.getValue)(directoryRaw, 'directory,');
        return directory === '' ? rootDir : directory;
    })
        .catch((err) => {
        throw err;
    });
});
exports.readDirnameFromInstallTxt = readDirnameFromInstallTxt;
const readGhostDatafromGhostMaster = (rootDir) => __awaiter(void 0, void 0, void 0, function* () {
    const pathname = node_path_1.default.join(rootDir, 'ghost/master/descript.txt');
    return (0, exports.loadText)(pathname)
        .then((buffer) => {
        var _a;
        const contents = buffer.split(/\r\n|\r|\n/);
        const sakuraNameRaw = contents.find((v) => v.includes('sakura.name,'));
        const keroNameRaw = (_a = contents.find((v) => v.includes('kero.name,'))) !== null && _a !== void 0 ? _a : '';
        if (!sakuraNameRaw) {
            throw new Error(`${rootDir}: sakura.name is not found in ghost/master/descirpt.txt.`);
        }
        const sakuraName = (0, exports.getValue)(sakuraNameRaw, 'sakura.name,');
        const keroName = (0, exports.getValue)(keroNameRaw, 'kero.name,');
        return { sakuraName, keroName };
    })
        .catch((err) => {
        throw err;
    });
});
exports.readGhostDatafromGhostMaster = readGhostDatafromGhostMaster;
const loadText = (pathname) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, promises_1.readFile)(pathname)
        .then((buffer) => {
        const tempContents = buffer.toString('utf8').split(/\r\n|\r|\n/);
        const charsetLine = tempContents.find((v) => v.includes('charset,') || v.includes('Charset,'));
        const charsetBody = (charsetLine !== null && charsetLine !== void 0 ? charsetLine : '').trim().replace(/(charset|Charset),/, '');
        let charset = 'utf-8';
        switch (charsetBody) {
            case 'Shift_JIS':
            case 'Shift-JIS': {
                charset = 'shift-jis';
                break;
            }
            case 'ISO-2022-JP': {
                charset = 'iso-2022-jp';
                break;
            }
            case 'EUC-JP': {
                charset = 'euc-jp';
                break;
            }
            case 'UTF-8': {
                charset = 'utf-8';
                break;
            }
            default: {
                charset = 'shift-jis';
                break;
            }
        }
        const textDecoder = new TextDecoder(charset, { fatal: true });
        return textDecoder.decode(buffer);
    })
        .catch((err) => {
        if (err instanceof Error) {
            err.message = pathname + ': ' + err.message;
        }
        throw err;
    });
});
exports.loadText = loadText;
const writeJSON = (outPath, ghostList) => __awaiter(void 0, void 0, void 0, function* () {
    const update = new Date().toJSON();
    const data = {
        update,
        ghostList,
    };
    const dataJSON = JSON.stringify(data);
    const outPathNormalize = node_path_1.default.normalize(outPath);
    const outPathResolved = node_path_1.default.resolve(outPathNormalize);
    return (0, promises_1.writeFile)(outPathResolved, dataJSON);
});
exports.writeJSON = writeJSON;
const getValue = (rawLine, label) => {
    return rawLine.trim().replace(label, '');
};
exports.getValue = getValue;
const uniqueArray = (array) => {
    return array.reduce((accumulator, current) => {
        const isEqual = accumulator.find((v) => {
            return (JSON.stringify(Object.entries(v).sort()) ===
                JSON.stringify(Object.entries(current).sort()));
        });
        return isEqual ? accumulator : [...accumulator, current];
    }, []);
};
exports.uniqueArray = uniqueArray;
