import { auth } from "auth";
import { MainNav } from "./main-nav";
import UserButton from "./user-button";
import Link from "next/link";

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky flex justify-center border-b">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <MainNav />
        <div className="flex space-x-4">
          {/* Render the Sign Up button only if user is not logged in */}
          {!session && (
            <Link
              href="/signup"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Sign Up
            </Link>
          )}
          <UserButton />
        </div>
      </div>
    </header>
  );
}
