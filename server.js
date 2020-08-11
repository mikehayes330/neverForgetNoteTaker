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
var PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// route to render notes.html page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// route to render HTML page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

//route to gets notes data and return
app.get("/api/notes", function (req, res) {
  return res.json(data);
});

// route for posting notes to DB
app.post("/api/notes", function (req, res) {
  //adds current note to data
  data.push(req.body);

  let dataJSON = JSON.stringify(data);

  //writes data to db.JSON file
  fs.writeFile("./db/db.json", dataJSON, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
  res.json(true);
});

/////////////////////////////////////////////////////////

// route to delete notes
app.delete("/api/notes/:id", function (req, res) {
  let id = req.params.id;
  //for loop runs through all the data titles removes and spaces and checks to see if it mataches the id variable that
  // comes over from the delete route, then deletes that from array with splice.
  for (i = 0; i < data.length; i++) {
    if (data[i].title.replace(/\s/g, "") == id) {
      data.splice(i, 1);
      break;
    }
  }
  // stringify the data
  let dataJSON = JSON.stringify(data);
  //write back to DB file
  fs.writeFile("./db/db.json", dataJSON, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
  res.json(data);
});

/////////////////////////////////////////////////////////

// listen
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
