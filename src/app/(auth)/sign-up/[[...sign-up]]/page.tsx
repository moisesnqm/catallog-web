import { SignUp } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

/**
 * Sign-up page for Clerk authentication.
 */
export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignUp />
    </div>
  );
}
