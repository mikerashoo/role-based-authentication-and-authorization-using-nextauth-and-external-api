import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css' 
import { useRouter } from 'next/router';
import { use, useEffect, useState } from 'react';
import { newUser, getSession, getProviders, signIn } from "next-auth/react";
import axios from 'axios';
import Link from 'next/link';
import AuthLayout from '../components/layouts/AuthLayout';
export default function Register({session}) { 
    const router = useRouter();

  const [errorMessage, setErrorMessage] = useState(null);
  const [name, setName] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [password, setPassword] = useState(null); 
  const [passwordError, setPasswordError] = useState(null); 
  const [isLoading, setIsLoading] = useState(false)
    
    useEffect( () =>{
        const setUp = async () => {     
            if (session) {
            router.push('/profile')
            }   
        }
       setUp();
    }, [])

 

  
  const handleUserRegister = async (e) => {   
    e.preventDefault();
    
    if(email == null || email.length == 0 || name == null || name.length == 0 || password == null || password.length == 0) {
        setErrorMessage("Please fill all required fields");
        return;
    }
    setIsLoading(true);
    setEmailError(null)
    setPasswordError(null)
    setErrorMessage(null)
    try {
        const data = {
            name: name,
            email: email,
            password: password 
        }
        const REGISTER_END_POINT = process.env.NEXT_PUBLIC_API_ROOT + 'register'
            const res = await fetch(REGISTER_END_POINT, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json', 
              'Accept-Language': 'en-US',
            },
          });
  
          const user = await res.json()  

          if (res.ok && user) {
            signIn("credentials", {
                email, password, callbackUrl: `${window.location.origin}/profile`, redirect: false }
            ).then(function(result) {
                redirectLoggedInUser()
                setIsLoading(false)
                
            }).catch(err => {
                setIsLoading(false)
                setErrorMessage("Failed to register: " + err.toString())
            });
          }
          else if(user.error){ 
                setIsLoading(false)
                setEmailError(user.error.email)
                setPasswordError(user.error.password) 
            }
          else {
            setIsLoading(false)
            setErrorMessage("something went wrong. Please try again ")
          }
  
        } catch (error) { 
            setIsLoading(false)
            setErrorMessage("something went wrong. Please try again")
        }
  }

  const redirectLoggedInUser = async () => {
    const loginSession = await getSession();
    const role = loginSession.role; 
    switch(role){
        case 'SUPER_ADMIN':
            router.push('admin/profile') 
            break;

        case 'USER':
            router.push('user/profile') 
            break;

        default:
            router.push('/')
            break;
    }
  }
    
 if(Boolean(session)) {
    return <>Loading ...</>
 }
  return (
            <AuthLayout>
            <div className="relative py-3 sm:w-96 mx-auto text-center">
                
                <span className="text-2xl font-light ">Create new account</span>
                <div className="mt-4 bg-white shadow-md rounded-lg text-left">
                    <div className="h-2 bg-purple-400 rounded-t-md"></div>
                        <form  onSubmit={handleUserRegister}>
                            <div className="px-8 py-6 ">
                                {errorMessage && 
                                    <div class="flex bg-red-100 rounded-lg p-4 mb-2 text-sm text-red-700" role="alert">
                                        <svg class="w-5 h-5 inline mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                                        <div>
                                            <span class="font-medium">Failed</span> {errorMessage}
                                        </div>
                                    </div> 
                                }
                                 <div className=" mt-3 ">
                                    <label className="block font-semibold"> Name </label>
                                    <input value={name} onChange={(e) => setName(e.target.value)}
                                            type="text" id="name" name="name" required 
                                    className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md " />
                                </div>
                                <div className=" mt-3 ">
                                    <label className="block font-semibold"> Email </label>
                                    <input  value={email} onChange={(e) => setEmail(e.target.value)}
                                            type="email" id="email" name="email" required 
                                    className={`border w-full h-5 px-3 py-5 mt-2 ${emailError && 'border-red-600'} hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md `} />
                                    {emailError && <p className="text-red-600">{emailError}</p> }
                                </div>
                                <div className=" mt-3 ">
                                    <label className="block font-semibold"> Password </label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" 
                                className={`border w-full h-5 px-3 py-5 mt-2 ${passwordError && 'border-red-600'} hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md `} />
                                {passwordError && <p className="text-red-600">{passwordError}</p> }    
                                   </div>
                                <div className="flex justify-between items-baseline">
                                    <button type="submit" className="w-full mt-4 bg-purple-500 text-white py-2 px-6 rounded-md hover:bg-purple-600 ">
                                        {isLoading ? 
                                        <svg role="status" className="inline h-8 w-8 animate-spin mr-2 text-gray-200 dark:text-gray-600 fill-blue-600"
                                            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor" />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill" />
                                        </svg>
                                        :  'Register' }
                                    </button>
                                    
                                </div>
                            </div>
                        </form>
                    
                    </div>
                </div>
        </AuthLayout>
  )
}
 
 
export async function getServerSideProps(context) {
    
    return {
      props: {      
        session: await getSession(context)
      },
    };
  }