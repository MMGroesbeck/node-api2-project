const express = require('express');

const Posts = require("./db.js");

const router = express.Router();

// Endpoints for "/api/posts"

// GET all posts
router.get('/', (req, res) => {
    Posts.find()
    .then( resp => {
        res.status(200).json(resp);
    })
    .catch( err => {
        res.status(500).json({ error: "Error retrieving posts from database."});
    })
})

// GET post with specified ID
router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: `Post with ID ${req.params.id} not found.`});
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Error retrieving post from database."
        })
    });
})

// GET array of comments for post with specified ID
// /api/posts/:id/comments
// post not found: status 404, { message: "error message" }
// error retrieving comments: cancel, status 500, { error: "error message" }
// success: status 200, return array of comment objects
router.get('/:id/comments', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if (!post) {
            res.status(404).json({ message: "Post not found." });
        } else {
            Posts.findPostComments(req.params.id)
            .then( comments => {
                if (!comments) {
                    res.status(404).json({ message: "No comments on specified post." });
                } else {
                    res.status(200).json(comments);
                }
            })
            .catch( err => {
                res.status(500).json({ error: `Error retrieving comments: ${err}`});
            })
        }
    })
    .catch(err => {
        res.status(500).json({ error: `Error retrieving post: ${err}`});
    })
})

// POST new post with info in request body
// /api/posts
// missing title or contents: cancel request, status 400, return { errorMessage: "Title and contents both required." }
// valid info: save new post to DB, return status 201, return new post (not request body)
// error while saving: cancel request, status 500, return { error: "message here" }
router.post('/', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Title and contents are both required." });
    } else {
        Posts.insert(req.body)
        .then(postId => {
            Posts.findById(postId.id)
            .then( resp => {
                if (resp){
                    res.status(201).json(resp);
                } else {
                    res.status(500).json({ error: "Error retrieving new post."});
                }
            })
            .catch( err => {
                res.status(500).json({ error: "Error sending request for new post."});
            })
        })
        .catch(err => {
            res.status(500).json({ error: "Error saving new post." });
        })
    }
})

// POST new comment for post with specified ID
// /api/posts/:id/comments
// post not found: return status 404, { errorMessage: "error message" }
// request missing text: cancel, return status 400, { errorMessage "error message" }
// valid info: save new comment, return status 201, return new comment
// error when saving: cancel, return status 500, { error: "error message" }
router.post('/:id/comments', (req, res) => {
    if (!req.body.text) {
        res.status(400).json({ errorMessage: "Adding a comment requires text." });
    } else {
        console.log(`Post ID: ${req.body.post_id}`);
        Posts.findById(req.body.post_id)
        .then(post => {
            if (!post) {
                res.status(404).json({ errorMessage: "Post not found." });
            } else {
                Posts.insertComment(req.body)
                .then(resp => {
                    Posts.findCommentById(resp.id)
                    .then(newComm => {
                        res.status(201).json(newComm);
                    })
                    .catch(err => {
                        res.status(500).json({ error: "Error retrieving new comment." });
                    })
                })
                .catch(err => {
                    res.status(500).json({ error: "Error saving new comment." });
                })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "Error retrieving post to add comment." });
        })
    }
})

// DELETE post with specified ID
// /api/posts/:id (req.params.id)
// ID not found: return status 404, { message: "404 message" }
// error removing: cancel request, return status 500, { error: "error message" }
// success: RETURN DELETED POST
router.delete('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if(!post){
            res.status(404).json({ message: "Post not found." });
        } else {
            Posts.remove(req.params.id)
            .then(resp => {
                if (resp > 0) {
                    res.status(200).json(post);
                } else {
                    res.status(500).json({ error: "Post not deleted." });
                }
            })
            .catch(er => {
                res.status(500).json({ error: "Error deleting post." });
            })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "Error retrieving post." });
    })
})

// PUT updates post with specified ID with data from request body
// /api/posts/:id
// ID not found: status 404, { message: "error message." }
// request missing title or contents: cancel, status 400, { message: "error message" }
// error when updating: status 500, { error: "error message" }
// success: status 200, return newly updated post (not request)
router.put('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if(!post){
            res.status(404).json({ message: "Post not found." });
        } else {
            if(!req.body.title || !req.body.contents){
                res.status(400).json({ message: "Please include title and contents." });
            } else {
                Posts.update(req.params.id, { title: req.body.title, contents: req.body.contents })
                .then(count => {
                    if(count > 0){
                        Posts.findById(req.params.id)
                        .then(nowPost => {
                            res.status(200).json(nowPost);
                        })
                        .catch(e => {
                            res.status(500).json({ error: "Unable to retrieve updated post." });
                        })
                    } else {
                        res.status(500).json({ error: "Post not updated." });
                    }
                })
                .catch(er => {
                    res.status(500).json({ error: "Error updating post." });
                })
            }
        }
    })
    .catch(err => {
        res.status(500).json({ error: "Error finding post." });
    })
})



module.exports = router;