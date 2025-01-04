import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const data = await req.json();

        console.log(data,'current receiving data from the user')
        console.log(new Date())
        
        // Here you'll save the data to your database
        // Example with prisma:
        // await prisma.pageView.create({
        //     data: {
        //         projectId: data.projectId,
        //         url: data.url,
        //         referrer: data.referrer,
        //         timestamp: data.timestamp,
        //         userAgent: data.userAgent
        //     }
        // });

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to track' },
            { status: 500 }
        );
    }
}