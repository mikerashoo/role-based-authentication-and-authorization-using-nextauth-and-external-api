import { getSession, signOut } from 'next-auth/react';
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css'

export default function AccountPage({session}) {

    const router = useRouter();
    
  const [ userEmail, setUserEmail ] = useState('');
  const [ userName, setUserName ] = useState('');
  const handleSignOut = async (e) => {            
    await signOut();    
  }

  
  useEffect(() => {                          
    if(!Boolean(session)) {
       router.push('/login')                                  
    }   
    else if(session.role != 'USER'){
        router.push('/401')                                 
    }
    else {    
     setUserName(session.user.name)  
    }                
 
 }, [])
 
 if(!Boolean(session)) {
    return <>Loading ...</>
 }
  return (
    <div className={styles.container}>
      <Head>
        <title>Your Profile - Role based authentication </title>
        <meta name="description" content="Login - Role based authentication " />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome  {userName}
        </h1>
        <h3>You are <span className="text-green-600">User</span></h3>
        <button onClick={handleSignOut}>Sign Out</button>
      </main>
 
    </div>
  )
}




export async function getServerSideProps(context) {
    
    return {
      props: {      
        session: await getSession(context)
      },
    };
  }
    