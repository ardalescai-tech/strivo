import './Sidebar.css'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⚡' },
  { id: 'statistics', label: 'Statistics', icon: '📊' },
  { id: 'history', label: 'History', icon: '📅' },
]

function Sidebar({ activePage, setActivePage }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>Strivo</h1>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar