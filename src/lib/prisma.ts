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
  // Fire migration immediately - it will complete before most queries due to event loop ordering
  migratePilotLine();
  return client;
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
