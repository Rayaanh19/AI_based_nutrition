export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p>© {new Date().getFullYear()} AI Nutrition Planner · Built with React + Ollama</p>
      </div>
    </footer>
  )
}
