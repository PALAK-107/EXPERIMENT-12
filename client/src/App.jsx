
import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://experiment-12-mern-notes-app.onrender.com/notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);

  // Load notes from MongoDB
  const fetchNotes = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add or update a note
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    try {
      const url = editId
        ? `${API_URL}/${editId}`
        : API_URL;

      const response = await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
      });

      if (!response.ok) {
        throw new Error('Could not save note');
      }

      setTitle('');
      setContent('');
      setEditId(null);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Delete a note
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Could not delete note');
      }

      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Edit a note
  const handleEdit = (note) => {
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <div className="container">
      <h1>My Notes App</h1>

      <form onSubmit={handleSubmit} className="note-form">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
        />

        <button type="submit">
          {editId ? 'Update Note' : 'Add Note'}
        </button>
      </form>

      <div className="notes-list">
        {notes.length === 0 ? (
          <p>No notes yet. Add one above!</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="note-card">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <button onClick={() => handleEdit(note)}>Edit</button>
              <button onClick={() => handleDelete(note._id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
