const express = require("express");
const UserDb = require("./userDb");
const PostDb = require("../posts/postDb");
const router = express.Router();

router.post("/", validateUser, async (req, res) => {
  try {
    const user = await UserDb.insert(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding user" });
  }
});

router.post("/:id/posts", validateUserId, validatePost, async (req, res) => {
  try {
    const post = await PostDb.insert(req.body);
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding post" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await UserDb.get();
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(400).json({ message: "Sorry, that user is invalid" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user information" });
  }
});

router.get("/:id", validateUserId, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserDb.getById(id);
    if (user) {
      res.status(200).json(user);
    } else { 
      res
        .status(400)
        .json({ message: "Sorry, no user with that ID was found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error retrieving user information" });
  }
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await UserDb.getUserPosts(id);
    if (posts) {
      res.status(200).json(posts);
    } else {
      res.status(400).json({ message: "This user's posts were not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error retrieving posts" });
  }
});

router.delete("/:id",  async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await UserDb.remove(id);
    if (deletedUser) {
      res.status(204).json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "Could not find user" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting post" });
  }
});

router.put("/:id", validateUser, async (req, res) => {
  try {
    const user = await UserDb.update(req.params.id, req.body);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "This user could not be found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating user" });
  }
});

//custom middleware
///SOMETHINGS WRONG WITH THIS ONE
async function validateUserId(req, res, next) {
  const { id } = req.params;
  try {
    const user = await UserDb.getById(id);
    if (user) {
      // req.user = user;
      next();
    } else {
      res.status(400).json({ messge: "Invalid user ID" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "There was an error validating your user ID." });
  }
}

async function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "Missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "Missing required name field" });
  } else {
    next();
  }
}

async function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "Missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "Missing required text field" });
  } else {
    next();
  }
}
module.exports = router;
