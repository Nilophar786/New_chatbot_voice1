import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import { useContext } from 'react';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';

function HamburgerMenu() {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData } = useContext(userDataContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.log("Logout error:", error);
      setUserData(null);
    }
  };

  const handleCustomize = () => {
    navigate("/customize");
    setIsOpen(false);
  };

  const handleHistory = () => {
    navigate("/history");
    setIsOpen(false);
  };

  return (
    <>
      <CgMenuRight 
        className='text-white w-[25px] h-[25px] cursor-pointer lg:hidden' 
        onClick={() => setIsOpen(true)} 
        title="Open Menu"
      />
      
      {isOpen && (
        <div className='absolute top-0 left-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start z-50'>
          <RxCross1 
            className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer' 
            onClick={() => setIsOpen(false)}
          />
          
          <button 
            className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' 
            onClick={handleLogOut}
          >
            Log Out
          </button>
          
          <button 
            className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' 
            onClick={handleCustomize}
          >
            Customize Assistant
          </button>
          
          <button 
            className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' 
            onClick={handleHistory}
          >
            History
          </button>
        </div>
      )}
    </>
  );
}

export default HamburgerMenu;
