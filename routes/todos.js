const express = require('express');
const router = express.Router();
const uuid = require("uuid");
const fs = require('fs').promises; // Use the promises API for cleaner async/await
const path = require('path');

const dbFilePath = path.join(__dirname, '../db.json');

router.get("/", async (req, res) => {
    if (Object.keys(req.query).length) console.log(req.query);
    try {
        const data = await fs.readFile(dbFilePath, 'utf8');
        const jsonFile = JSON.parse(data);
        res.json(jsonFile.todos);
    } catch (error) {
        console.error('Error reading db.json:', error);
        res.status(500).send('Error reading data');
    }
});

router.route("/").post(async (req, res) => {
        try {
            const { text } = req.body;
            if (!text) {
                return res.status(400).send('Please provide the text for the new todo.');
            }

            const newTodo = {
                id: uuid.v4(),
                text: text,
                completed: false,
            };

            const data = await fs.readFile(dbFilePath, 'utf8');
            const jsonFile = JSON.parse(data);
            jsonFile.todos.push(newTodo);

            await fs.writeFile(dbFilePath, JSON.stringify(jsonFile, null, 2), 'utf8');

            res.status(201).json(newTodo);
        } catch (error) {
            console.error('Error adding todo:', error);
            res.status(500).send('Error adding todo');
        }
    });

router.route("/:id").get((req, res) => {
        res.send("User with id: " + req.params.id);
    });

module.exports = router;