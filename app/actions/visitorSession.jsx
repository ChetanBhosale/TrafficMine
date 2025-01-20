'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getVisitorSessions(projectId, timeline) {
  try {
    const now = new Date();
    let startDate;

    switch (timeline) {
      case 'Last 24 Hours':
        startDate = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case 'Last Week':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'Last Month':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'All Data':
        startDate = null; // No filter
        break;
      default:
        startDate = new Date(now - 24 * 60 * 60 * 1000); // Default to last 24 hours
    }

    const whereClause = {
      projectId,
      ...(startDate && { sessionStart: { gte: startDate } }),
    };

    const sessions = await prisma.visitorSession.findMany({
      where: whereClause,
      orderBy: {
        sessionStart: 'asc',
      },
    });

    return { status: 200, data: sessions };
  } catch (error) {
    console.error('Error fetching visitor sessions:', error);
    return { status: 500, error: 'Failed to fetch visitor sessions' };
  }
}