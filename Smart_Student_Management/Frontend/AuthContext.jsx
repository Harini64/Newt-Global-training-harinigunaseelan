import { useEffect, useState } from 'react'
import { studentService } from '../services/studentService'

const StudentSelector = ({ value, onChange, disabled }) => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    studentService
      .getAllStudents({ page: 0, size: 500, sortBy: 'registerNumber', sortDir: 'asc' })
      .then((res) => {
        if (!cancelled) setStudents(res.data.content || [])
      })
      .catch(() => {
        if (!cancelled) setStudents([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Student
      <select
        className="input-field mt-1"
        value={value ?? ''}
        onChange={(e) => {
          const v = e.target.value
          onChange(v ? Number(v) : null)
        }}
        disabled={disabled || loading}
      >
        <option value="">— Select student —</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.registerNumber} — {s.userName}
          </option>
        ))}
      </select>
    </label>
  )
}

export default StudentSelector
