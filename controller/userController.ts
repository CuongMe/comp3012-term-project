import * as db from "../prisma_db";

export const getUserByEmailIdAndPassword = async (
  uname: string,
  password: string
) => {
  const user = await db.getUserByUsername(uname);   
  if (user && user.password === password) {
    return user;
  }
  return null;
};

export const getUserById = async (id: number) => {
  const user = await db.getUser(id);                 
  return user ?? null;
};
