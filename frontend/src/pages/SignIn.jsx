import React, { useContext, useState, useEffect } from 'react'
import bg from "../assets/ai-powered-device-concept.jpg"
import { IoEye, IoEyeOff, IoMail, IoLockClosed, IoPerson, IoCheckmarkCircle, IoAlertCircle, IoInformationCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from "axios"

function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const { serverUrl, userData, setUserData } = useContext(userDataContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
  const [success, setSuccess] = useState("")

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail')
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSignIn = async (e) => {
    e.preventDefault()
    setErr("")
    setSuccess("")
    setLoading(true)

    try {
      let result = await axios.post(`${serverUrl}/api/auth/signin`, {
        email, password
      }, { withCredentials: true })

      setUserData(result.data)
      setSuccess("Sign in successful! Redirecting...")

      // Remember email if checkbox is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      setTimeout(() => {
        navigate("/")
      }, 1500)

    } catch (error) {
      console.log(error)
      setUserData(null)
      setErr(error.response?.data?.message || "Sign in failed")
    } finally {
      setLoading(false)
    }
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isFormValid = email && password && isValidEmail(email)

  return (
    <div className='w-full h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center relative overflow-hidden' style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}>
      {/* Animated background overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-black/70 via-blue-900/50 to-purple-900/50 animate-pulse'></div>

      {/* Floating particles effect */}
      <div className='absolute inset-0 overflow-hidden'>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className='absolute w-2 h-2 bg-blue-400 rounded-full opacity-20 animate-bounce'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <form className='relative w-[95%] max-w-[700px] bg-white/10 backdrop-blur-xl shadow-2xl shadow-black/50 flex flex-col items-center justify-center gap-6 px-12 py-12 rounded-3xl border border-white/20 transition-all duration-300 hover:shadow-purple-500/20 hover:border-purple-400/30' onSubmit={handleSignIn}>

        {/* Header with enhanced styling */}
        <div className='text-center mb-4'>
          <h1 className='text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
            Welcome Back
          </h1>
          <p className='text-white/80 text-lg'>Sign in to your Virtual Assistant account</p>
        </div>

        {/* Email Input */}
        <div className='w-full relative'>
          <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-105' : ''}`}>
            <IoMail className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xl transition-colors duration-300 ${focusedField === 'email' || email ? 'text-blue-400' : 'text-white/60'}`} />
            <input
              type="email"
              placeholder='Enter your email'
              className={`w-full h-16 pl-12 pr-4 outline-none bg-white/10 border-2 rounded-2xl text-white placeholder-white/50 text-lg transition-all duration-300 backdrop-blur-sm ${
                focusedField === 'email'
                  ? 'border-blue-400 bg-white/20 shadow-lg shadow-blue-400/20'
                  : email
                    ? 'border-green-400 bg-white/15'
                    : 'border-white/30 hover:border-white/50'
              }`}
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField('')}
            />
            {email && (
              <div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
                {isValidEmail(email) ? (
                  <IoCheckmarkCircle className='text-green-400 text-xl' />
                ) : (
                  <IoAlertCircle className='text-red-400 text-xl' />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Password Input */}
        <div className='w-full relative'>
          <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-105' : ''}`}>
            <IoLockClosed className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xl transition-colors duration-300 ${focusedField === 'password' || password ? 'text-blue-400' : 'text-white/60'}`} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder='Enter your password'
              className={`w-full h-16 pl-12 pr-16 outline-none bg-white/10 border-2 rounded-2xl text-white placeholder-white/50 text-lg transition-all duration-300 backdrop-blur-sm ${
                focusedField === 'password'
                  ? 'border-blue-400 bg-white/20 shadow-lg shadow-blue-400/20'
                  : password
                    ? 'border-green-400 bg-white/15'
                    : 'border-white/30 hover:border-white/50'
              }`}
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField('')}
            />
            <button
              type="button"
              className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-300'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOff className='text-xl' /> : <IoEye className='text-xl' />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className='w-full flex justify-between items-center text-white/80'>
          <label className='flex items-center cursor-pointer group'>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className='mr-3 w-4 h-4 accent-blue-400 cursor-pointer'
            />
            <span className='text-sm group-hover:text-white transition-colors duration-300'>Remember me</span>
          </label>
          <button
            type="button"
            className='text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300 underline'
            onClick={() => alert('Forgot password functionality would be implemented here')}
          >
            Forgot password?
          </button>
        </div>

        {/* Error Message */}
        {err && (
          <div className='w-full flex items-center bg-red-500/20 border border-red-500/50 rounded-xl p-4 animate-pulse'>
            <IoAlertCircle className='text-red-400 text-xl mr-3 flex-shrink-0' />
            <p className='text-red-200 text-sm'>{err}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className='w-full flex items-center bg-green-500/20 border border-green-500/50 rounded-xl p-4 animate-pulse'>
            <IoCheckmarkCircle className='text-green-400 text-xl mr-3 flex-shrink-0' />
            <p className='text-green-200 text-sm'>{success}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          className={`w-full h-16 mt-4 text-white font-semibold text-xl rounded-2xl transition-all duration-300 transform ${
            isFormValid && !loading
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105'
              : 'bg-gray-500/50 cursor-not-allowed'
          }`}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <div className='flex items-center justify-center'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3'></div>
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Sign Up Link */}
        <p className='text-white/80 text-lg mt-4'>
          Don't have an account?{' '}
          <button
            type="button"
            className='text-blue-400 hover:text-blue-300 transition-colors duration-300 font-semibold underline'
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  )
}

export default SignIn
