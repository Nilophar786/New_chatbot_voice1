import React, { useContext, useRef, useState, useEffect } from 'react'
import Card from '../components/Card'
import image1 from "../assets/ai image1.jpg"
import image2 from "../assets/image1.png"
import image3 from "../assets/ai-powered-device-concept.jpg"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/authBg.png"
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";
import { motion } from 'framer-motion';
import ParticleBackground from '../components/ParticleBackground';
function Customize() {
  const {serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage}=useContext(userDataContext)
  const navigate=useNavigate()
     const inputImage=useRef()

     const handleImage=(e)=>{
const file=e.target.files[0]
setBackendImage(file)
setFrontendImage(URL.createObjectURL(file))
     }

  // Dynamic background gradient
  const [bgGradient, setBgGradient] = useState("from-black via-purple-900/20 to-black");

  useEffect(() => {
    const gradients = [
      "from-black via-purple-900/20 to-black",
      "from-black via-blue-900/20 to-black",
      "from-black via-pink-900/20 to-black",
      "from-black via-indigo-900/20 to-black"
    ];

    const interval = setInterval(() => {
      setBgGradient(gradients[Math.floor(Math.random() * gradients.length)]);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <div className={`w-full h-[100vh] bg-gradient-to-br ${bgGradient} flex justify-center items-center flex-col gap-[15px] fixed inset-0 overflow-hidden transition-all duration-[3000ms] ease-in-out`}>
      {/* Particle Background */}
      <ParticleBackground />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-pink-500/20 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-500/20 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-indigo-500/20 rounded-full animate-pulse animation-delay-3000"></div>

        {/* Floating squares */}
        <div className="absolute top-1/2 left-1/5 w-1 h-1 bg-purple-400/30 rotate-45 animate-pulse animation-delay-500"></div>
        <div className="absolute top-2/3 right-1/5 w-1 h-1 bg-pink-400/30 rotate-45 animate-pulse animation-delay-1500"></div>
        <div className="absolute bottom-1/2 left-2/3 w-1 h-1 bg-blue-400/30 rotate-45 animate-pulse animation-delay-2500"></div>

        {/* Additional floating elements for more dynamic transitions */}
        <div className="absolute top-1/6 left-1/6 w-3 h-3 bg-green-500/20 rounded-full animate-bounce animation-delay-500"></div>
        <div className="absolute top-3/4 right-1/6 w-2 h-2 bg-yellow-500/20 animate-spin animation-delay-1000"></div>
        <div className="absolute top-1/2 right-1/2 w-1 h-1 bg-red-500/30 rotate-12 animate-ping animation-delay-2000"></div>
        <div className="absolute bottom-1/6 left-1/2 w-2 h-2 bg-cyan-500/20 rounded-full animate-pulse animation-delay-2500"></div>
        <div className="absolute top-5/6 right-1/3 w-1 h-1 bg-orange-400/30 rotate-45 animate-bounce animation-delay-1500"></div>
        <div className="absolute bottom-2/3 right-1/4 w-3 h-3 bg-teal-500/20 animate-spin animation-delay-3000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full flex justify-center items-center flex-col p-[20px]"
      >
        <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]' onClick={()=>navigate("/")}/>
        <h1 className='text-white mb-[40px] text-[30px] text-center '>Select your <span className='text-blue-200'>Assistant Image</span></h1>
        <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]'>
      <Card image={image1}/>
       <Card image={image2}/>
        <Card image={image3}/>
         <Card image={image4}/>
          <Card image={image5}/>
           <Card image={image6}/>
            <Card image={image7}/>
     <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${selectedImage=="input"?"border-4 border-white shadow-2xl shadow-blue-950 ":null}` } onClick={()=>{
        inputImage.current.click()
        setSelectedImage("input")
     }}>
        {!frontendImage &&  <RiImageAddLine className='text-white w-[25px] h-[25px]'/>}
        {frontendImage && <img src={frontendImage} className='h-full object-cover'/>}

    </div>
    <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
      </div>
{selectedImage && <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer  bg-white rounded-full text-[19px] ' onClick={()=>navigate("/customize2")}>Next</button>}
      </motion.div>
    </div>
  )
}

export default Customize
