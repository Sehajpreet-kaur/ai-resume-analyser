import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useAuthStore } from '../store/authStore.js'
import { useFileStore } from '../store/fileStore.js'
import { useKVStore } from '../store/kvStore.js'
import { useNavigate } from 'react-router'
import Summary from '../components/Summary.jsx'
import ATS from '../components/ATS.jsx'
import Details from '../components/Details.jsx'

function Resume() {
    const { user, token, isLoading } = useAuthStore();
    const isAuthenticated = Boolean(user && token);
    const {read:fsRead}=useFileStore();
    const {get:kvGet}=useKVStore();
    const {id}=useParams();

    const [imageUrl,setImageUrl]=useState(null);
    const [resumeUrl,setResumeUrl]=useState(null);
    const [feedback,setFeedback]=useState(null);

    const navigate=useNavigate();

    useEffect(()=>{
              if (isLoading) return; 
                if (!isAuthenticated) navigate(`/auth?next=/resume/${id}`);
            }, [isLoading, isAuthenticated, id]);

        const toUrl = (p) => {
            const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            // strip "/api" suffix if present, since file paths aren't under /api
            const origin = base.replace('/api', '');
            const clean = p.replace(/\\/g, '/').replace(/^\//, '');
            return `${origin}/${clean}`;
        };

    //to fetch data from ai analysis using id as key from kv store, and display it in the page
    useEffect(()=>{
        if(!isAuthenticated) return;

        const loadResume=async()=>{

            const resume = await kvGet(`resume:${id}`);
            //this will get all data
            if(!resume) return;

            console.log("Resume data:", resume);
            //else get data from resume
            const data=typeof resume === 'string' ? JSON.parse(resume) : resume;
            const rUrl = toUrl(data.resumePath);
            const iUrl = toUrl(data.imagePath);

            setResumeUrl(rUrl);
            setImageUrl(iUrl);
            setFeedback(data.feedback ?? null);
        }
        loadResume();
        
    },[id]);

  return (
    <main className='!pt-0'>
        <nav className='resume-nav'>
            <Link to="/" className='back-button'>
                <img src='/icons/back.svg' alt='logo' className='w-2.5 h-2.5'/>
                <span className='text-gray-800 text-sm font-semibold'>Back to Homepage</span>
            </Link>
        </nav>
        <div className='flex flex-row w-full max-lg:flex-col-reverse'>
            <section className='feedback-section bg-[url("/images/bg.small.svg")] bg-cover h-[100vh] sticky top-0 items-center justify-center'>
                {imageUrl && resumeUrl && (
                    <div className='animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit'>
                        <a href={resumeUrl} target='_blank' rel='noopener noreferrer'>
                            <img src={imageUrl} alt='Profile Image' className='w-full h-full object-contain rounded-2xl' title='resume' />
                        </a>
                    </div>
                )}
            </section>
            <section className='feedback-section '>
                <h2 className='text-4xl !text-black font-bold'>Resume Review</h2>
                {feedback ? (
                    <div className='flex flex-col gap-8 animate-in fade-in duration-1000'>
                        <Summary feedback={feedback} />
                        <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips|| []} />
                        <Details feedback={feedback} />
                    </div>)
                    :(
                        <img src='/images/resume-scan-2.gif' className='w-full' />
                    )}
            </section>
        </div>
    </main>
  )
}

export default Resume
