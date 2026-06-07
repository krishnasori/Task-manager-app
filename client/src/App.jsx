import { useState, useEffect } from 'react'
import './App.css' 

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [filterMode, setFilterMode] = useState('ALL') 
  const [searchQuery, setSearchQuery] = useState('') 

  const fetchTasks = async () => {
    try {
      const response = await fetch('https://task-manager-app-wgkz.onrender.com/tasks')
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = async (e) => {
    e.preventDefault()
    if (!title) return

    await fetch('https://task-manager-app-wgkz.onrender.com/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, dueDate })
    })
    
    setTitle('')
    setDueDate('')
    fetchTasks()
  }

  const toggleComplete = async (task) => {
    await fetch(`https://task-manager-app-wgkz.onrender.com/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed })
    })
    fetchTasks()
  }

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    await fetch(`https://task-manager-app-wgkz.onrender.com/tasks/${id}`, {
      method: 'DELETE'
    })
    fetchTasks()
  }

  // Calculate Metrics
  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;

  // Execute Filter & Search
  const displayedTasks = tasks.filter(task => {
    // 1. Check Status Filter
    if (filterMode === 'ACTIVE' && task.completed) return false;
    if (filterMode === 'COMPLETED' && !task.completed) return false;
    
    // 2. Check Search Query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true; 
  });

  const isOverdue = (dateString, completed) => {
    if (!dateString || completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateString);
    return due < today;
  }

  return (
    <div className="app-container">
      
      <div className="header-container">
        <h1 className="neon-title">Personal_Task_Manager</h1>
      </div>
      
      {/* Interactive Filter Dashboard */}
      <div className="metrics-dashboard">
        <div 
          className={`metric-card ${filterMode === 'ALL' ? 'active-filter' : ''}`}
          onClick={() => setFilterMode('ALL')}
        >
          All: <strong>{tasks.length}</strong>
        </div>
        <div 
          className={`metric-card ${filterMode === 'ACTIVE' ? 'active-filter' : ''}`}
          onClick={() => setFilterMode('ACTIVE')}
        >
          Active: <strong>{activeCount}</strong>
        </div>
        <div 
          className={`metric-card ${filterMode === 'COMPLETED' ? 'active-filter' : ''}`}
          onClick={() => setFilterMode('COMPLETED')}
        >
          Completed: <strong>{completedCount}</strong>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search directives..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="neon-input"
          style={{ width: '100%', padding: '12px', fontSize: '1rem', backgroundColor: '#0a0a0c', border: '1px solid #222', borderRadius: '4px' }}
        />
      </div>
      
      {/* Input Form */}
      <form onSubmit={addTask} className="input-form">
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="New directive..."
          className="neon-input"
          style={{ flexGrow: 1 }}
        />
        <input 
          type="date" 
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)} 
          className="neon-input"
        />
        <button type="submit" className="neon-button">
          Initialize
        </button>
      </form>

      {/* Task List */}
      <ul className="task-list">
        {displayedTasks.map(task => {
          const overdue = isOverdue(task.dueDate, task.completed);
          return (
            <li key={task.id} className={`task-item ${overdue ? 'overdue' : ''}`}>
              
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleComplete(task)}
                className="task-checkbox"
              />
              
              <div className="task-details">
                <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                  {task.title}
                </span>
                {task.dueDate && (
                  <span className={`task-date ${overdue ? 'overdue-text' : ''}`}>
                    Due: {new Date(task.dueDate).toLocaleDateString()} {overdue && '(CRITICAL)'}
                  </span>
                )}
              </div>

              <button onClick={() => deleteTask(task.id)} className="purge-button">
                Purge
              </button>

            </li>
          )
        })}
      </ul>
      
      {displayedTasks.length === 0 && (
        <div style={{ textAlign: 'center', color: '#555', marginTop: '50px', fontStyle: 'italic' }}>
          No records found.
        </div>
      )}
    </div>
  )
}

export default App