import React, { useContext, useState, useEffect } from 'react'
import { userDataContext } from '../context/UserContext.jsx'
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParticleBackground from '../components/ParticleBackground';

function Customize2() {
    const {userData,backendImage,selectedImage,serverUrl,setUserData,customizationData,handleCurrentUser}=useContext(userDataContext)
    const [assistantName,setAssistantName]=useState(userData?.assistantName || "")
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()

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

    const handleUpdateAssistant=async ()=>{
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                navigate('/signin')
                return
            }

            let formData=new FormData()
            formData.append("assistantName",assistantName)
            if(backendImage){
                 formData.append("assistantImage",backendImage)
            }else{
                formData.append("imageUrl",selectedImage)
            }
            // Add customizationData as required by the backend
            formData.append("customizationData", JSON.stringify(customizationData))
            const result=await axios.post(`${serverUrl}/api/user/update`,formData,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
setLoading(false)
            console.log(result.data)
            setUserData(result.data)
            // Force a complete page reload to ensure user data is properly updated
            window.location.replace("/")
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

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
        className="w-full h-full flex justify-center items-center flex-col p-[20px] relative"
      >
        <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]' onClick={()=>navigate("/customize")}/>
        <h1 className='text-white mb-[40px] text-[30px] text-center '>Enter Your <span className='text-blue-200'>Assistant Name</span> </h1>
        <input type="text" placeholder='eg. shifra' className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent  text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}/>
        {assistantName &&  <button className='min-w-[300px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer  bg-white rounded-full text-[19px] ' disabled={loading} onClick={()=>{
          handleUpdateAssistant()
      }
          } >{!loading?"Finally Create Your Assistant":"Loading..."}</button>}
      </motion.div>
    </div>
  )
}

export default Customize2
