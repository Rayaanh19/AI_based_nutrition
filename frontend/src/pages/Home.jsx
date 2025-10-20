import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialState = {
  age: 30,
  sex: 'male',
  height_cm: 175,
  height_unit: 'cm',
  height_feet: 5,
  height_inches: 9,
  weight_kg: 70,
  activity_level: 'moderate',
  dietary_preferences: '',
  allergies: '',
  goals: 'fat loss',
  cuisine_preferences: ''
}

export default function Home() {
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const toArray = (str) => str
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      let heightCm = Number(form.height_cm)
      if (form.height_unit === 'ft') {
        const feet = Number(form.height_feet) || 0
        const inches = Number(form.height_inches) || 0
        const totalInches = (feet * 12) + inches
        heightCm = Math.round(totalInches * 2.54)
      }
      const payload = {
        age: Number(form.age),
        sex: form.sex,
        height_cm: heightCm,
        weight_kg: Number(form.weight_kg),
        activity_level: form.activity_level,
        dietary_preferences: toArray(form.dietary_preferences),
        allergies: toArray(form.allergies),
        goals: toArray(form.goals),
        cuisine_preferences: toArray(form.cuisine_preferences),
      }
      const res = await fetch('/api/generate-meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const text = await res.text()
      let data
      try { data = JSON.parse(text) } catch { data = null }
      if (!res.ok) {
        const message = (data && (data.error || data.message)) || text || 'Request failed'
        throw new Error(typeof message === 'string' ? message : 'Request failed')
      }
      const result = (data && data.result) ? data.result : text
      navigate('/results', { state: { result } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container fade-in">
      <h2 className="page-title">Create your personalized meal plan</h2>
      <form onSubmit={handleSubmit} className="grid card lift">
        <label>
          Age
          <input type="number" name="age" value={form.age} onChange={handleChange} required />
        </label>
        <label>
          Sex
          <select name="sex" value={form.sex} onChange={handleChange}>
            <option value="male">male</option>
            <option value="female">female</option>
            <option value="other">other</option>
          </select>
        </label>
        <label>
          Height Unit
          <select name="height_unit" value={form.height_unit} onChange={handleChange}>
            <option value="cm">Centimeters</option>
            <option value="ft">Feet/Inches</option>
          </select>
        </label>
        {form.height_unit === 'cm' ? (
          <label>
            Height (cm)
            <input type="number" name="height_cm" value={form.height_cm} onChange={handleChange} required />
          </label>
        ) : (
          <div className="height-imperial" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem'}}>
            <label>
              Height (ft)
              <input type="number" name="height_feet" value={form.height_feet} onChange={handleChange} min="3" max="8" required />
            </label>
            <label>
              Height (in)
              <input type="number" name="height_inches" value={form.height_inches} onChange={handleChange} min="0" max="11" required />
            </label>
          </div>
        )}
        <label>
          Weight (kg)
          <input type="number" name="weight_kg" value={form.weight_kg} onChange={handleChange} required />
        </label>
        <label>
          Activity Level
          <select name="activity_level" value={form.activity_level} onChange={handleChange}>
            <option value="sedentary">sedentary</option>
            <option value="light">light</option>
            <option value="moderate">moderate</option>
            <option value="active">active</option>
            <option value="very_active">very_active</option>
          </select>
        </label>
        <label className="full">
          Dietary Preferences (comma separated)
          <input type="text" name="dietary_preferences" value={form.dietary_preferences} onChange={handleChange} placeholder="vegetarian, high-protein" />
        </label>
        <label className="full">
          Allergies (comma separated)
          <input type="text" name="allergies" value={form.allergies} onChange={handleChange} placeholder="peanuts, shellfish" />
        </label>
        <label className="full">
          Goals (comma separated)
          <input type="text" name="goals" value={form.goals} onChange={handleChange} placeholder="muscle gain, fat loss" />
        </label>
        <label className="full">
          Cuisine Preferences (comma separated)
          <input type="text" name="cuisine_preferences" value={form.cuisine_preferences} onChange={handleChange} placeholder="mediterranean, indian" />
        </label>
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Generating...' : 'Generate Meal Plan'}</button>
      </form>

      {error && <div className="error slide-in">{error}</div>}
    </div>
  )
}
