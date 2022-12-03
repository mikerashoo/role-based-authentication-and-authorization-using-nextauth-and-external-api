import { getSession } from 'next-auth/react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css' 

export default function AuthLayout ({ children }){
      
    return (
        <div className={styles.container}>
            <Head>
                <title>Role based authentication </title>
                <meta name="description" content="Role based authentication " />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="relative flex min-h-screen text-gray-800 antialiased flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
                {children}
            </div>
        </div>
    )
}
 
 