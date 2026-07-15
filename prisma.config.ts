import "dotenv/config";
import { defineConfig } from "prisma/config";
import { getDatabaseUrl } from "./src/lib/database-url";

const datasourceUrl = getDatabaseUrl();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: datasourceUrl
    ? {
        url: datasourceUrl,
      }
    : undefined,
});
