import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="site-header">
      <div className="hero-bg"/>
      <div className="header-inner">
        <nav className="top-nav">
          <Link to="/" className="nav-brand">AI Nutrition</Link>
          <div className="nav-links">
            <Link to="/">Generate</Link>
            <a href="https://ollama.com" target="_blank" rel="noreferrer">Ollama</a>
          </div>
        </nav>
        <h1 className="brand">AI Nutrition Planner</h1>
        <p className="tagline">Personalized meal plans powered by AI</p>
      </div>
    </header>
  )
}
