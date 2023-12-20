#!/usr/bin/env node
type GhostData = {
    directory: string;
    sakuraName: string;
    keroName: string;
};
export declare const erase: (outPath: string, directory: string | undefined, sakuraName: string | undefined, keroName: string | undefined) => Promise<void>;
export declare const merge: (outPath: string, inputDirs: string[]) => Promise<void>;
export declare const append: (outPath: string, inputDirs: string[]) => Promise<void>;
export declare const build: (outPath: string, inputDirs: string[]) => Promise<void>;
export declare const buildGhostList: (inputDirs: string[]) => Promise<GhostData[] | undefined>;
export declare const buildGhostListBody: (dirname: string) => Promise<GhostData[] | undefined>;
export declare const buildGhostDatafromGhostDir: (rootDir: string, dirname: string) => Promise<GhostData | null>;
export declare const readDirnameFromInstallTxt: (rootDir: string) => Promise<string>;
export declare const readGhostDatafromGhostMaster: (rootDir: string) => Promise<{
    sakuraName: string;
    keroName: string;
}>;
export declare const loadText: (pathname: string) => Promise<string>;
export declare const writeJSON: (outPath: string, ghostList: GhostData[]) => Promise<void>;
export declare const getValue: (rawLine: string, label: string) => string;
export declare const uniqueArray: <T extends Object>(array: T[]) => T[];
export {};
//# sourceMappingURL=build_ghost_list.d.ts.map