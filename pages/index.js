import { getSession, signIn, signOut } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home({session}) {
    const handleSignOut = async (e) => {            
        await signOut();    
      }
    
  return (
    <div className={styles.container}>
      <Head>
        <title>Home - Role based authentication </title>
        <meta name="description" content="Role based authentication " />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        
        <h1 className={styles.title}>
          Welcome to Next.js Authentication! <br/>
        </h1> 
        { !session ? 
            <div className="flex text-center mt-4">
            <Link href="/login">Login</Link>
            <Link href="/register" className="ml-4">Register</Link>
            </div> 
         : 
            <div className="text-center">
                <p>Your are logged in as <span className="text-bold ">{session.user.name}</span></p>
            <button onClick={handleSignOut} className="text-orange-500 text-underline">Sign Out</button>

            </div>
         }

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