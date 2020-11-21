//packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
//custom modules
const date = require(__dirname + "/date.js");

const app = express();

//templating engine EJS
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//connecting to mongoDB with mongoose
mongoose.connect(
  "mongodb+srv://zacchaeus_napuo:zacchaeus@cluster0.xpov6.mongodb.net/todolist",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

//creating db schemas
const itemsSchema = {
  name: {
    type: String,
    required: [true, "Have you got no to do items?"],
  },
};

//models
const Item = mongoose.model("Item", itemsSchema);

//creating documents
const item1 = new Item({
  name: "Welcome to your to do list",
});
const item2 = new Item({
  name: "Add to do items with the + button",
});
const item3 = new Item({
  name: "Remove items by ✅ checking the box by it",
});

const defaultItems = [item1, item2, item3];

//creating custom list
const listSchema = {
  name: {
    type: String,
    required: [true, "Your list is better with name!"],
  },
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

//GET RUOTES
app.get("/", function (req, res) {
  //reading from db
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully inserted 3 documents");
        }
      });
      res.redirect("/");
    } else {
      const day = date.getDate();
      res.render("list", {
        listTitle: "Today",
        todoItems: foundItems,
        day: day,
      });
    }
  });
});

app.get("/:listType", function (req, res) {
  const listType = _.capitalize(req.params.listType);

  List.findOne({ name: listType }, (err, listFound) => {
    if (!err) {
      if (!listFound) {
        //creat new list
        const list = new List({
          name: listType,
          items: defaultItems,
        });
        list.save();

        res.redirect("/" + listType);
      } else {
        const day = date.getDate();
        //show available list
        res.render("list", {
          listTitle: listFound.name,
          todoItems: listFound.items,
          day: day,
        });
      }
    } else {
      console.log(err);
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about.ejs");
});
//POST RUOTES
app.post("/", function (req, res) {
  const itemName = req.body.todoItem;
  const listName = req.body.list;
  //adding to do list
  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, listFound) => {
      listFound.items.push(item);
      listFound.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.deleteOne({ _id: checkedItemId }, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully removed item from list");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      (err, listFound) => {
        if (!err) {
          console.log("Successfully removed item from list");
          res.redirect("/" + listName);
        } else {
          console.log(err);
        }
      }
    );
  }
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
