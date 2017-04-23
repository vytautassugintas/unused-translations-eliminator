#! /usr/bin/env node

const fs = require('fs');

const configFileName = '/telem.config.json';

fs.readFile(__dirname + configFileName, (err, data) => {
  if (err) {
    console.log('Config file doesn\'t exist');
  } else {
    console.log(data.toString());
  }

});
