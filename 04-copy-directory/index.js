const process = require("process");
const path = require("path");
const fsPromises = require("fs/promises");
const pathToCopyFolder = path.join(__dirname, "files-copy");
const pathToFolder = path.join(__dirname, "files");

const copyFileToFolder = async (src, dir) => {
  await fsPromises.rm(dir, { recursive: true, force: true });
  await fsPromises.mkdir(dir, { recursive: true });

  const filesToCopy = await fsPromises.readdir(src, { withFileTypes: true });

  for (let elem of filesToCopy) {
    const pathFromFile = path.join(src, elem.name);
    const pathToFile = path.join(dir, elem.name);
    if (elem.isFile()) await fsPromises.copyFile(pathFromFile, pathToFile);
    else await copyFileToFolder(pathFromFile, pathToFile);
  }
};

try {
  copyFileToFolder(pathToFolder, pathToCopyFolder);
} catch (error) {
  process.stderr.write(`Error: ${error.message}`);
  process.exit(1);
}
