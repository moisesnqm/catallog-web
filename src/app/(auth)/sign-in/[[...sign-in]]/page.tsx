import { SignIn } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

/**
 * Sign-in page for Clerk authentication.
 */
export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignIn />
    </div>
  );
}
