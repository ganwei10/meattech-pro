import { prisma } from './prisma';

/**
 * Safe PilotLine query - falls back to SELECT * if Prisma query fails
 * (e.g. when new columns exist in schema but not yet in DB)
 */
export async function safeFindPilotLines(orderBy: 'desc' | 'asc' = 'desc'): Promise<any[]> {
  try {
    return await prisma.pilotLine.findMany({ orderBy: { createdAt: orderBy } });
  } catch {
    // Fallback: SELECT * only returns columns that exist in the DB
    const order = orderBy === 'asc' ? 'ASC' : 'DESC';
    return await prisma.$queryRawUnsafe(`SELECT * FROM "PilotLine" ORDER BY "createdAt" ${order}`);
  }
}

/**
 * Safe single PilotLine query - falls back to SELECT * if Prisma query fails
 */
export async function safeFindPilotLine(id: number): Promise<any | null> {
  try {
    return await prisma.pilotLine.findUnique({ where: { id } });
  } catch {
    const rows = await prisma.$queryRawUnsafe(`SELECT * FROM "PilotLine" WHERE id = ${id}`);
    return (rows as any[])[0] || null;
  }
}

/**
 * Safe Booking query with line relation - splits the query to avoid
 * Prisma trying to SELECT new PilotLine columns that don't exist yet
 */
export async function safeFindBookingWithLine(bookingId: number): Promise<any | null> {
  let booking: any;
  try {
    // Try with include first
    booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { line: true },
    });
    return booking;
  } catch {
    // Fallback: query booking without include, then fetch line separately
    try {
      booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });
    } catch {
      const rows = await prisma.$queryRawUnsafe(`SELECT * FROM "Booking" WHERE id = ${bookingId}`);
      booking = (rows as any[])[0] || null;
    }
    if (!booking) return null;
    booking.line = await safeFindPilotLine(booking.lineId);
    return booking;
  }
}

/**
 * Safe Bookings query with line relation
 */
export async function safeFindBookingsWithLine(where?: any): Promise<any[]> {
  let bookings: any[];
  try {
    bookings = await prisma.booking.findMany({
      where,
      include: { line: true },
      orderBy: { createdAt: 'desc' },
    });
    return bookings;
  } catch {
    // Fallback: query without include
    try {
      bookings = await prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      bookings = await prisma.$queryRawUnsafe(`SELECT * FROM "Booking" ORDER BY "createdAt" DESC`);
    }
    // Fetch lines separately
    for (const b of bookings) {
      if (b.lineId) {
        b.line = await safeFindPilotLine(b.lineId);
      }
    }
    return bookings;
  }
}

/**
 * Safe Reviews query - falls back to raw SQL if Prisma query fails
 */
export async function safeFindReviews(bookingId?: number): Promise<any[]> {
  try {
    const where = bookingId ? { bookingId } : {};
    return await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        booking: { select: { id: true, lineId: true, company: true, contactName: true } },
      },
    });
  } catch {
    // Fallback to raw SQL
    try {
      let sql = `SELECT r.*, u.name as "userName", u.email as "userEmail", b."company" as "bookingCompany", b."contactName" as "bookingContactName", b."lineId" as "bookingLineId" FROM "Review" r LEFT JOIN "User" u ON r."userId" = u.id LEFT JOIN "Booking" b ON r."bookingId" = b.id`;
      if (bookingId) {
        return await prisma.$queryRawUnsafe(`${sql} WHERE r."bookingId" = ${bookingId} ORDER BY r."createdAt" DESC`);
      }
      return await prisma.$queryRawUnsafe(`${sql} ORDER BY r."createdAt" DESC`);
    } catch {
      return [];
    }
  }
}

/**
 * Safe Favorites query - falls back to raw SQL if Prisma query fails
 */
export async function safeFindFavorites(userId: number): Promise<any[]> {
  try {
    return await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    try {
      return await prisma.$queryRawUnsafe(`SELECT * FROM "Favorite" WHERE "userId" = ${userId} ORDER BY "createdAt" DESC`);
    } catch {
      return [];
    }
  }
}

/**
 * Safe Notifications query - falls back to raw SQL if Prisma query fails
 */
export async function safeFindNotifications(userId: number, unreadOnly: boolean = false): Promise<any[]> {
  try {
    return await prisma.notification.findMany({
      where: unreadOnly ? { userId, isRead: false } : { userId },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    try {
      const where = unreadOnly
        ? `"userId" = ${userId} AND "isRead" = false`
        : `"userId" = ${userId}`;
      return await prisma.$queryRawUnsafe(`SELECT * FROM "Notification" WHERE ${where} ORDER BY "createdAt" DESC`);
    } catch {
      return [];
    }
  }
}
