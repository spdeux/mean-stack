const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const Post = require("./models/post");

const app = express();

mongoose.connect('mongodb+srv://sepideh:fuJONNTzMd5gh29H@cluster0.ekeuh.mongodb.net/node-angular?retryWrites=true&w=majority').then(() => {
    console.log('connected to database!')
}).catch(() => {
    console.log('connection failed!')
});

//apply all incoming requests
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PATCH,DELETE,OPTIONS"
    );
    next();
});

app.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    })
    post.save().then(createdPost => {
        res.status(201).json({
            message: "post added successfully",
            postId: createdPost._id
        });
    });
});

app.get("/api/posts", (req, res, next) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: "post fetched successfully!",
            posts: documents,
        });
    });

});

app.delete("/api/posts/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result)
        res.status(200).json({
            message: 'post deleted!'
        });
    });

})

module.exports = app;