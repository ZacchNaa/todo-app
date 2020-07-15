const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

//array of todo list
const items = [
  "Do some shopping",
  "And some cooking",
  "Plus some eating, if time permit! 😉",
];

const workItems = [];
//templating engine EJS
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  const day = date.getDate();
  res.render("list", { listTitle: day, todoItems: items });
});

app.post("/", function (req, res) {
  const item = req.body.todoItem;
  const wList = req.body.list;
  if (wList === "Work List") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/Work", function (req, res) {
  res.render("list", { listTitle: "Work List", todoItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about.ejs");
});

// server is listening
app.listen(3000, function () {
  console.log("Server is running on port 3000!");
});

/* =====================MISCELLANEOUS================================================= */
/* 
THIS MIGHT BE USEFUL CODE SNIPPET
const currentDay = today.getDay();
const day = "";
switch (currentDay) {
case 0:
  day = "Sunday";
  break;
case 1:
  day = "Monday";
  break;
case 2:
  day = "Tuesday";
  break;
case 3:
  day = "Wednesday";
  break;
case 4:
  day = "Thursday";
  break;
case 5:
  day = "Friday";
  break;
case 6:
  day = "Saturday";
  break;

default:
  console.log(`Error: current day is: ` + currentDay);
}

EJS TEMPLATE SNIPconstS
// This snipconst would appear on the .ejs file

<% if(listTitle==="Saturday" || listTitle==="Sunday") { %>
    <h1 style="color: purple;">To Do List for <%= listTitle %>!</h1>
    <% }else { %>
    <h1 style="color: blue;">To Do List for <%= listTitle %>!</h1>
    <% } %>
 */
