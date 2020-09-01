const Post = require("../models/post");

exports.createPost = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then((createdPost) => {
        res.status(201).json({
            message: "post added successfully",
            post: {
                ...createdPost,
                id: createdPost._id,
            },
        });
    }).catch(error => {
        res.status(500).json({
            message: "creating a post failed!"
        });
    });
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then((result) => {
        if (result.nModified > 0) {
            res.status(200).json({
                message: "updated successfully!",
            });
        } else {
            res.status(401).json({
                message: "not authorized!",
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "updating a post failed!"
        });
    });;
}

exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;

    if (currentPage && pageSize) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    postQuery
        .then((documents) => {
            this.fetchedPosts = documents;
            return Post.countDocuments(); //maximum posts in database
        })
        .then((count) => {
            res.status(200).json({
                message: "post fetched successfully!",
                posts: this.fetchedPosts,
                maxPosts: count,
            });
        }).catch(error => {
            res.status(500).json({
                message: "fetching posts failed!"
            });
        });
}

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({
                message: "post not found",
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "fetching the post failed!"
        });
    });;
}

exports.deletePost = (req, res, next) => {

    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result) => {
        if (result.n > 0) {
            res.status(200).json({
                message: "post deleted!",
            });
        } else {
            res.status(401).json({
                message: "not authorized!",
            });
        }

    }).catch(error => {
        res.status(500).json({
            message: "deleting posts failed!"
        });
    });;
}