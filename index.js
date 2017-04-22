#! /usr/bin/env node

const shell = require("shelljs");
const fs = require('fs');
const _ = require('lodash');
const Filehound = require('filehound');
const colors = require('colors');
const printer = require('./helpers/printer');

//TODO: Support validation keys prefix config
//TODO: Support widget used in app dir config
//TODO: Script to remove unused keys
//TODO: Look up in JS files for keys manipulation
//TODO: Script to show unused keys line numbers in file for both different languages

const dirString = process.cwd();

const keys = _.keys(JSON.parse(fs.readFileSync(dirString + '/resources/languages/en.lang.json', 'utf8')));
const htmlFileDirs = Filehound.create().ext('html').paths(dirString + '/src').findSync();
const jsFileDirs = Filehound.create().ext('js').paths(dirString + '/src').findSync();

const keysToFilter = ['widget.', '.reminders.', 'validation-error', 'validator'];

function readFile(fileSrc) {
  return fs.readFileSync(fileSrc, 'utf8');
}

function getFileLines(fileData) {
  return lines = fileData.split('\n')
}

function findUsedKeys(lines, keys) {
  var usedKeys = [];
  _.forEach(lines, (line, index) => {
    line = line.trim()
    _.forEach(keys, (key) => {
      if (_.includes(line, key))
        usedKeys.push(key);
    })
  })
  return usedKeys;
}

function findDifferentKeys(usedKeys, keys) {
  return usedKeys
    .concat(keys)
    .filter((key) => {
      if (!(usedKeys.includes(key) && keys.includes(key)))
        return key;
    });
}

function isKeyFiltered(arr, key) {
  return arr.some(filter => key.includes(filter));
}

function findUsedKeysInApp(keys) {
  const usedKeys = htmlFileDirs
    .concat(jsFileDirs)
    .reduce((usedKeys, fileDir) =>
      usedKeys.concat(findUsedKeys(getFileLines(readFile(fileDir)), keys)), [])

  const filteredKeys = findDifferentKeys(
      _.uniq(usedKeys), keys)
    .filter((key) => isKeyFiltered(keysToFilter, key))

  const diffKeys = findDifferentKeys(
    _.uniq(usedKeys), keys)

  const filteredDiffKeys = findDifferentKeys(diffKeys, filteredKeys)

  printer.printInfo(keys, usedKeys, filteredKeys, diffKeys, filteredDiffKeys)
}

findUsedKeysInApp(keys);
