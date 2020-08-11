// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");

// reading DB file
var dataDB = fs.readFileSync("./db/db.json");

let data = JSON.parse(dataDB);

// Sets up the Express App
// =============================================================
const app = express();
const PORT = 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// renders notes.html page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "/public/index.html"));
// });

app.get("/api/notes", function (req, res) {
  return res.json(data);
});

/////////////////////////////////////////////////////////

app.post("/api/notes", function (req, res) {
  data.push(req.body);

  let dataJSON = JSON.stringify(data);

  fs.writeFile("./db/db.json", dataJSON, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });

  res.json(true);
});

/////////////////////////////////////////////////////////

app.delete("/api/notes/:id", function (req, res) {
  let id = req.params.id;

  for (i = 0; i < data.length; i++) {
    if (data[i].title.replace(/\s/g, '') == id) {
      data.splice(i, 1);
      break;
    }
  }
  let dataJSON = JSON.stringify(data);

  fs.writeFile("./db/db.json", dataJSON, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });

  res.json(data);
});

/////////////////////////////////////////////////////////

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
