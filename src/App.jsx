import { useState } from 'react'
import './App.css'
import Home from './client/pages/Home.jsx'
import { Routes, Route } from 'react-router'
import Auth from './client/pages/Auth.jsx'
import Login from './client/pages/Login.jsx'
import Register from './client/pages/Register.jsx'
import { Toaster } from 'sonner'
import GuestRoute from './client/components/GuestRoute.jsx'
import Upload from './client/pages/Upload.jsx'
import Resume from './client/pages/Resume.jsx'
import WipeApp from './client/pages/Wipe.jsx'

function App() {

  return (
    <>
    <Toaster />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/auth' element={<Auth />}/>
      <Route path='/auth/login' element={
        <GuestRoute><Login /></GuestRoute>
      } />
      <Route path='/auth/register' element={
        <GuestRoute><Register /></GuestRoute>
      } />
      <Route path="/upload" element={<Upload />} />
      <Route path='/resume/:id' element={<Resume />}/>
      <Route path='/wipe' element={<WipeApp />} />
    </Routes>
    </>
  )
}

export default App
