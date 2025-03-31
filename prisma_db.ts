// prismaDB.ts
import { PrismaClient, User, Post, Comment, Vote } from '@prisma/client';

const prisma = new PrismaClient();


// Users
export async function getUser(id: number): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByUsername(uname: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { uname } });
}

// Votes
export async function getVotesForPost(postId: number): Promise<Vote[]> {
  return prisma.vote.findMany({ where: { postId } });
}

// Comments
export async function getCommentsForPost(postId: number): Promise<Comment[]> {
  return prisma.comment.findMany({
    where: { postId },
    orderBy: { timestamp: 'asc' },
    include: { user: true },
  });
}

export async function addComment(
  postId: number,
  creator: number,
  description: string
): Promise<Comment> {
  return prisma.comment.create({
    data: {
      postId,
      creator,
      description,
      timestamp: Date.now(),
    },
  });
}

export async function getComment(id: number): Promise<Comment | null> {
  return prisma.comment.findUnique({
    where: { id },
    include: { user: true },
  });
}

export async function deleteComment(id: number): Promise<Comment> {
  return prisma.comment.delete({
    where: { id },
  });
}

// Posts
export async function decoratePost(post: Post): Promise<any> {
  const creator = await getUser(post.creator);
  const votes = await getVotesForPost(post.id);
  const comments = await getCommentsForPost(post.id);
  return { ...post, creator, votes, comments };
}

export async function getPosts(n = 5, sub?: string): Promise<Post[]> {
  const whereClause = sub ? { subgroup: sub } : {};
  return prisma.post.findMany({
    where: whereClause,
    orderBy: { timestamp: 'desc' },
    take: n,
    include: { user: true },
  });
}

export async function getPost(id: number): Promise<any> {
  const post = await prisma.post.findUnique({
    where: { id },
    include: { user: true },
  });
  return post ? decoratePost(post) : null;
}

export async function addPost(
  title: string,
  link: string,
  creator: number,
  description: string,
  subgroup: string
): Promise<Post> {
  return prisma.post.create({
    data: {
      title,
      link,
      description,
      creator,
      subgroup,
      timestamp: Date.now(),
    },
  });
}

export async function editPost(
  post_id: number,
  changes: { title?: string; link?: string; description?: string; subgroup?: string }
): Promise<Post> {
  return prisma.post.update({
    where: { id: post_id },
    data: changes,
  });
}

export async function deletePost(post_id: number): Promise<Post> {
  return prisma.post.delete({ where: { id: post_id } });
}


// Subs (Subgroups)
export async function getSubs(): Promise<string[]> {
  const posts = await prisma.post.findMany({
    select: { subgroup: true },
  });
  const subs = Array.from(new Set(posts.map(post => post.subgroup)));
  subs.sort();
  return subs;
}

// Voting
export async function votePost(postId: number, userId: number, value: number) {
  try {
    if (value === 0) {
      return await prisma.vote.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      return await prisma.vote.upsert({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
        update: { value },
        create: {
          userId,
          postId,
          value,
        },
      });
    }
  } catch (err) {
    throw err;
  }
}
