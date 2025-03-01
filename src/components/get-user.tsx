import { getUserByEmail } from '@/actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function getUser() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const dbUser = await getUserByEmail(user.emailAddresses[0].emailAddress);
  if (!dbUser) {
    throw new Error("User not found");
  }
  return dbUser;
}
