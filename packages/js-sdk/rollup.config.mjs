// import info from './package.json' assert {type: 'json'}; // ExperimentalWarning: Importing JSON modules is an experimental feature. This feature could change at any time
import {readFileSync} from 'fs';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import {babel} from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import jsdoc from 'rollup-plugin-jsdoc';
import json from '@rollup/plugin-json';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import copy from 'rollup-plugin-copy';
import modify from 'rollup-plugin-modify';

import dotenv from 'dotenv';
dotenv.config();
const info = JSON.parse(
  readFileSync(
    `${dirname(fileURLToPath(import.meta.url))}/package.json`,
    'utf-8'
  )
);
console.log(`build ${info.name}...`);

const BUILD_CACHE = Boolean(process.env.NODE_ENV === 'production');

const LOGGER_OPTIONS = {
  replace: '// eslint-disable-line'
};
const logLevel = process.env.LOG_LEVEL ? Number(process.env.LOG_LEVEL) : 0;
switch (logLevel) {
  case 1:
    console.log('log level:', 'debug');
    LOGGER_OPTIONS.find =
      /this\._loggerManager(\?)?\.(?!(debug|info|warn|error)).*?;$/gms;
    break;
  case 2:
    console.log('log level:', 'info');
    LOGGER_OPTIONS.find =
      /this\._loggerManager(\?)?\.(?!(info|warn|error)).*?;$/gms;
    break;
  case 3:
    console.log('log level:', 'warn');
    LOGGER_OPTIONS.find = /this\._loggerManager(\?)?\.(?!(warn|error)).*?;$/gms;
    break;
  case 4:
    console.log('log level:', 'error');
    LOGGER_OPTIONS.find = /this\._loggerManager(\?)?\.(?!(error)).*?;$/gms;
    break;
  case 5:
    console.log('log level:', 'silent');
    LOGGER_OPTIONS.find = /this\._loggerManager(\?)?\..*?;$/gms;
    break;
}

const CONFIG_ENV = {
  find: 'process.env.CONFIG_ENDPOINT',
  replace: `'${process.env.CONFIG_ENDPOINT || ''}'`
};

const TRACK_ENV = {
  find: 'process.env.TRACK_ENDPOINT',
  replace: `'${process.env.TRACK_ENDPOINT || ''}'`
};

const JSDOC_PATH = 'docs';

const exclude = [
  '**/*.conf.js',
  '**/*.tests.js',
  '**/build',
  '**/demo',
  `**/${JSDOC_PATH}`,
  '**/dist',
  '**/lib',
  '**/*.md',
  '**/rollup.config.js',
  '**/tests'
];

const minimizedFilesHeader =
  '/*!\n' +
  ' * Convert JS SDK\n' +
  ' * Version 1.0.0\n' +
  ' * Copyright(c) 2020-2022 Convert Insights, Inc\n' +
  ' * License Apache-2.0\n' +
  ' */';

const terserConfig = {
  format: {
    preamble: minimizedFilesHeader,
    comments: false
  }
};

const withLogging = logLevel > 0 ? [modify(LOGGER_OPTIONS)] : [];

const commonJSBundle = {
  cache: BUILD_CACHE,
  input: './index.ts',
  output: [
    {
      exports: 'named',
      file: './lib/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      exports: 'named',
      file: './lib/index.min.js',
      format: 'cjs',
      sourcemap: true,
      plugins: [terser(terserConfig)]
    }
  ],
  plugins: withLogging.concat([
    modify(CONFIG_ENV),
    modify(TRACK_ENV),
    typescript({
      tsconfigOverride: {exclude: exclude}
    }),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    json(),
    generatePackageJson({
      baseContents: (pkg) => ({
        name: pkg.name,
        main: 'index.min.js',
        module: 'index.min.mjs',
        browser: 'index.umd.min.js',
        types: 'index.d.ts',
        files: ['**/**/*'],
        author: 'Convert Insights, Inc',
        repository: {
          type: 'git',
          url: 'git+https://github.com/convertcom/javascript-sdk.git',
          directory: 'packages/js-sdk'
        },
        license: 'Apache-2.0',
        dependencies: {},
        version: pkg.version
      })
    }),
    jsdoc({
      args: ['-d', JSDOC_PATH],
      config: 'jsdoc.config.json'
    }),
    copy({
      targets: [{src: ['public/**/*', 'coverage/coverage.svg'], dest: 'docs'}]
    })
  ])
};

const commonJSLegacyBundle = {
  cache: BUILD_CACHE,
  input: './index.ts',
  output: [
    {
      exports: 'named',
      file: './lib/legacy/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      exports: 'named',
      file: './lib/legacy/index.min.js',
      format: 'cjs',
      sourcemap: true,
      plugins: [terser(terserConfig)]
    }
  ],
  plugins: withLogging.concat([
    modify(CONFIG_ENV),
    modify(TRACK_ENV),
    typescript({
      tsconfigOverride: {compilerOptions: {target: 'es5'}, exclude: exclude}
    }),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [['@babel/preset-env', {targets: 'defaults'}]]
    }),
    json()
  ])
};

const esmBundle = {
  cache: BUILD_CACHE,
  input: './index.ts',
  output: [
    {
      exports: 'auto',
      format: 'es',
      file: 'lib/index.mjs',
      sourcemap: true
    },
    {
      exports: 'auto',
      format: 'es',
      file: 'lib/index.min.mjs',
      plugins: [terser(terserConfig)],
      sourcemap: true
    }
  ],
  plugins: withLogging.concat([
    modify(CONFIG_ENV),
    modify(TRACK_ENV),
    typescript({
      tsconfigOverride: {exclude: exclude}
    }),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    json()
  ])
};

const umdBundle = {
  cache: BUILD_CACHE,
  input: './index.ts',
  output: [
    {
      name: 'ConvertSDK',
      exports: 'named',
      format: 'umd',
      file: 'lib/index.umd.js',
      sourcemap: true
    },
    {
      name: 'ConvertSDK',
      exports: 'named',
      format: 'umd',
      file: 'lib/index.umd.min.js',
      plugins: [terser(terserConfig)],
      sourcemap: true
    }
  ],
  plugins: withLogging.concat([
    modify(CONFIG_ENV),
    modify(TRACK_ENV),
    typescript({
      tsconfigOverride: {exclude: exclude}
    }),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    json()
  ])
};

const BUNDLES = process.env.BUNDLES
  ? process.env.BUNDLES.split(',')
  : ['cjs', 'cjs-legacy', 'esm', 'umd'];

export default () => {
  return BUNDLES.map((bundle) => {
    switch (bundle) {
      case 'cjs':
        return [commonJSBundle];
      case 'cjs-legacy':
        return [commonJSLegacyBundle];
      case 'esm':
        return [esmBundle];
      case 'umd':
        return [umdBundle];
    }
    return [];
  }).flat();
};
