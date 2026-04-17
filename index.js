const express = require("express");
const app = express();

const mongoose = require("mongoose");

app.use(express.json());

mongoose.connect("mongodb://localhost/toDoList");
// I create a database called "toDoList" that will be running on the server localhost.
// If no element at all are created inside the model mongoose mongoDb won't actually create the database

const ToDoList = mongoose.model("To-do-list", {
  message: {
    // message is the name of the field I want to create inside my model
    type: String,
    required: true,
  },
});

// CRUD - Create - Read - Update - Delete

// CREATE - using the method post and having to pass values inside the body
// we use the method save to simply save new changes made to the model
app.post("/todos", async (req, res) => {
  try {
    const newToDoList = new ToDoList({
      message: req.body.message,
    });

    await newToDoList.save();
    res.json(newToDoList);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// READ - using the method get
// we use the method find() to find an element inside our model
app.get("/todos", async (req, res) => {
  try {
    const allLists = await ToDoList.find();
    // this method returns all the documents created inside your model, inside of your database :)
    res.json(allLists);
    // "We send all the results found in the database back to the client as JSON"
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE - using the method put
// For this we are using the methods findOne() & save()

app.put("/todos/:id", async (req, res) => {
  try {
    const updatedToDoList = await ToDoList.findOne({
      _id: req.params.id,
      // query because of the params in the route itself
    });
    updatedToDoList.message = req.body.message;
    // "This line reassigns the field message of the found document to the new value passed in the request body
    await updatedToDoList.save();
    res.json(updatedToDoList);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE - using the method delete
// There are 2 ways and methods you can use for the following : 1) method = findByIdAndDelete() & 2) method = deleteOne()

app.delete("/todos/:id", async (req, res) => {
  try {
    // ⬇️⬇️⬇️ Using the method findByIdAndDelete
    await ToDoList.findByIdAndDelete(req.params.id);

    // ⬇️⬇️⬇️ Using the method deleteOne //
    const deletedList = await ToDoList.findById(req.params.id);
    // We create a variable and assign it for value the returned promise of the id sent as params if it exists in our model ToDoList in mongoose
    await deletedList.deleteOne();
    // we delete it an return a json
    res.json("Message deleted");
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.all(/.*/, (req, res) => {
  res.status(404).json("Route not found");
});

app.listen(3000, () => {
  console.log("Server has started");
});
