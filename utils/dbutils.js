'use server'

import { revalidatePath } from "next/cache";
import prisma from "./db";
import { currentUser } from "@clerk/nextjs/server";

export const getExistingUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: {
      email: email,
    },
  })
};

export const createUser = async (user) => {
  return prisma.user.create({
    data: user,
  });
};

export const updateUserThread = async (email, messages) => {
  let userThread = JSON.stringify(messages);
  return prisma.user.update(
    {
      where: {
        email: email,
      },
      data: {
        thread: userThread,
      },
    }
  )
};

export async function getUserMessages() {

  const user = await currentUser();
  const email = user.emailAddresses[0].emailAddress;
  const name = user.firstName + ' ' + user.lastName;

  // Check if the user exists in our database
  let dbUser = await getExistingUserByEmail(email);

  if (!dbUser) {
    // Create a new user if not found
    dbUser = await createUser({
      email: email,
      name: name,
      thread: JSON.stringify([]),
    });
  }

  // Return the user's messages
  const messages = JSON.parse(dbUser.thread || '[]');
  return messages;
}

export async function saveUserMessages(messages) {
  const user = await currentUser();
  const email = user.emailAddresses[0].emailAddress;

  // Update the user's thread in the database
  await updateUserThread(email, messages);
}

export const fetchCreditsByUserId = async (userId) => {
  const result = await prisma.credit.findUnique({
    where: {
      userId: userId,
    },
  });
  return result?.credits;
}

export const generateCreditsForUserId = async (userId) => {
  const result = await prisma.credit.create({
    data: {
      userId: userId,
    },
  });
  return result?.credits;
}

export const fetchOrGenerateCredits = async (userId) => {
  const result = await fetchCreditsByUserId(userId);
  if (result) {
    return result;
  }
  return (await generateCreditsForUserId(userId)).credits;
}

export const updateCredits = async (userId, credits) => {
  const result = await prisma.credit.update({
    where: {
      userId: userId,
    },
    data: {
      credits: {
        decrement: credits,
      }
    },
  });
  revalidatePath('/profile');
  return result.credits;
}

export const getUserInfo = async () => {
  const user = await currentUser();
  const email = user.emailAddresses[0].emailAddress;

  // Check if the user exists in our database
  let dbUser = await getExistingUserByEmail(email);
  return dbUser?.id;
};
