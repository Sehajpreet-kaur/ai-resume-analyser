import { useState } from 'react'
import './App.css'
import Home from './client/components/Home.jsx'
import { Routes, Route } from 'react-router'
import Auth from './client/pages/Auth.jsx'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/auth' element={<Auth />}/>
    </Routes>
  )
}

export default App
