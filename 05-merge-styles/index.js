const fs = require("fs");
const fsPromises = require("fs/promises");
const { join, extname } = require("path");
const { stderr, exit } = require("process");
const { pipeline } = require("stream/promises");

const pathToStile = join(__dirname, "styles");
const pathToBundle = join(__dirname, "project-dist", "bundle.css");

const mergeStyle = async () => {
  try {
    fs.createWriteStream(pathToBundle);
    //   create file 'bundle.css'

    const stylesFolder = await fsPromises.readdir(pathToStile, {
      withFileTypes: true,
    });
    // read folder style

    for (let element of stylesFolder) {
      const pathElem = join(pathToStile, element.name);

      if (element.isFile() && extname(pathElem) === ".css") {
        const readStream = fs.createReadStream(pathElem);
        const writeStream = fs.createWriteStream(pathToBundle, { flags: "a" });

        await pipeline(readStream, writeStream);
      }
    }
  } catch (error) {
    stderr.write(`Warning error: ${error.message}`);
    exit();
  }
};

mergeStyle();
