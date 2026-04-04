import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router'
import FileUploader from '../components/FileUploader'
import { useAuthStore } from '../store/authStore.js'
import { useFileStore } from '../store/fileStore.js'
import { useAIStore } from '../store/aiStore.js'
import { useKVStore } from '../store/kvStore.js'
import { convertPdfToImage } from '../../../server/utils/pdfToImage.js'
import { generateUUID } from '../../../server/utils/utils.js'
import { prepareInstructions } from '../constants/index.js'

function Upload() {

  const { user, token } = useAuthStore();
  const fs = useFileStore();
  const ai = useAIStore();
  const {save:kvSave} = useKVStore();
  const navigate = useNavigate();

  const [isProcessing,setIsProcessing]=useState(false)
  const [statusText,setStatusText]=useState('')
  const [file,setFile]=useState(null)

  function handleFileSelect(file){
    setFile(file)
  }

  async function handleAnalyze({companyName,jobTitle,jobDescription,file}){
    setIsProcessing(true);
    setStatusText("Uploading the file...")
    const uploadedFile=await fs.upload(file)

    if(!uploadedFile) return setStatusText("Error: Failed to upload file.")

    setStatusText("Converting to image...")
    
    const convertedImage=await convertPdfToImage(file)

    if(convertedImage.error || !convertedImage.file) return setStatusText(convertedImage.error || "Error: Failed to convert PDF to image.")

    setStatusText("Uploading the image...")

    const uploadedImage=await fs.upload(convertedImage.file)

    if(!uploadedImage) return setStatusText("Error: Failed to upload image.")

      setStatusText("Preparing data...")

      const uuid=generateUUID();

      //use uuid by formatting data
      const data={
        id:uuid,
        resumePath:uploadedFile.path,
        imagePath:uploadedImage.path,
        companyName, jobTitle, jobDescription,
        feedback: '', //fill it ai anaylsis
      }
      //store data in kv with uuid as key, and data as value
      await kvSave(`resume:${uuid}`, JSON.stringify(data)) 
      setStatusText("Analyzing... ")

      const feedback =await ai.feedback(
        uploadedImage.path,
        prepareInstructions({jobTitle,jobDescription})  //from constants/index.js
      )

      if(!feedback) return setStatusText("Error: Failed to analyze resume.")

        const feedbackText= feedback // assuming it's a JSON string

        const cleanedText = feedbackText
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim()

        try {
          data.feedback = JSON.parse(cleanedText) //parse feedback to json and update data
        } catch (error) {
          console.error('JSON Parse Error:', error.message)
          console.error('Cleaned text:', cleanedText)
          return setStatusText("Error: Failed to parse AI feedback. Invalid JSON response.")
        }

        await kvSave(`resume:${uuid}`, JSON.stringify(data)) //update data in kv with feedback;

        setStatusText("Analysis complete! Redirecting...")
        console.log(data)
        navigate(`/resume/${uuid}`) //redirect to resume page with uuid as param
  }

  function handleSubmit(e){
      e.preventDefault()
      const form = e.target;  // Get the form element from the event object
      if(!form)return;
      const formData=new FormData(form)  //if found extract important data from form and return 
      const companyName=formData.get('company-name')
      const jobTitle=formData.get('job-title')
      const jobDescription=formData.get('job-description')

      //conversion to pdf image
      if(!file) return ;

      handleAnalyze({companyName,jobTitle,jobDescription,file})
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
        <section className='main-section'>
            <div className='page-heading py-16'>
                <h1>Smart feedback for your dream job.</h1>
                {
                  isProcessing ? (
                    <>
                        <h2>{statusText}</h2>
                        <img src='/images/resume-scan.gif' className='w-full' />
                    </>
                  ): (<h2>Drop your resume for an ATS score and improvement tips.</h2>)
                }
                { !isProcessing && (
                  <form id="upload-form" onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>
                    <div className='form-div'>
                        <label htmlFor='company-name' >Company Name</label>
                        <input type='text' id='company-name' name='company-name' placeholder='Company Name'/>
                    </div>
                    <div className='form-div'>
                        <label htmlFor='job-title' >Job Title</label>
                        <input type='text' id='job-title' name='job-title' placeholder='Job Title'/>
                    </div>
                    <div className='form-div'>
                        <label htmlFor='job-description' >Job Description</label>
                        <textarea rows={5} id='job-description' name='job-description' placeholder='Job Description'/>
                    </div>
                    <div className='form-div'>
                        <label htmlFor='uploader' >Upload Resume</label>
                        <FileUploader onFileSelect={handleFileSelect} />
                    </div>

                    <button className='primary-button' type='submit'>Analyze Resume</button>
                  </form>
                )}
            </div>
        </section>
    </main>
  )
}

export default Upload
