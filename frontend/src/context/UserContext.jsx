import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const userDataContext = createContext()

function UserContext({ children }) {
  const navigate = useNavigate()
  // Use the correct backend URL for production
  const serverUrl = 'https://new-chatbot-voice1-backend.onrender.com'

  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [tasks, setTasks] = useState([])
  const [notes, setNotes] = useState([])
  const [customizationData, setCustomizationData] = useState({
    themeColors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#0f0f23'
    },
    selectedVoice: '',
    avatarScale: 1,
    avatarRotation: 0,
    voiceAssistantImage: null
  })

  // ✅ Make sure history is always initialized
  const handleCurrentUser = async () => {
    console.log('handleCurrentUser called')
    try {
      setLoading(true)
      setError(null)

      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      })
      console.log('handleCurrentUser result:', result.data)

      let user = result.data
      if (!user.history) user.history = [] // ensure history exists
      setUserData(user)

      if (user.tasks) setTasks(user.tasks)
      if (user.notes) setNotes(user.notes)
      if (user.customizationData) setCustomizationData(user.customizationData)
    } catch (error) {
      console.log('handleCurrentUser error:', error)
      setError(error)

      if (error.response && error.response.status === 401) {
        console.log('User not authenticated')
        setUserData(null)
        navigate('/signin')
      } else if (error.response && error.response.status === 403) {
        console.log('Access forbidden')
      } else {
        console.log('Other error:', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ Push query + response into history
  const getAssistantResponse = async (command) => {
    console.log('getAssistantResponse called with command:', command)
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      )
      console.log('getAssistantResponse result:', result.data)

      const responseText = result.data.response || result.data
      const historyItem = `You: ${command} | Assistant: ${responseText}`

      setUserData((prev) => {
        const updatedHistory = [...(prev?.history || []), historyItem]
        return { ...prev, history: updatedHistory }
      })

      return result.data
    } catch (error) {
      console.log('getAssistantResponse error:', error)
      return null
    }
  }

  // ✅ Clear all history
  const clearHistory = () => {
    setUserData((prev) => ({ ...prev, history: [] }))
  }

  // ✅ Refresh user data after customization changes
  const refreshUserData = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      })
      console.log('refreshUserData result:', result.data)

      let user = result.data
      if (!user.history) user.history = [] // ensure history exists
      setUserData(user)

      if (user.tasks) setTasks(user.tasks)
      if (user.notes) setNotes(user.notes)
      if (user.customizationData) setCustomizationData(user.customizationData)
    } catch (error) {
      console.log('refreshUserData error:', error)
    }
  }

  // New API methods for AI features
  const solveMath = async (expression) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/solve-math`,
        { expression },
        { withCredentials: true }
      )
      return result.data
    } catch (error) {
      console.error('solveMath error:', error)
      return null
    }
  }

  const convertCurrency = async (amount, from, to) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/convert-currency`,
        { amount, from, to },
        { withCredentials: true }
      )
      return result.data
    } catch (error) {
      console.error('convertCurrency error:', error)
      return null
    }
  }

  const searchWeb = async (query) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/search-web`,
        { query },
        { withCredentials: true }
      )
      return result.data
    } catch (error) {
      console.error('searchWeb error:', error)
      return null
    }
  }

  const getWikipediaSummary = async (query) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/wikipedia`,
        { query },
        { withCredentials: true }
      )
      return result.data
    } catch (error) {
      console.error('getWikipediaSummary error:', error)
      return null
    }
  }

  const getWeather = async (city) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/weather`,
        { city },
        { withCredentials: true }
      )
      return result.data
    } catch (error) {
      console.error('getWeather error:', error)
      return null
    }
  }

  const getJoke = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/joke`,
        {},
        { withCredentials: true }
      )
      return result.data
    } catch (error) {
      console.error('getJoke error:', error)
      return null
    }
  }

  const getQuote = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/quote`,
        {},
        { withCredentials: true }
      )
      return result.data
    } catch (error) {
      console.error('getQuote error:', error)
      return null
    }
  }

  // Productivity methods
  const addTask = async (task) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/tasks/add`,
        { task },
        { withCredentials: true }
      )
      setTasks((prev) => [...prev, result.data])
      return result.data
    } catch (error) {
      console.error('addTask error:', error)
      return null
    }
  }

  const getTasks = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/tasks`, {
        withCredentials: true,
      })
      setTasks(result.data)
      return result.data
    } catch (error) {
      console.error('getTasks error:', error)
      return []
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await axios.post(
        `${serverUrl}/api/user/tasks/delete`,
        { taskId },
        { withCredentials: true }
      )
      setTasks((prev) => prev.filter((task) => task._id !== taskId))
      return true
    } catch (error) {
      console.error('deleteTask error:', error)
      return false
    }
  }

  const addNote = async (note) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/notes/add`,
        { note },
        { withCredentials: true }
      )
      setNotes((prev) => [...prev, result.data])
      return result.data
    } catch (error) {
      console.error('addNote error:', error)
      return null
    }
  }

  const getNotes = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/notes`, {
        withCredentials: true,
      })
      setNotes(result.data)
      return result.data
    } catch (error) {
      console.error('getNotes error:', error)
      return []
    }
  }

  useEffect(() => {
    handleCurrentUser()
  }, [])

  const value = {
    serverUrl,
    userData,
    setUserData,
    loading,
    error,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    tasks,
    setTasks,
    notes,
    setNotes,
    getAssistantResponse,
    handleCurrentUser,
    clearHistory, // ✅ new
    refreshUserData, // ✅ new - for refreshing after customization
    solveMath,
    convertCurrency,
    searchWeb,
    getWikipediaSummary,
    getWeather,
    getJoke,
    getQuote,
    addTask,
    getTasks,
    deleteTask,
    addNote,
    getNotes,
    customizationData,
    setCustomizationData,
  }

  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext
