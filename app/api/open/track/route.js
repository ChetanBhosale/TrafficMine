import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json();
    console.log('Received data:', data);

    // Fetch location details from IP address
    let locationInfo = {};
    if (data.ip) {
      try {
    const ipResponse = await fetch(`https://ipinfo.io/${data.ip}?token=${process.env.NEXT_PUBLIC_IP}`);
    const ipDetails = await ipResponse.json();
    console.log(ipDetails,'ip details')
    console.log(ipDetails,'country')
        locationInfo = {
          country: ipDetails.country || '',
          region: ipDetails.region || '',
          city: ipDetails.city || '',
          timezone: ipDetails.timezone || '',
        };
      } catch (error) {
        console.error('Error fetching IP details:', error);
      }
    }

    console.log(locationInfo,'location info of the user')

    // Determine the referrer
    const referrer = data.referrer || 'direct';

    // Check for duplicate sessions (optional)
    const recentSession = await prisma.visitorSession.findFirst({
      where: {
        visitorId: data.userId,
      },
      orderBy: {
        sessionStart: 'desc',
      },
    });

    if (recentSession) {
      const lastSessionTime = new Date(recentSession.sessionStart).getTime();
      const currentSessionTime = new Date(data.timestamp).getTime();
      const timeDifference = Math.abs(currentSessionTime - lastSessionTime) / 1000;

      // Ignore duplicate sessions within 5 seconds
      if (timeDifference < 5) {
        return NextResponse.json({
          status: 200,
          message: 'Ignored duplicate session',
          data: recentSession,
        });
      }
    }

    // If currentFlow exists, check if the session exists
    if (data?.currentFlow) {
      const existingSession = await prisma.visitorSession.findUnique({
        where: {
          id: data.currentFlow,
        },
      });

      // If the session exists, update it
      if (existingSession) {
        const updatedSession = await prisma.visitorSession.update({
          where: {
            id: data.currentFlow,
          },
          data: {
            sessionEnd: new Date(),
            duration: data.duration,
            isActive: data.isActive,
            isFinal: data.isFinal,
            page: data.page,
            visitedPages: {
              push: data.visitedPages,
            },
          },
        });

        return NextResponse.json({ status: 200, data: updatedSession });
      }
    }

    // If currentFlow doesn't exist or the session doesn't exist, create a new session
    const visitorSession = await prisma.visitorSession.create({
      data: {
        project: {
          connect: {
            id: data.projectId,
          },
        },
        visitorId: data.userId,
        sessionStart: new Date(data.timestamp),
        sessionEnd: new Date(),
        source: data.source,
        duration: data.duration,
        isActive: data.isActive,
        isFinal: data.isFinal,
        page: data.page,
        visitedPages: data.visitedPages,
        ip: data.ip,
        deviceInfo: data.deviceInfo,
        browserInfo: data.browserInfo,
        errors: data.errors,
        userMetadata: data.userMetadata,
        referrer: referrer, 
        country: locationInfo.country, 
        region: locationInfo.region, 
        city: locationInfo.city,
        timezone: locationInfo.timezone, 
      },
    });

    // console.log('Session created:', visitorSession);

    return NextResponse.json({ status: 201, data: visitorSession });
  } catch (error) {
    console.error('Failed to track session:', error.message);
    return NextResponse.json(
      { error: 'Failed to track session', details: error.message },
      { status: 500 }
    );
  }
}