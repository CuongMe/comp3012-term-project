import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import * as db from "../prisma_db";

router.get("/", async (req, res) => {
  try {
    const posts = await db.getPosts(20);
    res.render("posts", { posts, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching posts");
  }
});

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts", { error: null, title: "", link: "", description: "", subgroup: "" });
});

router.post("/create", ensureAuthenticated, async (req, res) => {
  const { title, link, description, subgroup } = req.body;

  if ((!link?.trim() && !description?.trim()) || !subgroup?.trim()) {
    return res.status(400).render("createPosts", {
      error: "You must supply a subgroup and at least a link or description.",
      title, link, description, subgroup
    });
  }
});

router.get("/show/:postid", async (req, res) => {
  const { postid } = req.params;
  const postIdNum = parseInt(postid, 10);
  if (isNaN(postIdNum)) {
    return res.status(400).send("Invalid post ID");
  }
  try {
    const post = await db.getPost(postIdNum);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    res.render("individualPost", { post, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving post");
  }
});

router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  const { postid } = req.params;
  const postIdNum = parseInt(postid, 10);
  if (isNaN(postIdNum)) {
    return res.status(400).send("Invalid post ID");
  }
  try {
    const post = await db.getPost(postIdNum);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    if (!req.user) {
      return res.status(401).send("You must be logged in to create a post.");
    }
    if (post.creator?.id !== req.user.id) {
      return res.status(403).send("Not authorized to edit this post");
    }
    res.render("editPost", { post });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving post for editing");
  }
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  const { postid } = req.params;
  const postIdNum = parseInt(postid, 10);
  const { title, link, description, subgroup } = req.body;
  if (isNaN(postIdNum)) {
    return res.status(400).send("Invalid post ID");
  }
  try {
    const post = await db.getPost(postIdNum);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    if (!req.user) {
      return res.status(401).send("You must be logged in to create a post.");
    }
    if (post.creator?.id !== req.user.id) {
      return res.status(403).send("Not authorized to edit this post");
    }
    await db.editPost(postIdNum, { title, link, description, subgroup });
    res.redirect(`/posts/show/${postIdNum}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error editing post");
  }
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  const { postid } = req.params;
  const postIdNum = parseInt(postid, 10);
  if (isNaN(postIdNum)) {
    return res.status(400).send("Invalid post ID");
  }
  try {
    const post = await db.getPost(postIdNum);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    if (!req.user) {
      return res.status(401).send("You must be logged in to create a post.");
    }
    if (post.creator?.id !== req.user.id) {
      return res.status(403).send("Not authorized to delete this post");
    }
    res.render("deleteConfirm", { post });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error preparing delete confirmation");
  }
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  const { postid } = req.params;
  const { action } = req.body; 
  const postIdNum = parseInt(postid, 10);
  if (isNaN(postIdNum)) {
    return res.status(400).send("Invalid post ID");
  }
  try {
    const post = await db.getPost(postIdNum);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    if (!req.user) {
      return res.status(401).send("You must be logged in to create a post.");
    }
    if (post.creator?.id !== req.user.id) {
      return res.status(403).send("Not authorized to delete this post");
    }
    if (action === "cancel") {
      return res.redirect(`/posts/show/${postIdNum}`);
    }
    await db.deletePost(postIdNum);
    res.redirect(`/subs/show/${post.subgroup}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing deletion");
  }
});

router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    const { postid } = req.params;
    const postIdNum = parseInt(postid, 10);
    const { description } = req.body;
    if (isNaN(postIdNum)) {
      return res.status(400).send("Invalid post ID");
    }
    if (!description || description.trim() === "") {
      return res.status(400).send("Comment cannot be empty");
    }
    try {
      const post = await db.getPost(postIdNum);
      if (!post) {
        return res.status(404).send("Post not found");
      }
      if (!req.user) {
        return res.status(401).send("You must be logged in to create a post.");
      }
      await db.addComment(postIdNum, req.user.id, description);
      res.redirect(`/posts/show/${postIdNum}`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding comment");
    }
  }
);

export default router;
