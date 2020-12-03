const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    ok: "ok",
  });
});

app.post("/post", (req, res) => {
  res.status(200).json({
    body: req.body,
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
