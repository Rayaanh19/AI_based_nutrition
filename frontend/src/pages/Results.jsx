import { useLocation, useNavigate } from 'react-router-dom'
import { marked } from 'marked'

export default function Results() {
  const navigate = useNavigate()
  const location = useLocation()
  const result = location.state?.result || ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result || '')
      alert('Copied to clipboard')
    } catch (_) { /* noop */ }
  }

  const handleDownload = () => {
    const blob = new Blob([result || ''], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'meal-plan.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container fade-in">
      <div className="results-header">
        <button className="btn-secondary" onClick={() => navigate('/')}>← Back</button>
        <h2 className="page-title">Your personalized meal plan</h2>
        <div className="actions">
          <button className="btn-secondary" onClick={handleCopy}>Copy</button>
          <button className="btn-primary" onClick={handleDownload}>Download</button>
        </div>
      </div>
      <div className="card lift result">
        {result ? (
          <div className="markdown" dangerouslySetInnerHTML={{ __html: marked.parse(result) }} />
        ) : (
          <div className="skeleton">
            <div className="skeleton-line w-60"></div>
            <div className="skeleton-line w-80"></div>
            <div className="skeleton-line w-70"></div>
            <div className="skeleton-line w-90"></div>
            <div className="skeleton-line w-50"></div>
          </div>
        )}
      </div>
    </div>
  )}
