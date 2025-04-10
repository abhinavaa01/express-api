const express = require('express');
const router = express.Router();
const jsonFile = require('../db.json');

router.get("/", (req, res) => {
    console.log("Query:", req.query);
    res.send(jsonFile.users);
});

router.get("/new", (req, res) => {
    res.send("New user form");
});

router.get("/:id", (req, res) => {
    res.json(jsonFile.users[req.params.id]);
    // res.send("User with id: " + req.params.id);
})

router.route("/:id")
    .get((req, res) => {
        res.send("User with id: " + req.params.id);
    })
    .post((req, res) => {
        res.send("Add user with id: " + req.params.id);
    })
    .put((req, res) => {
        res.send("Update user with id: " + req.params.id);
    })
    .delete((req, res) => {
        res.send("Delete user with id: " + req.params.id);
    });



module.exports = router;