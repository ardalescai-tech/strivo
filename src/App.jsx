import { useState } from 'react'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('dashboard')

  return (
    <div className="app">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        <h2>{activePage}</h2>
      </main>
    </div>
  )
}

export default App