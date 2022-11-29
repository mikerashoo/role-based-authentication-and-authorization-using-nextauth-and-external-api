import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css' 
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { signIn, getSession, getProviders } from "next-auth/react";
export default function Signin({ providers, loginError }) { 
    const router = useRouter();

  const [errorMessage, setErrorMessage] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null); 
    
    useEffect( () =>{
        if(loginError) {
            console.log("loginError", loginError);
            if(loginError == 'CredentialsSignin'){
                setErrorMessage("Incorrect email or password")
            }
            else {
                setErrorMessage("something went wrong. Please try again")
            }
        };
        const setUp = async () => {
             const session = await getSession()        
        if (session) {
          router.push('/profile')
        }   
        }
       setUp();
    }, [])

 

  
  const handleLoginUser = async (e) => {    
    e.preventDefault();
    
    if(email == null || email.length == 0 || password == null || password.length == 0) {
        setErrorMessage("Please fill all required fields");
        return;
    }
    try {
        const resp = await signIn("credentials", 
            {
                redirect: false,
                email: email,
                password: password 
            });
            if(resp.ok){
                //login success
                router.push('/profile')
            }
            else {
                if(resp.error == 'CredentialsSignin'){
                    setErrorMessage("Incorrect email or password")
                }
                else {
                    setErrorMessage("something went wrong. Please try again")
                }
            } 
  
        } catch (error) {
            setErrorMessage("something went wrong. Please try again")

        }

 
  }
    
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      {errorMessage &&
        <div style={{color: 'red'}}>
            
            {errorMessage}
           <button onClick={() => {setErrorMessage(null)}}>Close</button>
        </div>
        }
        <h1 className={styles.title}>
          Login Page
        </h1>

      
        <form onSubmit={handleLoginUser}>
            <div style={{marginBottom: 10, marginTop: 10}}>
                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}
                type="email" id="email" name="email" required />
            </div>
            <div style={{marginBottom: 10}}>
            
                 <label htmlFor="password">Password</label>
                 <input type="password"  value={password} onChange={(e) => setPassword(e.target.value)} id="password" name="password" required />

            </div>
      <button type="submit">Login</button>
    </form>

      </main>

       
    </div>
  )
}
 

export async function getServerSideProps(context) {
    const { query, req, res } = context;
    var error = ''
    if(Boolean(query.error)) {
      error = query.error
    }
    
    try {    
      const secret = process.env.NEXTAUTH_SECRET
      const token = await getToken({ req, secret })   
      
      return { props: { providers: await getProviders(), loginError: error } };
    } catch (e) {
      return { props: { providers: await getProviders(), loginError: error } };
    }
    
  }