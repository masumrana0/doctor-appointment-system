import { prisma } from "@/lib/prisma";

/**
 * Marks past appointments as cancelled if they are still pending.
 *
 * Note: In this project the DB column `appointments.date` is stored as TEXT.
 * We cast to date in SQL so comparisons work reliably.
 */
export const expirePendingAppointments = async (): Promise<void> => {
  await prisma.$executeRaw`
    UPDATE "appointments"
    SET "status" = 'cancelled'
    WHERE "status" = 'pending'
      AND "date"::date < CURRENT_DATE
  `;
};
