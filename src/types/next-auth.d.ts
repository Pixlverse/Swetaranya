import type { AdminRole } from "@/lib/constants";

declare module "next-auth" {
  interface User {
    role: AdminRole;
  }
  interface Session {
    user: { id: string; name: string; email: string; role: AdminRole };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: AdminRole;
  }
}
