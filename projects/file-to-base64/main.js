/**
 * DOCUMENTATION
 *
 * Starting this script:
 *      - arg options 3-6 can be set to null
 *
 * node <file path to main.js>
 *      <file path to source file>
 *      <custom MIME type defaults to source file extension if listed in source code>
 *      <custom output path with filename or filename only in source folder>
 *      <variable name for TypeScript output>
 *      <output format defaults to 'ts', option to set 'txt'>
 *
 * node projects/file-to-base64/main.js
 *      projects/micro-app/src/assets/images/sample-tag.png
 *
 * node projects/file-to-base64/main.js
 *      projects/micro-app/src/assets/images/sample-tag.png
 *      image/png my.file.ts myVarnameInTsFile
 *
 * node projects/file-to-base64/main.js
 *      projects/micro-app/src/assets/images/sample-tag.png
 *      null my-base64-string.txt null txt
 */

const stringUtils = require('@angular-devkit/core/src/utils/strings');
const fs = require('fs').promises;

const [ _, __, fullFilePath, mimeType, outFilenameOrFullPath, varName, outputFormat ] =
  process.argv.map(arg => arg === 'null' ? null : arg);

const mimeTypes = {
  css: 'text/css',
  csv: 'text/csv',
  gif: 'image/gif',
  graphql: 'application/graphql',
  html: 'text/html',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  js: 'application/javascript',
  json: 'application/json',
  pdf: 'application/pdf',
  png: 'image/png',
  txt: 'text/plain',
  xml: 'application/xml',
  zip: 'application/zip'
};

async function generateFile() {
  const fileBase64 = await fs.readFile(fullFilePath, { encoding: 'base64' });
  const [filePath, ext] = fullFilePath.split('.');
  const [filename, path] = getFilenamePath(filePath);
  const extOut = outputFormat === 'txt' ? 'txt' : 'ts';
  const pathOut = getFullPathOut(outFilenameOrFullPath, path, filename, extOut);
  const contentOut = getContentOut(outputFormat, filename, fileBase64, mimeType, ext, varName)
  return fs.writeFile(pathOut, contentOut);
}

function getFilenamePath(filePath) {
  const normalizedFilePath = filePath.replace('\\', '/');

  return [
    normalizedFilePath.split('/').slice(-1)[0],
    normalizedFilePath.split('/').slice(0, -1).join('/') + '/'
  ];
}

function getFullPathOut(argPath, srcPath, srcFilename, extOut) {
  if (argPath) {
    const normalizedArgPath = argPath.replace('\\', '/');
    if (normalizedArgPath.indexOf('/') > -1) {
      return normalizedArgPath;
    } else {
      return srcPath + normalizedArgPath;
    }
  }

  return [
    srcPath,
    srcFilename,
    '.data-url.',
    extOut
  ].join('');
}

function getTsFileOutputContent(base64, mimeType, filename, varName) {
  return [
    'export const ',
    varName ?
      varName :
      stringUtils.camelize(filename) + 'DataUrl',
    ' = \'data:',
    mimeType,
    ';base64,',
    base64,
    '\';\n'
  ].join('');
}

function getContentOut(outputFormat, filename, fileBase64, mimeType, ext, varName) {
  const mimeTypeOut = mimeType || mimeTypes[ext];
  if (!mimeTypeOut && outputFormat !== 'txt') {
    throw new Error('No MIME-Type found.');
  }

  return outputFormat !== 'txt' ?
    getTsFileOutputContent(fileBase64, mimeTypeOut, filename, varName) :
    fileBase64;
}

generateFile().then();
