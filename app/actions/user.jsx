'use server';

import prisma from "@/lib/db_conn";

export const checkOrCreateUser = async (user, account = null) => {
  try {
    if (!user?.email) {
      throw new Error("Email is required");
    }

    let dbUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
      include: {
        accounts: true
      }
    });

    if (!dbUser) {
      // Create new user if doesn't exist
      dbUser = await prisma.user.create({
        data: {
          email: user.email,
          name: user.name || null,
          image: user?.image || null,
        },
      });
    }

    // If we have account details and no matching account exists, create it
    if (account && !dbUser.accounts.some(acc => 
      acc.provider === account.provider && 
      acc.providerAccountId === account.providerAccountId
    )) {
      await prisma.account.create({
        data: {
          userId: dbUser.id,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      });
    }

    return dbUser;
  } catch (error) {
    console.error("Error in checkOrCreateUser:", error);
    throw new Error(error.message || "Failed to check or create user");
  }
};