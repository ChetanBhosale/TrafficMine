import { NextResponse } from "next/server";
import prisma from "@/lib/db_conn";

export async function POST(req) {
    try {
        const data = await req.json();

        // Validate required fields
        if (!data.projectId || !data.userId || !data.timestamp) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const session = await prisma.visitorSession.upsert({
            where: {
                id: data.currentFlow, 
            },
            update: {
                sessionEnd: new Date().toISOString(),
                duration: data.duration,
                isActive: data.isActive,
                isFinal: data.isFinal,
                visitedPages: data.visitedPages,
                errors: data.errors,
            },
            create: {
                projectId: data.projectId,
                visitorId: data.userId,
                sessionStart: new Date(data.timestamp),
                sessionEnd: new Date(data.timestamp),
                isActive: data.isActive,
                isFinal: data.isFinal,
                source: data.source,
                duration: data.duration,
                page: data.page,
                visitedPages: data.visitedPages,
                ip: data.ip,
                deviceInfo: data.deviceInfo,
                browserInfo: data.browserInfo,
                userMetadata: data.userMetadata,
                errors: data.errors,
            },
        });

        return NextResponse.json({ message: "Session tracked successfully", data: session }, { status: 200 });
    } catch (error) {
        console.error("Error tracking session:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}