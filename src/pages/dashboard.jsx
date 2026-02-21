import { useState, useEffect } from 'react'
import { getData, setData, getTodayKey, getYesterdayKey } from '../data/storage'
import './Dashboard.css'

const DEFAULT_TASKS = [
  { id: 1, label: 'Mers la sală' },
  { id: 2, label: 'Luat sora de la școală' },
  { id: 3, label: 'Mâncat acasă' },
  { id: 4, label: 'Studiat CompTIA' },
  { id: 5, label: 'Lucrat la Strivo' },
]

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [streak, setStreak] = useState(0)
  const [yesterdayScore, setYesterdayScore] = useState(null)
  const [isRestDay, setIsRestDay] = useState(false)
  const [newTaskLabel, setNewTaskLabel] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingLabel, setEditingLabel] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      tasks.forEach(task => {
        if (task.time && task.time === currentTime && !task.done && !task.notified) {
          new Notification(`⚡ Strivo`, {
            body: `E timpul să faci: ${task.label}`
          })
          const updated = tasks.map(t => t.id === task.id ? { ...t, notified: true } : t)
          setTasks(updated)
        }
      })
    }, 30000)
    return () => clearInterval(interval)
  }, [tasks])

  const loadData = async () => {
    const todayKey = getTodayKey()
    const todayData = await getData(todayKey)
    const streakData = await getData('streak') || 0
    const yesterdayData = await getData(getYesterdayKey())
    const savedTemplate = await getData('task_template')

    if (todayData) {
      setTasks(todayData.tasks)
      setIsRestDay(todayData.isRestDay || false)
    } else {
      const template = savedTemplate || DEFAULT_TASKS
      const initialTasks = template.map(t => ({ ...t, done: false, note: '', time: '', notified: false }))
      setTasks(initialTasks)
    }

    setStreak(streakData)
    if (yesterdayData) {
      const done = yesterdayData.tasks.filter(t => t.done).length
      setYesterdayScore(Math.round((done / yesterdayData.tasks.length) * 100))
    }
  }

  const toggleTask = async (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
    setTasks(updated)
    await saveDay(updated)
  }

  const updateNote = async (id, note) => {
    const updated = tasks.map(t => t.id === id ? { ...t, note } : t)
    setTasks(updated)
    await saveDay(updated)
  }

  const updateTime = async (id, time) => {
    const updated = tasks.map(t => t.id === id ? { ...t, time, notified: false } : t)
    setTasks(updated)
    await saveDay(updated)
  }

  const addTask = async () => {
    if (!newTaskLabel.trim()) return
    const newTask = {
      id: Date.now(),
      label: newTaskLabel.trim(),
      done: false,
      note: '',
      time: '',
      notified: false
    }
    const updated = [...tasks, newTask]
    setTasks(updated)
    setNewTaskLabel('')
    await saveDay(updated)
    await setData('task_template', updated.map(t => ({ id: t.id, label: t.label })))
  }

  const deleteTask = async (id) => {
    const updated = tasks.filter(t => t.id !== id)
    setTasks(updated)
    await saveDay(updated)
    await setData('task_template', updated.map(t => ({ id: t.id, label: t.label })))
  }

  const startEdit = (task) => {
    setEditingId(task.id)
    setEditingLabel(task.label)
  }

  const saveEdit = async (id) => {
    if (!editingLabel.trim()) return
    const updated = tasks.map(t => t.id === id ? { ...t, label: editingLabel.trim() } : t)
    setTasks(updated)
    setEditingId(null)
    await saveDay(updated)
    await setData('task_template', updated.map(t => ({ id: t.id, label: t.label })))
  }

  const saveDay = async (updatedTasks) => {
    const todayKey = getTodayKey()
    await setData(todayKey, { tasks: updatedTasks, isRestDay })
    const allDone = updatedTasks.every(t => t.done)
    if (allDone) {
      await setData('streak', streak + 1)
      setStreak(streak + 1)
    }
  }

  const toggleRestDay = async () => {
    const newVal = !isRestDay
    setIsRestDay(newVal)
    await setData(getTodayKey(), { tasks, isRestDay: newVal })
  }

  const todayScore = tasks.length > 0
    ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100)
    : 0

  return (
    <div className="page dashboard">
      <div className="streak-banner">
        <span className="streak-fire">🔥</span>
        <span className="streak-count">{streak}</span>
        <span className="streak-label">day streak</span>
      </div>

      {yesterdayScore !== null && (
        <div className="comparison-bar">
          <div className="comparison-item">
            <span className="comparison-label">Ieri</span>
            <div className="comparison-track">
              <div className="comparison-fill yesterday" style={{ width: `${yesterdayScore}%` }} />
            </div>
            <span className="comparison-percent">{yesterdayScore}%</span>
          </div>
          <div className="comparison-item">
            <span className="comparison-label">Azi</span>
            <div className="comparison-track">
              <div className="comparison-fill today" style={{ width: `${todayScore}%` }} />
            </div>
            <span className="comparison-percent" style={{ color: todayScore >= yesterdayScore ? '#4caf50' : '#f44336' }}>
              {todayScore}% {todayScore >= yesterdayScore ? '↑' : '↓'}
            </span>
          </div>
        </div>
      )}

      <div className="tasks-section">
        <div className="tasks-header">
          <h2>Task-urile de azi</h2>
          <button
            className={`rest-day-btn ${isRestDay ? 'active' : ''}`}
            onClick={toggleRestDay}
          >
            {isRestDay ? '😴 Rest Day activ' : 'Set Rest Day'}
          </button>
        </div>

        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task.id} className={`task-card ${task.done ? 'done' : ''}`}>
              <div className="task-top">
                <button
                  className={`task-check ${task.done ? 'checked' : ''}`}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.done ? '✓' : ''}
                </button>
                {editingId === task.id ? (
                  <input
                    className="task-edit-input"
                    value={editingLabel}
                    onChange={e => setEditingLabel(e.target.value)}
                    onBlur={() => saveEdit(task.id)}
                    onKeyDown={e => e.key === 'Enter' && saveEdit(task.id)}
                    autoFocus
                  />
                ) : (
                  <span className="task-label" onDoubleClick={() => startEdit(task)}>
                    {task.label}
                  </span>
                )}
                {!task.done && (
                  <input
                    type="time"
                    className="task-time"
                    value={task.time || ''}
                    onChange={e => updateTime(task.id, e.target.value)}
                  />
                )}
                {!task.done && (
                  <button className="task-delete" onClick={() => deleteTask(task.id)}>✕</button>
                )}
              </div>
              {task.done && (
                <input
                  className="task-note"
                  placeholder="Adaugă o notă..."
                  value={task.note}
                  onChange={e => updateNote(task.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <div className="add-task-row">
          <input
            className="add-task-input"
            placeholder="Adaugă un task nou..."
            value={newTaskLabel}
            onChange={e => setNewTaskLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
          />
          <button className="add-task-btn" onClick={addTask}>+</button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard