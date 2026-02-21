import { useState, useEffect } from 'react'
import { getData } from '../data/storage'
import './History.css'

function History() {
  const [days, setDays] = useState([])
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    const result = []
    for (let i = 0; i < 30; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = `day_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}`
      const data = await getData(key)
      const label = d.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })

      if (data) {
        result.push({ key, label, data })
      }
    }
    setDays(result)
  }

  const getStatus = (data) => {
    if (data.isRestDay) return { text: 'Rest Day', color: '#f97316' }
    const done = data.tasks.filter(t => t.done).length
    if (done === data.tasks.length) return { text: '✓ Zi completă', color: '#4caf50' }
    if (done > 0) return { text: `${done}/${data.tasks.length} task-uri`, color: '#4f8ef7' }
    return { text: 'Zi ratată', color: '#f44336' }
  }

  return (
    <div className="page history">
      <h2>History</h2>
      <div className="history-list">
        {days.length === 0 && <p className="empty">Nu există istoric încă. Începe să bifezi task-uri!</p>}
        {days.map((day) => {
          const status = getStatus(day.data)
          const isOpen = expanded === day.key
          return (
            <div key={day.key} className="history-card">
              <div className="history-header" onClick={() => setExpanded(isOpen ? null : day.key)}>
                <div>
                  <span className="history-date">{day.label}</span>
                  <span className="history-status" style={{ color: status.color }}>{status.text}</span>
                </div>
                <span className="history-arrow">{isOpen ? '▲' : '▼'}</span>
              </div>
              {isOpen && (
                <div className="history-tasks">
                  {day.data.tasks.map(task => (
                    <div key={task.id} className={`history-task ${task.done ? 'done' : ''}`}>
                      <span>{task.done ? '✓' : '○'} {task.label}</span>
                      {task.note && <p className="history-note">"{task.note}"</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default History