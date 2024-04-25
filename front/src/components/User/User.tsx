import React, { useState } from 'react'
import "./User.css"
import Join from './Join'
import Login from './Login'

const User = () => {
  const [userPage, setUserPage] = useState<boolean>(true)
  
  return (
    <div className='user-container'>
        {userPage ? <Login userPage={userPage} setUserPage={setUserPage}/> : <Join setUserPage={setUserPage}/> }
    </div>
  )
}

export default User