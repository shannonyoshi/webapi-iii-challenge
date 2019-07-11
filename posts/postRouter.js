const express = require("express");

const PostDb = require("./postDb");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await PostDb.get();
    if (posts) {
    res.status(200).json(posts)
    } else {
        res.status(404).json({ message: "Posts not found"})
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving posts data" });
  }
});

router.get("/:id",validatePostId, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostDb.getById(id);
    if (post) {
    res.status(200).json(post)
    } else {
        res.status(404).json({message: "Post not found"})
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving this post data" });
  }
});

router.delete("/:id", validatePostId, async (req, res) => {
    const {id} =req.params;
    try{
        const deleted = await PostDb.remove(id)
        if (deleted) {
         res.status(204).json({message: "This post was deleted"})
        } else {
            res.status(404).json({ message: "This post was not found"})
        }
    } catch(error){
      console.log(error)
      res.status(500).json({message: "Error deleting post"})
    }
});

router.put("/:id", validatePostId, async (req, res) => {
    try{
         const post = await PostDb.update(req.params.id, req.body)
    if (post) {
        res.status(200).json(post)
    } else {
        res.status(404).json({message: "This post was not found"})
    }
        }catch (error) {
            console.log(error);
    res.status(500).json({ message: "Error retrieving this post data" });
        }
});

// custom middleware

async function validatePostId(req, res, next) {
  const {id} = req.params;
  try {
    const post = await PostDb.getById(id);
    if (post) {
      next();
    } else {
      res.status(404).json({message:"This post was not found"})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Error retrieving this post"})
  }
}

module.exports = router;
