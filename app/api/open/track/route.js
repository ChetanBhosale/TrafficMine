import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json();

    // const recentSession = await prisma.visitorSession.findFirst({
    //   where: {
    //     visitorId: data.visitorId,
    //   },
    //   orderBy: {
    //     sessionStart: 'desc',
    //   },
    // });


    // if (recentSession) {
    //   const lastSessionTime = new Date(recentSession.timestamp).getTime();
    //   const currentSessionTime = new Date(data.timestamp).getTime();
    //   const timeDifference = Math.abs(currentSessionTime - lastSessionTime) / 1000;
    // console.log(timeDifference)
    //   if (timeDifference < 5) {
    //     return NextResponse.json({ 
    //       status: 200, 
    //       message: 'Ignored duplicate session',
    //       data: recentSession 
    //     });
    //   }
    // }

    console.log(data)

    if (data?.currentFlow) {
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

    const ipResponse = await fetch(`https://ipinfo.io/${data.ip}?token=${process.env.NEXT_PUBLIC_IP}`);
    const ipDetails = await ipResponse.json();

    const deviceInfo = await prisma.deviceInfo.create({
      data: {
        deviceType: data.deviceInfo.deviceType,
        deviceModel: data.deviceInfo.deviceModel,
        operatingSystem: data.deviceInfo.operatingSystem,
      },
    });

    const browserInfo = await prisma.browserInfo.create({
      data: {
        browserName: data.browserInfo.browserName,
        browserVersion: data.browserInfo.browserVersion,
      },
    });

    const locationInfo = await prisma.locationInfo.create({
      data: {
        country: ipDetails.country ?? '',
        region: ipDetails.region ?? '',
        city: ipDetails.city ?? '',
        timezone: ipDetails.timezone ?? '',
      },
    });

    const visitorSession = await prisma.visitorSession.create({
      data: {
        project: {
          connect: {
            id: data.projectId,
          },
        },
        visitorId: data.visitorId,
        sessionStart: new Date(data.timestamp),
        sessionEnd: new Date(),
        source: data.source,
        duration: data.duration,
        isActive: data.isActive,
        isFinal: data.isFinal,
        page: data.page,
        visitedPages: data.visitedPages,
        deviceInfo: {
          connect: {
            id: deviceInfo.id,
          },
        },
        browserInfo: {
          connect: {
            id: browserInfo.id,
          },
        },
        LocationInfo: {
          connect: {
            id: locationInfo.id,
          },
        },
      },
    });

    return NextResponse.json({ status: 201, data: visitorSession });
  } catch (error) {
    console.log({ error: 'Failed to track', details: error.message });
    return NextResponse.json(
      { error: 'Failed to track', details: error.message },
      { status: 500 }
    );
  }
}