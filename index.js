#! /usr/bin/env node

var shell = require("shelljs");
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const readline = require('readline');
const Filehound = require('filehound');

//TODO: Support validation keys prefix config
//TODO: Support widget used in app dir config
//TODO: Script to remove unused keys
//TODO: Look up in JS files for keys manipulation
//TODO: Script to show unused keys line numbers in file for both different languages

var dirString = process.cwd();
let keys = _.keys(JSON.parse(fs.readFileSync(dirString + '/resources/languages/en.lang.json', 'utf8')));

function readFile(fileSrc) {
  return fs.readFileSync(fileSrc, 'utf8');
}

function getFileLines(fileData) {
  return lines = fileData.split('\n')
}

function findUsedKeys(lines, keys) {
  var usedKeys = [];
  _.forEach(lines, (line) => {
    line = line.trim()
    _.forEach(keys, (key) => {
      if (_.includes(line, key))
        usedKeys.push(key);
    })
  })
  return usedKeys;
}

function findDifferentKeys(usedKeys, keys) {
  return usedKeys.concat(keys)
    .filter((key) => {
      if (!(usedKeys.includes(key) && keys.includes(key)))
        return key;
    });
}

function excludeErrorKeys(keys) {
  return keys.filter((key) => {
    if (!key.includes('validation-error')) {
      return key;
    }
  })
}

function findUsedKeysInApp(keys) {
  var usedKeys = [];
  Filehound.create().ext('html')
    .paths(dirString + '/src')
    .find((err, htmlFiles) => {
      _.forEach(htmlFiles, (file) => {
        usedKeys = _.concat(findUsedKeys(getFileLines(readFile(file)), keys), usedKeys);
      })
      findUsedKeysInAppJs(keys, usedKeys)
    });
}

function findUsedKeysInAppJs(keys, usedKeysHtml) {
  var usedKeys = [];
  Filehound.create().ext('js')
    .paths(dirString + '/src')
    .find((err, jsFiles) => {
        _.forEach(jsFiles, (file) => {
          usedKeys = _.concat(findUsedKeys(getFileLines(readFile(file)), keys), usedKeys);
        })

        var both = _.concat(usedKeysHtml, usedKeys);

        var filteredDiff = findDifferentKeys(_.uniq(both), keys)
          .filter((key) => {
            return (key.includes('widget.') || key.includes('.reminders.') || key.includes('validation-error') || key.includes('validator'))
          })

        var bothDiff = findDifferentKeys(_.uniq(both), keys);

        var bothDiffAndFilteredDiff = findDifferentKeys(bothDiff, filteredDiff)

        printKeysInfo(usedKeysHtml, _.uniq(usedKeys), filteredDiff, _.uniq(both), bothDiff, bothDiffAndFilteredDiff)
    });
}

function printKeysInfo(usedInHtml, usedInJs, filteredKeys, bothKeys, unusedKeys, bothFiltDiff) {
  console.log('All keys ' + keys.length);
  console.log('Keys used in HTML files ' + usedInHtml.length);
  console.log('Keys used in JS files ' + usedInJs.length);
  console.log('Filtered keys ' + filteredKeys.length);
  console.log('Unique Keys used in HTML and JS files ' + bothKeys.length);
  var ifFiltered = filteredKeys.length ? ', but note that there are ' + filteredKeys.length + ' keys filtered' : '';
  console.log('Unused keys ' + unusedKeys.length + ifFiltered);

  console.log('TRU DIFF KEYS');
  bothFiltDiff.forEach(i => {
    console.log(i);
  })
}

findUsedKeysInApp(keys);
