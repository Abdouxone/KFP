import { PrismaClient } from "@/generated/prisma/client";

// Use globalThis to ensure a single PrismaClient instance across hot-reloads in development.
// This prevents exhausting database connections.
declare global {
  // Allow globalThis.prisma to be typed for TypeScript
  var prisma: PrismaClient | undefined;
}

if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient();
}

export const db = globalThis.prisma;
