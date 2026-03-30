import React from 'react'
import Navbar from './Navbar'
import { resumes } from '../constants/index.js'
import ResumeCard from './ResumeCard'

function Home() {
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
