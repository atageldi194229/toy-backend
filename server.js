const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { errorHandler } = require("./middleware/error.middleware");

// Load env vars
require("dotenv").config();

const app = express();

const http = require("http").Server(app);
// const options = { // example: use npm package selfsigned
//   key: pems.private,
//   cert: pems.cert,
//   ca: pems.public,
// };
// const https = require("https").createServer(options, app);

// express-fileupload
app.use(
  fileUpload({
    limits: {
      fileSize: 100 * 1024 * 1024,
      // useTempFiles: true,
      // tempFileDir: path.join(__dirname, "public/tmp/"),
    },
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Mount routers
app.use(require("./routes"));

// Error Handler
app.use(errorHandler);

const HTTP_PORT = process.env.HTTP_PORT || 3001;
// const HTTPS_PORT = process.env.HTTPS_PORT || 3002;

// Serve http server
http.listen(HTTP_PORT, () =>
  console.log(`http server listening on port ${HTTP_PORT}`)
);

// // Serve https server
// https.listen(HTTPS_PORT, () =>
//   console.log(`https server listening on port ${HTTPS_PORT}`)
// );
