import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_SERVER = process.env.API_SERVER;

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${API_SERVER}/api/v1/login/access-token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            username: String(credentials?.username || ""),
            password: String(credentials?.password || ""),
          }),
        });

        const data = await res.json();
        if (res.ok && data.access_token) {
          return { id: data.user_id, accessToken: data.access_token };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }

      if (account && account.provider === "github" && !token.accessToken) {
        const response = await fetch(`${API_SERVER}/api/v1/auth/github-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: account.access_token }),
        });

        const data = await response.json();
        if (response.ok && data.backendToken) {
          token.accessToken = data.backendToken;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Fetch user info server-side only
      session.user = await fetchUserInfo(token.accessToken as string);
      session.accessToken = token?.accessToken as string;
      return session;
    },
  },
  basePath: "/auth",
});

// Helper function to fetch user info
async function fetchUserInfo(token: string) {
  const res = await fetch(`${API_SERVER}/api/v1/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch user info");
  return res.json();
}

declare module "next-auth" {
  interface Session {
    user?: any;
  }
}
