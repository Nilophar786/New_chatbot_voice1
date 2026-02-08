import React, { useContext, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Customize from './pages/Customize'
import { userDataContext } from './context/UserContext'
import Home from './pages/Home'
import Customize2 from './pages/Customize2'
import History from './pages/History'
import Notes from './pages/Notes'

function App() {
  const {userData,handleCurrentUser}=useContext(userDataContext)

  useEffect(() => {
    const handleTouchMove = (e) => {
      const target = e.target;
      const isScrollable = target.scrollHeight > target.clientHeight &&
        (window.getComputedStyle(target).overflow === 'auto' ||
         window.getComputedStyle(target).overflow === 'scroll' ||
         window.getComputedStyle(target).overflowY === 'auto' ||
         window.getComputedStyle(target).overflowY === 'scroll');
      if (!isScrollable) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // User authentication check is handled in UserContext

  return (
   <Routes>
     <Route path='/' element={<Home/>}/>
    <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"}/>}/>
     <Route path='/signin' element={!userData?<SignIn/>:<Navigate to={"/"}/>}/>
      <Route path='/customize' element={userData?<Customize/>:<Navigate to={"/signup"}/>}/>
       <Route path='/customize2' element={userData?<Customize2/>:<Navigate to={"/signup"}/>}/>
       <Route path='/history' element={userData?<History/>:<Navigate to={"/signup"}/>}/>
       <Route path='/notes' element={userData?<Notes/>:<Navigate to={"/signup"}/>}/>
   </Routes>
  )
}

export default App
