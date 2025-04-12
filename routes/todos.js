const express = require('express');
const router = express.Router();
const uuid = require("uuid");
const fs = require('fs').promises; // Use the promises API for cleaner async/await
const path = require('path');

router.use(express.json());

const dbFilePath = path.join(__dirname, '../db.json');

router.get("/", async (req, res) => {
    const { userEmail, id, isCompleted } = req.query;
    try {
        const data = await fs.readFile(dbFilePath, 'utf8');
        const jsonFile = JSON.parse(data);
        let todos = jsonFile.todos;
        if (id) {
            todos = todos.filter((todo)=> todo.id === id);
        }
        if (userEmail) {
            todos = todos.filter((todo)=> todo.userEmail === userEmail);
        }
        if (isCompleted) {
            todos = todos.filter((todo)=> todo.isCompleted.toString() === isCompleted);
        }
        if (todos.length) {
            res.json(todos);
        } else {
            res.status(404).send("No such Todo Found");
        }
    } catch (error) {
        console.error('Error reading db.json:', error);
        res.status(500).send('Error reading data');
    }
});

router.post("/", async (req, res) => {
    // console.log(req.body.text);
    // res.send("hello");
        try {
            const { text, image = "", id = uuid.v4(), userEmail="abhinav@bahikhata.org" } = req.body;
            if (!text) {
                return res.status(400).send('Please provide the text for the new todo.');
            }

            const newTodo = {
                id: id,
                userEmail: userEmail,
                text: text,
                image: image,
                isCompleted: false
            };

            const data = await fs.readFile(dbFilePath, 'utf8');
            const jsonFile = JSON.parse(data);
            jsonFile.todos.push(newTodo);

            fs.writeFile(dbFilePath, JSON.stringify(jsonFile, null, 2), 'utf8');

            res.status(201).json(newTodo);
        } catch (error) {
            console.error('Error adding todo:', error);
            res.status(500).send('Error adding todo');
        }
    });

router.get("/:id", (async(req, res) => {
        const data = await fs.readFile(dbFilePath, 'utf8');
        const jsonFile = JSON.parse(data);
        const todos = jsonFile.todos;
        const result = todos.find((todo)=>todo.id === req.params.id)
        if (result) {
            res.json(result);
        } else {
            res.status(404).send("Not Found");
        }
    }));

router.delete("/:id", (async(req, res) => {
    try {
        const data = await fs.readFile(dbFilePath, 'utf8');
        const jsonFile = JSON.parse(data);
        const todos = jsonFile.todos;
    
        const index = todos.findIndex(todo => todo.id === req.params.id);
    
        if (index !== -1) {
          const deleted = todos.splice(index, 1)[0]; 
          await fs.writeFile(dbFilePath, JSON.stringify(jsonFile, null, 2), 'utf8');
          res.json({ message: "Todo deleted", todo: deleted });
        } else {
          res.status(404).send("Todo not found");
        }
      } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).send("Error deleting todo");
      }
}));

router.put("/:id", (async(req, res)=> {
    try {
        const data = await fs.readFile(dbFilePath, 'utf8');
        const jsonFile = JSON.parse(data);
        const todos = jsonFile.todos;
    
        const index = todos.findIndex(todo => todo.id === req.params.id);
    
        if (index !== -1) {
            todos[index] = {...todos[index], ...req.body};
            await fs.writeFile(dbFilePath, JSON.stringify(jsonFile, null, 2), 'utf8');
            res.json({ message: "Todo Updated", todo: req.body });
        } else {
          res.status(404).send("Todo not found");
        }
    }
    catch (error) {
        console.error("Error updating todo: " + error);
        res.status(500).send("Error updating todo");
    }
}));

module.exports = router;