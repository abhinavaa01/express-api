const express = require('express');
const app = express();
const cors = require("cors");

app.use(cors());

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    // res.status(500).json({
    //     message: "hello world"
    // });
    res.render("index", {text: 4});
})

const userRouter = require('./routes/users');
const todosRouter = require("./routes/todos")

app.use('/users', userRouter);
app.use('/todos', todosRouter);

app.listen(4100);