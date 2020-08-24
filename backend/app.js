const express = require("express");
const bodyParser = require("body-parser");

const app = express();

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
    const posts = req.body;
    console.log(posts);
    res.status(201).json({
        message: "post added successfully",
    });
    next();
});

app.get("/api/posts", (req, res, next) => {
    const posts = [{
            id: "1",
            title: "first server-side post",
            content: "this is coming first content from server",
        },
        {
            id: "2",
            title: "second server-side post",
            content: "this is coming second content from server",
        },
    ];
    res.status(200).json({
        message: "post fetched successfully!",
        posts: posts,
    });
});

module.exports = app;
