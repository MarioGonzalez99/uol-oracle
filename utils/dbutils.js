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

