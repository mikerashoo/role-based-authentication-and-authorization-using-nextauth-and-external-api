import * as React from 'react'; 
import { getSession, signOut } from "next-auth/react"
import { useRouter } from 'next/router';

const theme = createTheme();

export default function SignOut() {

  const router = useRouter();
  useEffect( () =>{
    if(loginError) setShowAlert(true);
    const setUp = async () => {
         const session = await getSession()        
    if (!session) {
      router.push('/')
    }   
    }
   setUp();
}, [])
  

  const handleLogoutUser = async (e) => {    
    
    await signOut();
    router.push('/')
  }

  
  return (
    <div theme={theme}>
       
              <button
                type="submit"
                fullWidth
                size="large"
                color="error"
                variant="contained"                
                sx={{ mt: 3, mb: 2 }}
                onClick={() => handleLogoutUser()}

              >
                Sign out
              </button>
            
    </div>
  );
}