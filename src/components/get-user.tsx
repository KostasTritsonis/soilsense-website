import { getUserByEmail } from "@/actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function getUser() {
  const user = await currentUser();
  if (!user) {
    // Let Clerk middleware handle the redirect with proper locale
    // Default to 'en' if we can't determine locale from context
    redirect("/en/sign-in");
  }
  const dbUser = await getUserByEmail(user.emailAddresses[0].emailAddress);
  if (!dbUser) {
    throw new Error("User not found");
  }
  return dbUser;
}
