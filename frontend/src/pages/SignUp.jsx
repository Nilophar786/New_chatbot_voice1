import React, { useContext, useState, useEffect } from 'react'
import bg from "../assets/ai-powered-device-concept.jpg"
import { IoEye, IoEyeOff, IoMail, IoLockClosed, IoPerson, IoCheckmarkCircle, IoAlertCircle, IoInformationCircle, IoShield } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from "axios"

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const { serverUrl, userData, setUserData } = useContext(userDataContext)
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")
  const [success, setSuccess] = useState("")

  // Password strength checker
  const getPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    return strength
  }

  const getPasswordStrengthText = (strength) => {
    if (strength === 0) return { text: '', color: '' }
    if (strength <= 2) return { text: 'Weak', color: 'text-red-400' }
    if (strength <= 3) return { text: 'Medium', color: 'text-yellow-400' }
    if (strength <= 4) return { text: 'Strong', color: 'text-blue-400' }
    return { text: 'Very Strong', color: 'text-green-400' }
  }

  const passwordStrength = getPasswordStrength(password)
  const passwordStrengthInfo = getPasswordStrengthText(passwordStrength)

  const handleSignUp = async (e) => {
    e.preventDefault()
    setErr("")
    setSuccess("")

    if (password !== confirmPassword) {
      setErr("Passwords do not match")
      return
    }

    if (passwordStrength < 3) {
      setErr("Please choose a stronger password")
      return
    }

    if (!acceptTerms) {
      setErr("Please accept the terms and conditions")
      return
    }

    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signup`, {
        name,
        email,
        password
      }, { withCredentials: true })
      setUserData(result.data)
      setSuccess("Account created successfully! Redirecting...")

      setTimeout(() => {
        navigate("/")
      }, 1500)
    } catch (error) {
      console.log(error)
      setUserData(null)
      setErr(error.response?.data?.message || "Sign up failed")
    } finally {
      setLoading(false)
    }
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isFormValid = name && email && password && confirmPassword && acceptTerms && password === confirmPassword && passwordStrength >= 3 && isValidEmail(email)

  return (
    <div className='w-full h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center relative overflow-hidden' style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}>
      {/* Animated background overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/50 to-blue-900/50 animate-pulse'></div>

      {/* Floating particles effect */}
      <div className='absolute inset-0 overflow-hidden'>
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className='absolute w-2 h-2 bg-purple-400 rounded-full opacity-20 animate-bounce'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <form className='relative w-[95%] max-w-[900px] bg-white/10 backdrop-blur-xl shadow-2xl shadow-black/50 flex flex-col items-center justify-center gap-4 px-12 py-10 rounded-3xl border border-white/20 transition-all duration-300 hover:shadow-purple-500/20 hover:border-purple-400/30 max-h-[109vh] overflow-y-auto' onSubmit={handleSignUp}>

        {/* Header with enhanced styling */}
        <div className='text-center mb-4'>
          <h1 className='text-4xl font-bold mb-2 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent'>
            Join Us Today
          </h1>
          <p className='text-white/80 text-lg'>Create your Virtual Assistant account</p>
        </div>

        {/* Name Input */}
        <div className='w-full relative'>
          <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'scale-105' : ''}`}>
            <IoPerson className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xl transition-colors duration-300 ${focusedField === 'name' || name ? 'text-purple-400' : 'text-white/60'}`} />
            <input
              type="text"
              placeholder='Enter your full name'
              className={`w-full h-16 pl-12 pr-4 outline-none bg-white/10 border-2 rounded-2xl text-white placeholder-white/50 text-lg transition-all duration-300 backdrop-blur-sm ${
                focusedField === 'name'
                  ? 'border-purple-400 bg-white/20 shadow-lg shadow-purple-400/20'
                  : name
                    ? 'border-green-400 bg-white/15'
                    : 'border-white/30 hover:border-white/50'
              }`}
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField('')}
            />
            {name && (
              <div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
                <IoCheckmarkCircle className='text-green-400 text-xl' />
              </div>
            )}
          </div>
        </div>

        {/* Email Input */}
        <div className='w-full relative'>
          <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-105' : ''}`}>
            <IoMail className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xl transition-colors duration-300 ${focusedField === 'email' || email ? 'text-purple-400' : 'text-white/60'}`} />
            <input
              type="email"
              placeholder='Enter your email'
              className={`w-full h-16 pl-12 pr-4 outline-none bg-white/10 border-2 rounded-2xl text-white placeholder-white/50 text-lg transition-all duration-300 backdrop-blur-sm ${
                focusedField === 'email'
                  ? 'border-purple-400 bg-white/20 shadow-lg shadow-purple-400/20'
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
            <IoLockClosed className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xl transition-colors duration-300 ${focusedField === 'password' || password ? 'text-purple-400' : 'text-white/60'}`} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder='Create a password'
              className={`w-full h-16 pl-12 pr-16 outline-none bg-white/10 border-2 rounded-2xl text-white placeholder-white/50 text-lg transition-all duration-300 backdrop-blur-sm ${
                focusedField === 'password'
                  ? 'border-purple-400 bg-white/20 shadow-lg shadow-purple-400/20'
                  : password
                    ? passwordStrength >= 3
                      ? 'border-green-400 bg-white/15'
                      : 'border-red-400 bg-white/15'
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

          {/* Password Strength Indicator */}
          {password && (
            <div className='mt-2 flex items-center justify-between'>
              <div className='flex items-center'>
                <IoShield className={`text-lg mr-2 ${passwordStrengthInfo.color}`} />
                <span className={`text-sm ${passwordStrengthInfo.color}`}>Password strength: {passwordStrengthInfo.text}</span>
              </div>
              <div className='flex space-x-1'>
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      level <= passwordStrength
                        ? level <= 2
                          ? 'bg-red-400'
                          : level <= 3
                            ? 'bg-yellow-400'
                            : level <= 4
                              ? 'bg-blue-400'
                              : 'bg-green-400'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className='w-full relative'>
          <div className={`relative transition-all duration-300 ${focusedField === 'confirmPassword' ? 'scale-105' : ''}`}>
            <IoLockClosed className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xl transition-colors duration-300 ${focusedField === 'confirmPassword' || confirmPassword ? 'text-purple-400' : 'text-white/60'}`} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder='Confirm your password'
              className={`w-full h-16 pl-12 pr-16 outline-none bg-white/10 border-2 rounded-2xl text-white placeholder-white/50 text-lg transition-all duration-300 backdrop-blur-sm ${
                focusedField === 'confirmPassword'
                  ? 'border-purple-400 bg-white/20 shadow-lg shadow-purple-400/20'
                  : confirmPassword
                    ? password === confirmPassword
                      ? 'border-green-400 bg-white/15'
                      : 'border-red-400 bg-white/15'
                    : 'border-white/30 hover:border-white/50'
              }`}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField('')}
            />
            <button
              type="button"
              className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-300'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <IoEyeOff className='text-xl' /> : <IoEye className='text-xl' />}
            </button>
            {confirmPassword && (
              <div className='absolute right-12 top-1/2 transform -translate-y-1/2'>
                {password === confirmPassword ? (
                  <IoCheckmarkCircle className='text-green-400 text-xl' />
                ) : (
                  <IoAlertCircle className='text-red-400 text-xl' />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Terms and Newsletter */}
        <div className='w-full space-y-3'>
          <label className='flex items-start cursor-pointer group'>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className='mt-1 mr-3 w-4 h-4 accent-purple-400 cursor-pointer'
            />
            <span className='text-white/80 text-sm leading-relaxed'>
              I agree to the{' '}
              <button type="button" className='text-purple-400 hover:text-purple-300 underline'>
                Terms of Service
              </button>
              {' '}and{' '}
              <button type="button" className='text-purple-400 hover:text-purple-300 underline'>
                Privacy Policy
              </button>
            </span>
          </label>

          <label className='flex items-center cursor-pointer group'>
            <input
              type="checkbox"
              checked={subscribeNewsletter}
              onChange={(e) => setSubscribeNewsletter(e.target.checked)}
              className='mr-3 w-4 h-4 accent-purple-400 cursor-pointer'
            />
            <span className='text-white/80 text-sm group-hover:text-white transition-colors duration-300'>
              Subscribe to our newsletter for updates and tips
            </span>
          </label>
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
              ? 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105'
              : 'bg-gray-500/50 cursor-not-allowed'
          }`}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <div className='flex items-center justify-center'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3'></div>
              Creating account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>

        {/* Sign In Link */}
        <p className='text-white/80 text-lg mt-4'>
          Already have an account?{' '}
          <button
            type="button"
            className='text-purple-400 hover:text-purple-300 transition-colors duration-300 font-semibold underline'
            onClick={() => navigate("/signin")}
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  )
}

export default SignUp
