'use server'



import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProjects(userId) {
    const projects = await prisma.project.findMany({
        where: {
            userId: userId
        }
    });
    return projects;
}


export async function getSingleProject(projectId,userId){
    try {

    
    const project =  await prisma.project.findFirst({
        where : {
            id : projectId,
            userId : userId
        }
    })

    console.log(project)

    if(project){
        return {
            data : project,
            status : 200,
        }
    }else{
        return {
            data : null,
            status : 404
        }
    }   
    } catch (error) {
        return error
    }
}