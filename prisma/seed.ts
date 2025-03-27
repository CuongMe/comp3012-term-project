import { PrismaClient } from "@prisma/client";
import { users, posts, comments, votes } from "../fake-db";

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  for (const user of Object.values(users)) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: { id: user.id, uname: user.uname, password: user.password },
    });
  }

  // Seed Posts
  for (const post of Object.values(posts)) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: {},
      create: {
        id: post.id,
        title: post.title,
        link: post.link,
        description: post.description,
        creator: post.creator,
        subgroup: post.subgroup,
        timestamp: BigInt(post.timestamp),
      },
    });
  }

  // Seed Comments
  for (const comment of Object.values(comments)) {
    await prisma.comment.upsert({
      where: { id: comment.id },
      update: {},
      create: {
        id: comment.id,
        postId: comment.post_id,
        creator: comment.creator,
        description: comment.description,
        timestamp: BigInt(comment.timestamp),
      },
    });
  }

  // Seed Votes
  for (const vote of votes) {
    await prisma.vote.upsert({
      where: { userId_postId: { userId: vote.user_id, postId: vote.post_id } },
      update: {},
      create: {
        userId: vote.user_id,
        postId: vote.post_id,
        value: vote.value,
      },
    });
  }

  console.log("✅ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
