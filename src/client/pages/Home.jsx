import React from 'react'
import Navbar from '../components/Navbar.jsx'
import { resumes } from '../constants/index.js'
import ResumeCard from '../components/ResumeCard.jsx'
import { useAuthStore } from '../store/authStore.js'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'

function Home() {

    const {isLoading,user,token,login,logout}=useAuthStore();
    const isAuthenticated=Boolean(user && token)

    const navigate=useNavigate();

    //if user access secured route without being authenticated , they will redirect to auth or if authenticated navigate to next page,
    useEffect(()=>{
        if(!isAuthenticated) navigate('/auth?next=/');
    },[isAuthenticated,navigate])

  return (
    <div>
      <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
        <section className='main-section'>
          <div className='page-heading py-16'>
            <h1>Track Your Applications & Resume Ratings</h1>
            <h2>Review your submissions and check Ai-powered feedback</h2>
          </div>
        

        {
          resumes.length >0 && (
            <div className='resumes-section'>
            {
              resumes.map((resume)=>(
                <ResumeCard key={resume.id} {...resume}/>
              ))
            }
        </div>
          )
        }

        </section>
      </main>
    </div>
  )
}

export default Home
