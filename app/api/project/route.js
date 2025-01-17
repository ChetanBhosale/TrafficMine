import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth_config";
import { NextRequest, NextResponse } from "next/server";
import { checkWebsiteExists, getFavicon } from "@/services/web_validation";
import prisma from "@/lib/db_conn";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "You are not logged in" }, { status: 401 });
        }

        const data = await req.json();
        console.log(data,'is this working')

        if(data?.webUrl?.startsWith('www')){
            data.webUrl = data?.webUrl?.replace('www.', 'https://')
        }else if(!data?.webUrl?.startsWith('https://')){
            data.webUrl = `https://${data?.webUrl}`
        }

        if (!data.projectName || !data.webUrl) {
            return NextResponse.json({ message: "Please provide project name and web url" }, { status: 400 });
        }

        // validating links

        // let checkUrlExists = await prisma.project.findFirst({
        //     where : {
        //         url : data.webUrl,
        //         userId: session.user.id
        //     }
        // })

        console.log(session?.user?.id,'user session')

        let checkUrlExists = await prisma.project.findFirst({
           where : {
            link : data.webUrl,
            userId : session.user.id
           }
        })

        if(checkUrlExists){
            return NextResponse.json({ message: "Project with this url already exists" }, { status: 400 });
        }



        let validateWebUrl = await checkWebsiteExists(data.webUrl);
        
        if(!validateWebUrl){
            return NextResponse.json({ message: "Web url is not valid" }, { status: 400 });
        }

        let fevicon = await getFavicon(data.webUrl);


        let project = await prisma.project.create({
            data: {
                name : data.projectName,
                description : '',
                userId : session.user.id,
                link : data.webUrl,
                image : fevicon
            }
        });

        if(project){    
            return NextResponse.json({ message: "Project created successfully" }, { status: 200 });
        }

        return NextResponse.json({ message : 'Project creating failed!' }, { status: 301 });
    } catch (error) {
        console.log(JSON.stringify(error))
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}