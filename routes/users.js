const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const fs = require("fs").promises; // Use the promises API for cleaner async/await
const path = require("path");

router.use(express.json());

const dbFilePath = path.join(__dirname, "../db.json");

router
  .route("/")
  .get(async (req, res) => {
    const { id, email, username } = req.query;
    try {
      const data = await fs.readFile(dbFilePath, "utf8");
      const jsonFile = JSON.parse(data);
      let users = jsonFile.users;
      if (id) {
        users = users.filter((user) => user.id === id);
      }
      if (email) {
        users = users.filter((user) => user.email === email);
      }
      if (username) {
        users = users.filter((user) => user.username === username);
      }
      res.json(users);
    } catch (error) {
      console.error("Error reading db.json:", error);
      res.status(500).send("Error reading data");
    }
  })
  .post(async (req, res) => {
    console.log("new Request: " + req.body);
    try {
      const {
        id = uuid.v4(),
        email = "temp@mail.com",
        password = "..",
        username = "noname",
      } = req.body;

      const newUser = {
        id: id,
        email: email,
        username: username,
        password: password,
      };

      const data = await fs.readFile(dbFilePath, "utf8");
      const jsonFile = JSON.parse(data);
      jsonFile.users.push(newUser);

      fs.writeFile(dbFilePath, JSON.stringify(jsonFile, null, 2), "utf8");

      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error while creating User: " + error);
      res.status(500).send("Error while creating new User");
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const id = req.params.id;
      const data = await fs.readFile(dbFilePath, "utf8");
      const jsonFile = JSON.parse(data);
      const user = jsonFile.users.find((user) => user.id === id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).send("No user Found with id");
      }
    } catch (error) {
      console.error("Error Fetchiung User:", error);
      res.status(500).send("Error Fetchiung User");
    }
  })
  .put(async(req, res) => {
    try {
        const data = await fs.readFile(dbFilePath, 'utf8');
        const jsonFile = JSON.parse(data);
        const users = jsonFile.users;
    
        const index = users.findIndex(user => user.id === req.params.id);
    
        if (index !== -1) {
            users[index] = {...users[index], ...req.body};
            await fs.writeFile(dbFilePath, JSON.stringify(jsonFile, null, 2), 'utf8');
            res.json({ message: "Todo Updated", user: req.body });
        } else {
          res.status(404).send("Todo not found");
        }
    }
    catch (error) {
        console.error("Error updating user: " + error);
        res.status(500).send("Error updating user");
    }
  })
  .delete(async(req, res) => {
    try {
        const data = await fs.readFile(dbFilePath, 'utf8');
        const jsonFile = JSON.parse(data);
        const users = jsonFile.users;
    
        const index = users.findIndex(user => user.id === req.params.id);
    
        if (index !== -1) {
          const deleted = users.splice(index, 1)[0]; 
          await fs.writeFile(dbFilePath, JSON.stringify(jsonFile, null, 2), 'utf8');
          res.json({ message: "User deleted", user: deleted });
        } else {
          res.status(404).send("User not found");
        }
      } catch (error) {
        console.error("Error deleting User:", error);
        res.status(500).send("Error deleting User");
      }
  });

module.exports = router;
