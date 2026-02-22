import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

/**
 * Home: redirects to dashboard when signed in, otherwise to sign-in.
 */
export default async function HomePage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }
  redirect("/sign-in");
}
