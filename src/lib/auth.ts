import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { connectDB } from "./db";
import { AdminUser } from "@/models/AdminUser";
import type { AdminRole } from "./constants";

const credentialsSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        await connectDB();
        const user = await AdminUser.findOne({ email: parsed.data.email.toLowerCase(), active: true }).select("+passwordHash");
        if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return null;
        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role as AdminRole };
      },
    }),
  ],
  callbacks: {
    // Re-read role and active flag on each session check, so deactivation and role changes apply immediately.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        return token;
      }
      if (!token.id) return token;
      await connectDB();
      const current = await AdminUser.findById(token.id).select("role active").lean();
      token.role = (current?.active ? current.role : undefined) as AdminRole;
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
};

export const getSession = () => getServerSession(authOptions);

/** For admin server components and route handlers. Redirects (pages) when unauthenticated. */
export async function requireAdmin(roles?: AdminRole[]) {
  const session = await getSession();
  if (!session?.user?.role) redirect("/admin/login");
  if (roles && !roles.includes(session.user.role)) redirect("/admin?denied=1");
  return session;
}

/** For API routes: returns the session or null (caller responds 401/403). */
export async function adminFromRequest(roles?: AdminRole[]) {
  const session = await getSession();
  if (!session?.user?.role) return { session: null, status: 401 as const };
  if (roles && !roles.includes(session.user.role)) return { session: null, status: 403 as const };
  return { session, status: 200 as const };
}
