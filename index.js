#! /usr/bin/env node
var shell = require("shelljs");
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const readline = require('readline');
const Filehound = require('filehound').create();

var dirString = process.cwd();

let keys = _.keys(JSON.parse(fs.readFileSync(dirString + '/resources/languages/en.lang.json', 'utf8')));

function readFile(fileSrc) {
  return fs.readFileSync(fileSrc, 'utf8');
}

function getFileLines(fileData){
  return lines = fileData.split('\n')
}

function findUsedKeys(lines, keys){
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
    return usedKeys.concat(keys).filter((val) => {
          if (!(usedKeys.includes(val) && keys.includes(val)))
            return val;
      });
}

function excludeErrorKeys(keys){
    return keys.filter((x) => {
      if (!x.includes('validation-error')) {
        return x;
      }
    })
}

function findUsedKeysInApp(keys) {
  var usedKeys = [];
  Filehound.ext('html').paths(dirString + '/src')
    .find((err, htmlFiles) => {
      _.forEach(htmlFiles, (file) => {
        usedKeys = _.concat(findUsedKeys(getFileLines(readFile(file)),keys), usedKeys);
        //console.log('File: ' + file + ' Used Keys:' + findUsedKeys(getFileLines(readFile(file)),keys).length);
      })
      console.log("ALL KEYS: " + keys.length);
      console.log("USED KEYS: " + _.uniq(usedKeys).length);
      console.log("DIFF KEYS: " + findDifferentKeys(_.uniq(usedKeys), keys).length);

      console.log("ALL KEYS WITHOUT ERROR KEYS: " + excludeErrorKeys(keys).length);
      console.log("DIFF WITHOUT ERROR KEYS: " + excludeErrorKeys(findDifferentKeys(_.uniq(usedKeys), keys)).length);
  });

}



findUsedKeysInApp(keys);
