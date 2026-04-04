import React, { useEffect, useRef,useMemo } from 'react'
import { useAuthStore } from '../store/authStore'
import { useLocation, useNavigate } from 'react-router';
import Login from './Login';

function Auth() {

    const {isLoading,user,token,login,logout}=useAuthStore();
    const isAuthenticated=Boolean(user && token)

    const location=useLocation();
    const next = useMemo(
            () => new URLSearchParams(location.search).get('next') || '/',
            [location.search]
        );
    const navigate=useNavigate();
    const hasNavigated=useRef(false);

    //if user access secured route without being authenticated , they will redirect to auth or if authenticated navigate to next
    useEffect(()=>{
        if(isAuthenticated && !hasNavigated.current) {
            hasNavigated.current=true;
            navigate(next);
        }
    },[isAuthenticated,next])

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
        <div className='gradient-border shadow-lg'>
            <section className='flex flex-col gap-8 bg-white rounded-2xl p-10'>
                <div className='flex flex-col items-center gap-2 text-center'>
                    <h1>Welcome</h1>
                    <h2>Log In to continue your Job Journey</h2>
                </div>
                <div>
                    {
                        isLoading ?(
                            <button className='auth-button animate-pulse'>
                                <p>Signing you in...</p>
                            </button>
                        ):
                        <>
                        {
                            isAuthenticated ? (
                                <button className='auth-button' onClick={logout}>
                                    <p>Log Out</p>
                                </button>
                            ):(
                                    <button className='primary-gradient rounded-full py-4 px-8 cursor-pointer w-[400px] max-md:w-full text-3xl font-semibold text-white' onClick={() => navigate('/auth/login') }>
                                    <p >Login</p>     
                                </button>

                                
                            )
                        }
                        </>
                    }
                </div>
            </section>
        </div>
    </main>
  )
}

export default Auth
