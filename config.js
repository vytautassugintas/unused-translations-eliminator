#! /usr/bin/env node

const readline = require('readline');
const fs = require('fs');

const configFileName = '/telem.config.json';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Add key prefix to exclude: ', (answer) => {

  let fileExists = fs.existsSync(__dirname + configFileName);

  if (fileExists) {
    let fileData = fs.readFileSync(__dirname + configFileName, 'utf8');
    let arrayFromFile = JSON.parse(fileData);
    arrayFromFile.push(answer.toString())
    fs.writeFile(__dirname + configFileName, JSON.stringify(arrayFromFile), 'utf8',
      (err) => {
        if (err) {
          throw err;
        }
      });
  } else {
    fs.writeFile(__dirname + configFileName, JSON.stringify([answer.toString()]), 'utf8',
      (err) => {
        if (err) {
          throw err;
        }
      });
  }


  // fs.readFile('config.json', (err, data) => {
  //   if (err) throw err;
  //     if(data){
  //
  //       let currentArray = data.toString();
  //       currentArray = currentArray + answer;
  //
  //       fs.writeFile('config.json', currentArray, 'utf8', (err) => {
  //         if (err) throw err;
  //         console.log('The file has been saved!');
  //       });
  //
  //     }
  //   }
  //
  // fs.writeFile('config.json', answer, 'utf8', (err) => {
  //   if (err) throw err;
  //   console.log('The file has been saved!');
  // });
  // console.log('Done! Added: ', answer);



  rl.close();
});
