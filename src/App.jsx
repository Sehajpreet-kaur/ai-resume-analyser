import { useState } from 'react'
import './App.css'
import Home from './client/pages/Home.jsx'
import { Routes, Route } from 'react-router'
import Auth from './client/pages/Auth.jsx'
import Login from './client/pages/Login.jsx'
import Register from './client/pages/Register.jsx'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/auth' element={<Auth />}/>
      <Route path='/auth/login' element={<Login />} />
      <Route path='/auth/register' element={<Register />} />
      {/* {isAuthenticated ? (
        <Route path='/auth/login' element={<Login />} />
      ) : (
        <Route path='/auth/register' element={<Register />} />
      )} */}
    </Routes>
  )
}

export default App
