import { useState, useEffect } from 'react'
import { studentService } from '../services/studentService'
import Card from '../components/Card'
import Loader from '../components/Loader'
import Toast from '../components/Toast'
import { Search, Plus, Edit, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const emptyForm = () => ({
  studentName: '',
  studentEmail: '',
  studentPassword: '',
  registerNumber: '',
  department: '',
  year: 1,
  section: '',
  phone: '',
})

const Students = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState(emptyForm)
  const [addSubmitting, setAddSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await studentService.getAllStudents({ page: 0, size: 10 })
      setStudents(response.data.content)
    } catch (error) {
      console.error('Failed to fetch students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const response = await studentService.searchStudents(searchTerm, { page: 0, size: 10 })
        setStudents(response.data.content)
      } catch (error) {
        console.error('Failed to search students:', error)
      }
    } else {
      fetchStudents()
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.deleteStudent(id)
        fetchStudents()
      } catch (error) {
        console.error('Failed to delete student:', error)
      }
    }
  }

  const openAddModal = () => {
    setAddForm(emptyForm())
    setShowAddModal(true)
  }

  const handleAddField = (e) => {
    const { name, value } = e.target
    setAddForm((prev) => ({
      ...prev,
      [name]: name === 'year' ? (value === '' ? '' : Number(value)) : value,
    }))
  }

  const handleAddStudent = async (e) => {
    e.preventDefault()
    setAddSubmitting(true)
    try {
      const phoneDigits = addForm.phone.replace(/\D/g, '')
      const payload = {
        registerNumber: addForm.registerNumber.trim(),
        department: addForm.department.trim(),
        year: Number(addForm.year),
        section: addForm.section.trim() || undefined,
        phone: phoneDigits.length === 10 ? phoneDigits : undefined,
        studentName: addForm.studentName.trim(),
        studentEmail: addForm.studentEmail.trim(),
        studentPassword: addForm.studentPassword,
      }
      await studentService.createStudent(payload)
      setShowAddModal(false)
      setAddForm(emptyForm())
      await fetchStudents()
      setToast({ message: 'Student added successfully.', type: 'success' })
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Could not add student. Check all fields and try again.'
      setToast({ message: msg, type: 'error' })
    } finally {
      setAddSubmitting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <button type="button" onClick={openAddModal} className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Add student</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Creates a <strong>student login</strong> (email + password) and their profile. They sign in with
                that email on the same login page.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input
                  name="studentName"
                  value={addForm.studentName}
                  onChange={handleAddField}
                  className="input-field"
                  required
                  minLength={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student email (login)</label>
                <input
                  name="studentEmail"
                  type="email"
                  value={addForm.studentEmail}
                  onChange={handleAddField}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password (min 6)</label>
                <input
                  name="studentPassword"
                  type="password"
                  value={addForm.studentPassword}
                  onChange={handleAddField}
                  className="input-field"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Register number</label>
                <input
                  name="registerNumber"
                  value={addForm.registerNumber}
                  onChange={handleAddField}
                  className="input-field"
                  required
                  pattern="[A-Za-z0-9]+"
                  title="Letters and numbers only"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  name="department"
                  value={addForm.department}
                  onChange={handleAddField}
                  className="input-field"
                  required
                  minLength={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  name="year"
                  type="number"
                  min={1}
                  max={6}
                  value={addForm.year}
                  onChange={handleAddField}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section (optional)</label>
                <input name="section" value={addForm.section} onChange={handleAddField} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional, 10 digits)</label>
                <input
                  name="phone"
                  value={addForm.phone}
                  onChange={handleAddField}
                  className="input-field"
                  maxLength={10}
                  inputMode="numeric"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={addSubmitting} className="btn-primary flex-1 disabled:opacity-50">
                  {addSubmitting ? 'Saving…' : 'Create student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button onClick={handleSearch} className="btn-secondary">
            Search
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Register No</th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Section</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="font-medium">{student.registerNumber}</td>
                  <td>{student.userName}</td>
                  <td>{student.department}</td>
                  <td>{student.year}</td>
                  <td>{student.section || '-'}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/students/${student.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {students.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No students found
          </div>
        )}
      </Card>
    </div>
  )
}

export default Students
