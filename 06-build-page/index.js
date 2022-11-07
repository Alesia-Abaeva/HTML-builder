const fs = require("fs");
const { mkdir, copyFile, readdir, readFile, rm, stat } = require("fs/promises");
const { join, extname } = require("path");
const { stderr, exit } = require("process");
const { pipeline } = require("stream/promises");

const dist = "project-dist";

const styleBild = join(__dirname, "styles");
const styleDist = join(__dirname, dist, "style.css");
const assetsBild = join(__dirname, "assets");
const assetsDist = join(__dirname, dist, "assets");
const template = join(__dirname, "template.html");
const index = join(__dirname, dist, "index.html");
const components = join(__dirname, "components");

const copyFileToFolder = async (src, dir) => {
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  const filesToCopy = await readdir(src, { withFileTypes: true });

  for (let elem of filesToCopy) {
    const pathFromFile = join(src, elem.name);
    const pathToFile = join(dir, elem.name);
    const stats = await stat(pathFromFile);
    if (stats.isFile()) await copyFile(pathFromFile, pathToFile);
    else await copyFileToFolder(pathFromFile, pathToFile);
  }
};

const mergeStyle = async (origin, newStyle) => {
  fs.createWriteStream(newStyle);

  const stylesFolder = await readdir(origin, {
    withFileTypes: true,
  });

  for (let element of stylesFolder) {
    const pathElem = join(origin, element.name);

    if (element.isFile() && extname(pathElem) === ".css") {
      const readStream = fs.createReadStream(pathElem);
      const writeStream = fs.createWriteStream(newStyle, { flags: "a" });

      await pipeline(readStream, writeStream);
    }
  }
};

const createHtml = async (components, template, output) => {
  const readStream = fs.createReadStream(template, "utf-8");
  const writeStream = fs.createWriteStream(output);

  let templateHtml = "";

  readStream.on("data", (chunk) => {
    templateHtml += chunk;
  });

  readStream.on("end", async () => {
    const tags = [...templateHtml.matchAll(/{{(.*)}}/g)];

    for (let elem of tags) {
      const pathComponent = join(components, `${elem[1]}.html`);
      const content = await readFile(pathComponent);
      templateHtml = templateHtml.replace(elem[0], content);
    }
    writeStream.write(templateHtml);
  });
};

const createFuncrion = async () => {
  try {
    await copyFileToFolder(assetsBild, assetsDist);
    await mergeStyle(styleBild, styleDist);
    await createHtml(components, template, index);
  } catch (error) {
    stderr.write(`Warning error: ${error.message}`);
    exit();
  }
};

createFuncrion();
