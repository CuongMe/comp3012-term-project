// const { ensureAuthenticated } = require("../middleware/checkAuth");
import express from "express";
import * as db from "../prisma_db";
const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const subs = await db.getSubs();
    res.render("subs", { subs });
  } catch (error) {
    console.error("Error fetching subgroups:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/show/:subname", async (req, res) => {
  try {
    const { subname } = req.params
    const posts = await db.getPosts(20, subname);
    res.render("sub", { subname, posts });
  } catch (error) {
    console.error("Error fetching posts for subgroup:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
