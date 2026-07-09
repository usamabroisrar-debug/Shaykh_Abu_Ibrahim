import { compare } from "bcrypt";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginSchema } from "@/schemas/auth.schema";
import { ensureSuperAdminUser, getUserByEmail } from "@/services/auth/auth.service";

function getNormalizedEnvValue(value: string | undefined, fallback: string) {
  const resolved = (value || fallback).trim();

  return resolved.replace(/^['"]|['"]$/g, "").trim();
}

export function getDashboardPath(role?: string | null) {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
    case "EDITOR":
      return "/admin";
    case "TEACHER":
      return "/teacher";
    case "PARENT":
    case "STUDENT":
    default:
      return "/student";
  }
}

function isProfileComplete(user: {
  role: string;
  name: string | null;
  studentProfile?: { guardianName: string | null; timezone: string | null } | null;
  teacherProfile?: { bio: string | null } | null;
}) {
  if (!user.name) {
    return false;
  }

  if (user.role === "TEACHER") {
    return Boolean(user.teacherProfile?.bio);
  }

  if (user.role === "STUDENT" || user.role === "PARENT") {
    return Boolean(user.studentProfile?.guardianName && user.studentProfile?.timezone);
  }

  return true;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email.trim().toLowerCase();
        const password = parsed.data.password;
        const configuredSuperAdminEmail = getNormalizedEnvValue(
          process.env.SUPER_ADMIN_EMAIL,
          "admin@shaykhabuibrahim.com"
        ).toLowerCase();
        const configuredSuperAdminPassword = getNormalizedEnvValue(
          process.env.SUPER_ADMIN_PASSWORD,
          "Admin@123456"
        );
        const isConfiguredSuperAdmin = email === configuredSuperAdminEmail;

        let user = isConfiguredSuperAdmin
          ? await ensureSuperAdminUser().catch(() => null)
          : await getUserByEmail(email).catch(() => null);

        if (isConfiguredSuperAdmin && password === configuredSuperAdminPassword) {
          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              profileComplete: isProfileComplete(user),
            };
          }

          return {
            id: "env-super-admin",
            email: configuredSuperAdminEmail,
            name: getNormalizedEnvValue(process.env.SUPER_ADMIN_NAME, "Super Admin"),
            role: "SUPER_ADMIN",
            profileComplete: true,
          };
        }

        if (!user?.password) {
          return null;
        }

        const passwordMatches = await compare(password, user.password);

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          profileComplete: isProfileComplete(user),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.profileComplete = user.profileComplete;
      }

      if (token.email) {
        const dbUser = await getUserByEmail(token.email);

        if (dbUser) {
          token.sub = dbUser.id;
          token.name = dbUser.name;
          token.role = dbUser.role;
          token.profileComplete = isProfileComplete(dbUser);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = typeof token.role === "string" ? token.role : "STUDENT";
        session.user.profileComplete = Boolean(token.profileComplete);
        session.user.dashboardPath = getDashboardPath(session.user.role);
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (url.startsWith(baseUrl)) {
        return url;
      }

      return baseUrl;
    },
  },
};

export function auth() {
  return getServerSession(authOptions);
}
