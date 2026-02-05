import React, { useContext, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaTrashAlt, FaEdit } from 'react-icons/fa';
import axios from 'axios';

function Notes() {
  const { userData, setUserData, serverUrl } = useContext(userDataContext);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editText, setEditText] = useState('');
  const navigate = useNavigate();

  // Redirect to signin if no user data
  if (!userData) {
    navigate("/signin");
    return null;
  }

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      const result = await axios.post(
        `${serverUrl}/api/user/notes/add`,
        { note: newNote },
        { withCredentials: true }
      );
      setUserData({ ...userData, notes: result.data.notes });
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const deleteNote = async (noteIndex) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/notes/delete`,
        { noteIndex },
        { withCredentials: true }
      );
      setUserData({ ...userData, notes: result.data.notes });
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const startEdit = (index, content) => {
    setEditingNote(index);
    setEditText(content);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;

    const updatedNotes = [...userData.notes];
    updatedNotes[editingNote].content = editText;
    setUserData({ ...userData, notes: updatedNotes });
    setEditingNote(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setEditText('');
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#02023d] p-3 sm:p-4 md:p-6 lg:p-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-white text-lg sm:text-xl hover:text-gray-300 transition-colors p-1"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">My Notes</h1>
          </div>
        </div>

        {/* Add Note Section */}
        <div className="bg-black/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 border border-white/10">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              type="text"
              placeholder="Write a new note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNote()}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 text-sm sm:text-base"
            />
            <button
              onClick={addNote}
              disabled={!newNote.trim()}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FaPlus className="text-xs sm:text-sm" />
              <span className="hidden xs:inline">Add Note</span>
              <span className="xs:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-3 sm:space-y-4">
          {userData.notes && userData.notes.length > 0 ? (
            userData.notes.map((note, index) => (
              <div
                key={index}
                className="bg-black/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300"
              >
                {editingNote === index ? (
                  <div className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 resize-none text-sm sm:text-base"
                      rows="3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 sm:px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                        {note.content}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-2">
                        {note.createdAt ? new Date(note.createdAt).toLocaleString() : 'Just now'}
                      </p>
                    </div>
                    <div className="flex gap-1 sm:gap-2 self-end sm:self-start">
                      <button
                        onClick={() => startEdit(index, note.content)}
                        className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                        title="Edit note"
                      >
                        <FaEdit className="text-sm sm:text-base" />
                      </button>
                      <button
                        onClick={() => deleteNote(index)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete note"
                      >
                        <FaTrashAlt className="text-sm sm:text-base" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="text-4xl sm:text-6xl mb-4">📝</div>
              <p className="text-gray-400 text-base sm:text-lg md:text-xl">No notes yet</p>
              <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-2">Start by adding your first note above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;
