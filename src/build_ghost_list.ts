#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

type GhostData = { directory: string; sakuraName: string; keroName: string };
type GhostJSON = { update: string; ghostList: GhostData[] };

export const erase = async (
  outPath: string,
  directory: string | undefined,
  sakuraName: string | undefined,
  keroName: string | undefined
) => {
  const normalizePath = path.normalize(outPath);
  const resolvedPath = path.resolve(normalizePath);

  return readFile(resolvedPath)
    .then((buf) => {
      const contents: GhostJSON = JSON.parse(buf.toString('utf8'));
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
      const ghostList = uniqueArray(filterd);
      console.log(`output length: ${ghostList.length}`);

      return writeJSON(outPath, ghostList);
    });
};

export const merge = async (outPath: string, inputDirs: string[]) => {
  return Promise.allSettled(inputDirs.map(async (v) => {
    const normalizePath = path.normalize(v);
    const resolvedPath = path.resolve(normalizePath);

    return readFile(resolvedPath)
      .then((buf): GhostJSON => {
        return JSON.parse(buf.toString('utf8'));
      });
  }))
    .then((v) => {
      const results = v.flatMap((item) => (item.status === 'fulfilled' && item.value?.ghostList ? item.value.ghostList : []));
      const errors = v.map((item) => (item.status === 'rejected' ? item.reason : null));

      for (const err of errors) {
        if (err) {
          console.error(err);
        }
      }
      console.log(`input raw length: ${results.length}`);
      const ghostList = uniqueArray(results);
      console.log(`output length: ${ghostList.length}`);

      return writeJSON(outPath, ghostList);
    });
};

export const append = async (outPath: string, inputDirs: string[]) => {
  const outPathNormalize = path.normalize(outPath);
  const outPathResolved = path.resolve(outPathNormalize);

  readFile(outPathResolved)
    .then(async (buffer) => {
      const contentStr = buffer.toString('utf8');
      let content: GhostJSON = JSON.parse(contentStr);

      return buildGhostList(inputDirs).then((v): [GhostJSON, GhostData[]] => [content, v ?? []]);
    })
    .then((v: [GhostJSON, GhostData[]]) => {
      const ghostList: GhostData[] = uniqueArray([...v[0].ghostList, ...v[1]]);

      const rawTotal = v[0].ghostList.length + v[1].length;
      const resultTotal = ghostList.length;
      console.log(
        `raw length: orginal: ${v[0].ghostList.length} + append: ${v[1].length} = ${rawTotal}.`
      );
      console.log(`result length: ${resultTotal}.`);

      return writeJSON(outPath, ghostList);
    });
};

export const build = async (outPath: string, inputDirs: string[]) => {
  const ghostList = (await buildGhostList(inputDirs)) ?? [];
  await writeJSON(outPath, ghostList);
};

export const buildGhostList = async (inputDirs: string[]): Promise<GhostData[] | undefined> => {
  return Promise.allSettled(inputDirs.map((v) => buildGhostListBody(v)))
    .then((v) => {
      const results = v.flatMap((item) => (item.status === 'fulfilled' && item.value ? [item.value] : []));
      const errors = v.map((item) => (item.status === 'rejected' ? item.reason : null));

      for (const err of errors) {
        if (err) {
          console.error(err);
        }
      }

      console.log(`raw length: ${results.flat().length}`);
      const r = uniqueArray(results.flat());
      console.log(`result length: ${r.length}`);
      return r;
    })
    .catch((err) => {
      console.error(err);
      return undefined;
    });
};

export const buildGhostListBody = async (dirname: string): Promise<GhostData[] | undefined> => {
  const pathname = path.normalize(dirname);
  const files = await readdir(pathname, { withFileTypes: true });
  const dirs = files.filter((v) => v.isDirectory()).map((v) => v.name);

  return Promise.allSettled(dirs.map((v) => buildGhostDatafromGhostDir(pathname, v)))
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
};

export const buildGhostDatafromGhostDir = async (
  rootDir: string,
  dirname: string
): Promise<GhostData | null> => {
  const pathname = path.join(rootDir, dirname);

  return readdir(pathname, { withFileTypes: true })
    .then((files) => {
      const installTxt = files.find((v) => v.isFile() && v.name === 'install.txt');
      const ghostDir = files.find((v) => v.isDirectory() && v.name === 'ghost');

      if (!installTxt || !ghostDir) {
        return null;
      } else {
        return Promise.all([
          readDirnameFromInstallTxt(pathname),
          readGhostDatafromGhostMaster(pathname)
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
};

export const readDirnameFromInstallTxt = async (rootDir: string): Promise<string> => {
  const pathname = path.join(rootDir, 'install.txt');

  return loadText(pathname)
    .then((buffer) => {
      const contents = buffer.split(/\r\n|\r|\n/);
      const directoryRaw = contents.find((v) => v.startsWith('directory,')) ?? '';
      const directory = getValue(directoryRaw, 'directory,');

      return directory === '' ? rootDir : directory;
    })
    .catch((err) => {
      throw err;
    });
};

export const readGhostDatafromGhostMaster = async (
  rootDir: string
): Promise<{ sakuraName: string; keroName: string }> => {
  const pathname = path.join(rootDir, 'ghost/master/descript.txt');

  return loadText(pathname)
    .then((buffer) => {
      const contents = buffer.split(/\r\n|\r|\n/);
      const sakuraNameRaw = contents.find((v) => v.includes('sakura.name,'));
      const keroNameRaw = contents.find((v) => v.includes('kero.name,')) ?? '';

      if (!sakuraNameRaw) {
        throw new Error(
          `${rootDir}: sakura.name is not found in ghost/master/descirpt.txt.`
        );
      }
      const sakuraName = getValue(sakuraNameRaw, 'sakura.name,');
      const keroName = getValue(keroNameRaw, 'kero.name,');

      return { sakuraName, keroName };
    })
    .catch((err) => {
      throw err;
    });
};

export const loadText = async (pathname: string): Promise<string> => {
  return readFile(pathname)
    .then((buffer) => {
      const tempContents = buffer.toString('utf8').split(/\r\n|\r|\n/);

      const charsetLine = tempContents.find(
        (v) => v.includes('charset,') || v.includes('Charset,')
      );
      const charsetBody = (charsetLine ?? '').trim().replace(/(charset|Charset),/, '');

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
};

export const writeJSON = async (outPath: string, ghostList: GhostData[]) => {
  const update = new Date().toJSON();
  const data: GhostJSON = {
    update,
    ghostList,
  };
  const dataJSON = JSON.stringify(data);

  const outPathNormalize = path.normalize(outPath);
  const outPathResolved = path.resolve(outPathNormalize);
  return writeFile(outPathResolved, dataJSON);
};

export const getValue = (rawLine: string, label: string): string => {
  return rawLine.trim().replace(label, '');
};

export const uniqueArray = <T extends Object>(array: T[]): T[] => {
  return array.reduce((accumulator: T[], current: T) => {
    const isEqual = accumulator.find((v) => {
      return (
        JSON.stringify(Object.entries(v).sort()) ===
        JSON.stringify(Object.entries(current).sort())
      );
    });
    return isEqual ? accumulator : [...accumulator, current];
  }, []);
};
