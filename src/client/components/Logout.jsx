import React from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router'

function Logout() {
    const {logout}=useAuthStore();
    const naviagate=useNavigate();

    const handleLogout=async()=>{
        await logout();
        naviagate('/auth/login');
    }
  return (
    <div>
      <button onClick={handleLogout} className='primary-button w-fit'>Logout</button>
    </div>
  )
}

export default Logout
