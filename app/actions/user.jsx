import prisma from "@/lib/db_conn";

export const checkUserExistsOrCreate = async (user) => {
    try {
      if(!user){
        throw new Error("Email is required");
      }
      let email = user?.email.toLowerCase()
      let checkUserExists = await prisma.user.findUnique({
        where : {
          email : email
        }
      })

      console.log(checkUserExists,'is this existsss')

      if(checkUserExists){
        return checkUserExists
      }else{
        let createUser = await prisma.user.create({
          data : {
            email : email,
            name : user?.name || '',
            image : user?.image || '',
          }
        })
        if(createUser){
          return createUser
        }
      }


        throw new Error("Error creating user")


    } catch (error) {
      console.error("Error in checkOrCreateUser:", {error});
      throw new Error(error.message || "Failed to check or create user");
    }
}