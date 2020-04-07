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

// POST new post with info in request body
// /api/posts
// missing title or contents: cancel request, status 400, return { errorMessage: "Title and contents both required." }
// valid info: save new post to DB, return status 201, return new post (not request body)
// error while saving: cancel request, status 500, return { error: "message here" }

// POST new comment for post with specified ID
// /api/posts/:id/comments
// post not found: return status 404, { errorMessage: "error message" }
// request missing text: cancel, return status 400, { errorMessage "error message" }
// valid info: save new comment, return status 201, return new comment
// error when saving: cancel, return status 500, { error: "error message" }

// DELETE post with specified ID
// /api/posts/:id
// ID not found: return status 404, { message: "404 message" }
// error removing: cancel request, return status 500, { error: "error message" }
// success: RETURN DELETED POST

// PUT updates post with specified ID with data from request body
// /api/posts/:id
// ID not found: status 404, { message: "error message." }
// request missing title or contents: cancel, status 400, { message: "error message" }
// error when updating: status 500, { error: "error message" }
// success: status 200, return newly updated post (not request)



module.exports = router;