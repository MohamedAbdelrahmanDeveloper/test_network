import fs from 'node:fs';
import path from 'node:path';

export function readFile(fileName) {
  const FilePath = path.join(process.cwd(), `/data/${fileName}`)
  if (!fs.existsSync(FilePath)) {
    fs.writeFileSync(FilePath, JSON.stringify([]))
  }
  try {
    const data = fs.readFileSync(FilePath, 'utf8');
    return data
  } catch (err) {
    console.error(err);
    return null
  }
}

export function writeFile(fileName, content) {
  try {
    const data = fs.writeFileSync(path.join(process.cwd(), `/data/${fileName}`), content);
    return data
  } catch (err) {
    console.error(err);
    return null
  }
}


export function setData(file,data) {
  const msgs = readFile(file);
  const msgs_json = JSON.parse(msgs);
  const isFind = msgs_json.find(element => {
    if (typeof data === 'object') {
      return JSON.stringify(element.username) === JSON.stringify(data.username);
    }
    else {
      return JSON.stringify(element) === JSON.stringify(data);
    }
  });
  if (!isFind) {
    msgs_json.push(data)
    console.log(typeof data === 'object' ? data.username : data)
  }
  writeFile(file, JSON.stringify(msgs_json));
}

export function setDataTwo(file,data) {
  const msgs = readFile(file);
  const msgs_json = JSON.parse(msgs);
  // const isFind = msgs_json.find(element => {
  //   if (typeof data === 'object') {
  //     return JSON.stringify(element.username) === JSON.stringify(data.username);
  //   }
  //   else {
  //     return JSON.stringify(element) === JSON.stringify(data);
  //   }
  // });
  const newArray = msgs_json.map(e => {
    if (e.username === data.username) {
      e = data
    }
    return e
  })
  if (newArray) {
    // msgs_json[isFind] = data
    // console.log(data);
    // msgs_json.push(data)
    // console.log(typeof data === 'object' ? data.username : data)
    writeFile(file, JSON.stringify(newArray));
  }
}