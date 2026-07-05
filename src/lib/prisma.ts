import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

function createPrismaClient() {
  const client = new PrismaClient();
  // Auto-migrate: add new PilotLine columns if they don't exist yet
  // This prevents "column does not exist" errors when schema.prisma has new fields
  // but /api/setup hasn't been called yet
  const migratePilotLine = async () => {
    try {
      await client.$executeRawUnsafe(`ALTER TABLE "PilotLine" ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL DEFAULT 'UNIVERSITY'`);
      await client.$executeRawUnsafe(`ALTER TABLE "PilotLine" ADD COLUMN IF NOT EXISTS "advantages" TEXT NOT NULL DEFAULT ''`);
      await client.$executeRawUnsafe(`ALTER TABLE "PilotLine" ADD COLUMN IF NOT EXISTS "cooperationModel" TEXT NOT NULL DEFAULT ''`);
      await client.$executeRawUnsafe(`ALTER TABLE "PilotLine" ADD COLUMN IF NOT EXISTS "equipment" TEXT NOT NULL DEFAULT ''`);
      await client.$executeRawUnsafe(`ALTER TABLE "PilotLine" ADD COLUMN IF NOT EXISTS "capabilities" TEXT NOT NULL DEFAULT ''`);
      await client.$executeRawUnsafe(`ALTER TABLE "PilotLine" ADD COLUMN IF NOT EXISTS "contactPerson" TEXT NOT NULL DEFAULT ''`);
      await client.$executeRawUnsafe(`ALTER TABLE "PilotLine" ADD COLUMN IF NOT EXISTS "contactPhone" TEXT NOT NULL DEFAULT ''`);
      await client.$executeRawUnsafe(`ALTER TABLE "PilotLine" ADD COLUMN IF NOT EXISTS "contactEmail" TEXT NOT NULL DEFAULT ''`);
      await client.$executeRawUnsafe(`ALTER TABLE "PilotLine" ADD COLUMN IF NOT EXISTS "pricePerDay" DOUBLE PRECISION NOT NULL DEFAULT 0`);
      await client.$executeRawUnsafe(`ALTER TABLE "PilotLine" ADD COLUMN IF NOT EXISTS "serviceFeePercent" DOUBLE PRECISION NOT NULL DEFAULT 5`);
      await client.$executeRawUnsafe(`ALTER TABLE "PilotLine" ADD COLUMN IF NOT EXISTS "description" TEXT NOT NULL DEFAULT ''`);
      await client.$executeRawUnsafe(`ALTER TABLE "PilotLine" ADD COLUMN IF NOT EXISTS "images" TEXT NOT NULL DEFAULT ''`);
      await client.$executeRawUnsafe(`ALTER TABLE "PilotLine" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3)`);
      await client.$executeRawUnsafe(`UPDATE "PilotLine" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL`);
    } catch (e) {
      // Migration failed (e.g. table doesn't exist yet) - will be retried on next request
    }
  };
  // Auto-migrate: create Review and Favorite tables if they don't exist
  const migrateReviewsAndFavorites = async () => {
    try {
      await client.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Review" (
          id SERIAL PRIMARY KEY,
          "bookingId" INTEGER NOT NULL,
          "userId" INTEGER,
          "rating" INTEGER NOT NULL,
          "content" TEXT NOT NULL,
          "reply" TEXT,
          "replyAt" TIMESTAMP(3),
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3)
        )
      `);
      await client.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Favorite" (
          id SERIAL PRIMARY KEY,
          "userId" INTEGER NOT NULL,
          "targetType" TEXT NOT NULL,
          "targetId" INTEGER NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      // Add foreign keys and unique constraints (ignore if already exist)
      try { await client.$executeRawUnsafe(`ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON DELETE RESTRICT ON UPDATE CASCADE`); } catch (e) {}
      try { await client.$executeRawUnsafe(`ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE SET NULL ON UPDATE CASCADE`); } catch (e) {}
      try { await client.$executeRawUnsafe(`ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE`); } catch (e) {}
      try { await client.$executeRawUnsafe(`ALTER TABLE "Review" ADD CONSTRAINT "Review_updatedAt_default" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`); } catch (e) {}
      await client.$executeRawUnsafe(`UPDATE "Review" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL`);
    } catch (e) {
      // Migration failed - will be retried on next request
    }
  };
  // Fire migration immediately - it will complete before most queries due to event loop ordering
  migratePilotLine();
  migrateReviewsAndFavorites();
  return client;
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
