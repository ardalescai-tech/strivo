import { useState, useEffect } from 'react'
import { getData } from '../data/storage'
import './Statistics.css'

function Statistics() {
  const [weekData, setWeekData] = useState([])

  useEffect(() => {
    loadWeekData()
  }, [])

  const loadWeekData = async () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = `day_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}`
      const data = await getData(key)
      const label = d.toLocaleDateString('ro-RO', { weekday: 'short' })

      if (data && data.isRestDay) {
        days.push({ label, score: null, isRestDay: true })
      } else if (data && data.tasks) {
        const done = data.tasks.filter(t => t.done).length
        const score = Math.round((done / data.tasks.length) * 100)
        days.push({ label, score, isRestDay: false })
      } else {
        days.push({ label, score: null, isRestDay: false })
      }
    }
    setWeekData(days)
  }

  const getBarColor = (day) => {
    if (day.isRestDay) return '#f97316'
    if (day.score === null) return '#2a2a2a'
    if (day.score === 100) return '#4caf50'
    if (day.score >= 50) return '#4f8ef7'
    return '#f44336'
  }

  return (
    <div className="page statistics">
      <h2>Statistics</h2>

      <div className="stats-card">
        <h3>Ultimele 7 zile</h3>
        <div className="bar-chart">
          {weekData.map((day, i) => (
            <div key={i} className="bar-col">
              <div className="bar-wrapper">
                <div
                  className="bar"
                  style={{
                    height: day.score !== null ? `${day.score}%` : day.isRestDay ? '20%' : '4%',
                    background: getBarColor(day)
                  }}
                />
              </div>
              <span className="bar-label">{day.label}</span>
              <span className="bar-score">
                {day.isRestDay ? '😴' : day.score !== null ? `${day.score}%` : '-'}
              </span>
            </div>
          ))}
        </div>

        <div className="legend">
          <span><span className="dot green" />Zi completă</span>
          <span><span className="dot blue" />Parțial</span>
          <span><span className="dot red" />Ratată</span>
          <span><span className="dot orange" />Rest day</span>
        </div>
      </div>
    </div>
  )
}

export default Statistics