'use server'

import prisma from "@/lib/db_conn";


export const checkOrCreateUser = async (user) => {
try {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });

  if (existingUser) {
    return existingUser;
  }

  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      name : user.name,
      image : user?.image ? user?.image : null,
    },
  });

  return newUser;  
} catch (error) {
  console.log(error)
  throw new Error(error);
}
};
