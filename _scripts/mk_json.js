const fs = require('fs');
const csv = require('csvtojson')
const neatCsv = require('neat-csv');
const readline = require('readline');
const slug = require('slug');
const { async } = require('q');
const path = process.argv[2]
let processCount = 0;
let convertCount = 0;

let fileArray = path.split('/');
let inputDataFile = `${fileArray[fileArray.length - 1].split('.')[0]}.json`;
fileArray.pop()
let batchPrefix = `${path.split('.')[0]}_batch`

const convertToJson = async (batchFiles) => {
  let csvFile = batchFiles[convertCount];
  let csvFileIndexed = csvFile.split('.')[0] + '_indexed.csv';
  let jsonFile = csvFile.split('.')[0] + '.json';
  console.log(`Converting ${csvFile} to ${jsonFile}`)

  const data = fs.readFileSync(csvFileIndexed, 'utf8')
  let jsonData = await neatCsv(data);
  await fs.writeFileSync(jsonFile, JSON.stringify(jsonData));
  console.log(jsonData[0])
  convertCount = convertCount + 1;
  if (convertCount === batchFiles.length) return;
  return await convertToJson(batchFiles)
}

async function processLineByLine(file, batchFiles) {
  const fileStream = fs.createReadStream(file);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  let indexedFile = `${file.split('.')[0]}_indexed.csv`
  let i = 0;
  let keys;
  console.log("Indexing CSV file begin...")
  for await (const line of rl) {
    let arr = line.split(',').map(e => e.replace(/"/g, ""));
    let indexed = [...arr].map(e => `_${e}`);
    let slugged = [...arr].map(e => slug(e));
    if (i === 0) fs.appendFileSync(indexedFile, [...arr, ...indexed].join(','));
    if (i > 0) fs.appendFileSync(indexedFile, `\n${[...arr, ...slugged].join(',')}`);
    i = i + 1;
  }
  console.log("Indexing CSV complete", processCount);
  processCount = processCount + 1;
  return processCount === batchFiles.length
    ? convertToJson(batchFiles)
    : processLineByLine(batchFiles[processCount], batchFiles);
}


let data = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
let lines = data.split(`\n`);
let lineCount = 100000;
let fileCounts = Math.ceil(lines.length / lineCount);
const createBatchFiles = () => {
  let batchFiles = [];
  for (let i = 0; i < fileCounts; i++) {
    let start = lineCount * i;
    let stop = start + lineCount;
    console.log(start, stop);
    let newLinesArr = lines.slice(start, stop);
    if (i > 0) newLinesArr.unshift(lines[0])
    let newLines = newLinesArr.join('\n');
    fs.writeFileSync(`${batchPrefix}_${i}.csv`, newLines);
    batchFiles.push(`${batchPrefix}_${i}.csv`)
  }
  // convertToJson(batchFiles)
  processLineByLine(batchFiles[0], batchFiles);
}

createBatchFiles()
