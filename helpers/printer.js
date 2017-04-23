const _ = require('lodash');

function printInfo(keys, usedKeys, filteredKeys, diffKeys, filteredDiffKeys) {
  console.log('\nKeys Information'.cyan.bold);
  console.log('All Keys: ', keys.length.toString().bold);
  console.log('Used Keys: ', _.uniq(usedKeys).length.toString().bold);
  console.log('Filtered Keys: ', filteredKeys.length.toString().bold);
  console.log('Unused Keys Total:'.underline.red, diffKeys.length.toString().red.bold);

  console.log('\nPotentialy Unused Keys ['.cyan + filteredDiffKeys.length.toString().cyan.bold+']'.cyan + ' ('.cyan + 'without filtered ones'.cyan.bold + ')'.cyan);
  console.log('[ Key Name ]'.cyan);
  filteredDiffKeys.forEach(i => {
    console.log(i.toString().red);
  })
}

module.exports.printInfo = printInfo
