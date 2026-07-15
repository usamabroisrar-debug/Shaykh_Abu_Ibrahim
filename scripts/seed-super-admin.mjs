import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

function normalizeConnectionString(value) {
  if (!value) {
    return undefined;
  }

  const cleaned = value.trim().replace(/^['"]|['"]$/g, "").trim();

  try {
    const url = new URL(cleaned);
    const sslMode = url.searchParams.get("sslmode");

    if (sslMode === "prefer" || sslMode === "require" || sslMode === "verify-ca") {
      url.searchParams.set("sslmode", "verify-full");
    }

    return url.toString();
  } catch {
    return cleaned.replace(/sslmode=(prefer|require|verify-ca)\b/i, "sslmode=verify-full");
  }
}

const connectionString =
  normalizeConnectionString(process.env.POSTGRES_URL_NON_POOLING) ||
  normalizeConnectionString(process.env.DATABASE_URL_UNPOOLED) ||
  normalizeConnectionString(process.env.POSTGRES_PRISMA_URL) ||
  normalizeConnectionString(process.env.DATABASE_URL);

if (!connectionString) {
  throw new Error("Database connection string is missing.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const email = (process.env.SUPER_ADMIN_EMAIL || "admin@shaykhabuibrahim.com").toLowerCase();
const password = process.env.SUPER_ADMIN_PASSWORD || "Admin@123456";
const name = process.env.SUPER_ADMIN_NAME || "Super Admin";

async function main() {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name,
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
    create: {
      name,
      email,
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
    select: {
      email: true,
      role: true,
    },
  });

  console.log(`Super admin ready: ${user.email} (${user.role})`);
  console.log(`Password: ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
