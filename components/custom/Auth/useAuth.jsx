import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

const useAuth = async() => {
  const data = await getServerSession(authOptions)

  if(data?.status == 'loading'){
    return <div>Loading...</div>
  }
  
  if(data?.status === 'authenticated' || data?.data == undefined){
    redirect('/')
  }

  return
};

export default useAuth;
