const fs = require("fs");
const path = require("path");

const readCertificate = (filePath) =>
  fs.readFileSync(filePath, "utf8").replace(/\\n/gm, "\n");

const getFromDir = (dir) => {
  return {
    privateKey: readCertificate(path.join(dir, "private.key")),
    publicKey: readCertificate(path.join(dir, "public.key")),
  };
};

const keysPath = path.join(__dirname, "keys");

exports.certificates = [
  getFromDir(path.join(keysPath, "1")),
  getFromDir(path.join(keysPath, "2")),
];
