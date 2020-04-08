const express = require('express');

const Posts = require('./data/db.js');
const postsRouter = require('./data/router.js');

// const Hubs = require('./hubs/hubs-model.js');
// const hubsRouter = require('./hubs/router.js');

const server = express();

server.use(express.json());

server.use("/api/posts", postsRouter);

// Endpoints

server.get('/', (req, res) => {
    res.send(`
        <h2>API is running.</h2>
    `)
})

server.listen(5002, () => {
    console.log('\n*** Server Running on http://localhost:5002 ***\n');
  });