import React, { useContext, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrashAlt, FaSearch, FaThumbtack } from 'react-icons/fa';

function History() {
  const { userData, setUserData } = useContext(userDataContext);
  const [search, setSearch] = useState("");
  const [pinned, setPinned] = useState([]);
  const navigate = useNavigate();

  // Redirect to signin if no user data
  if (!userData) {
    navigate("/signin");
    return null;
  }

  // Clear history
  const clearHistory = () => {
    setUserData({ ...userData, history: [] });
  };

  // Pin/unpin history item
  const togglePin = (index) => {
    if (pinned.includes(index)) {
      setPinned(pinned.filter(i => i !== index));
    } else {
      setPinned([...pinned, index]);
    }
  };

  // Filtered history (by search text)
  const filteredHistory = userData.history?.filter(item =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-h-[100vh] bg-gradient-to-t from-black to-[#02023d] p-5 relative z-10">
      <div className="max-w-[800px] mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="text-white text-xl hover:text-gray-300 transition-colors"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-white text-2xl font-bold">History</h1>
          </div>
          {userData.history?.length > 0 && (
            <button 
              onClick={clearHistory} 
              className="flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors"
            >
              <FaTrashAlt /> Clear All
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2 mb-6">
          <FaSearch className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search history..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-white ml-2 w-full"
          />
        </div>

        {/* History List */}
        <div className="bg-black bg-opacity-50 rounded-xl p-5">
          {filteredHistory && filteredHistory.length > 0 ? (
            <div className="space-y-5 relative">
              {filteredHistory.map((item, index) => (
                <div 
                  key={index} 
                  className={`relative bg-gray-800 hover:bg-gray-700 transition rounded-lg p-4 text-white shadow-md border-l-4 ${
                    pinned.includes(index) ? "border-yellow-400" : "border-blue-500"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-base">{item}</p>
                    <button 
                      onClick={() => togglePin(index)} 
                      className="text-gray-400 hover:text-yellow-400"
                    >
                      <FaThumbtack />
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-16">
              <p className="text-lg">No history available</p>
              <p className="text-sm mt-2">Your conversation history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
