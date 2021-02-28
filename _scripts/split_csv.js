const fs = require('fs');
const path = '_data/nzap_data.csv';
let batchPrefix = `${path.split('.')[0]}_batch`;
let data = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
let lines = data.split('\n')
let totalBatchSize = 500000;
let fileCounts = Math.ceil(lines.length / totalBatchSize);

const createBatchFiles = () => {
  for (let i = 0; i < fileCounts; i++) {
    let start = totalBatchSize * i;
    let stop = start + totalBatchSize;
    console.log(start, stop);
    let newLinesArr = lines.slice(start, stop);
    if (i > 0) newLinesArr.unshift(lines[0])
    let newLines = newLinesArr.join('\n');
    fs.writeFileSync(`${batchPrefix}_${i}.csv`, newLines);
    fs.chmodSync(`${batchPrefix}_${i}.csv`, 0777);
    console.log('Changed file permissions', `${batchPrefix}_${i}.csv`);
  }
}

createBatchFiles()

// node _scripts/split_csv && node _scripts/mk_json && node _scripts/mk_loadable