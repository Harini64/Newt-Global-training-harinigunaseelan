import { useCallback, useEffect, useState } from 'react'
import { marksService } from '../services/marksService'
import Card from './Card'
import Toast from './Toast'
import Loader from './Loader'
import { Plus, Pencil, Trash2, X, AlertCircle } from 'lucide-react'

const EXAM_TYPES = ['INTERNAL', 'EXTERNAL', 'SEMESTER']

const emptyMarksForm = () => ({
  subject: '',
  internalMarks: '',
  externalMarks: '',
  semester: 1,
  examType: 'INTERNAL',
})

const StudentMarksPanel = ({ studentId }) => {
  const [rows, setRows] = useState([])
  const [summaries, setSummaries] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyMarksForm)
  const [editForm, setEditForm] = useState(emptyMarksForm)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const load = useCallback(async () => {
    if (!studentId) return
    setLoading(true)
    try {
      const [marksRes, sumRes] = await Promise.all([
        marksService.getMarksByStudentId(studentId, { page: 0, size: 200, sortBy: 'semester', sortDir: 'asc' }),
        marksService.getAllSemesterSummaries(studentId),
      ])
      setRows(marksRes.data.content || [])
      setSummaries(Array.isArray(sumRes.data) ? sumRes.data : [])
    } catch (error) {
      console.error(error)
      setToast({
        message: error.response?.data?.message || 'Could not load marks.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    if (!studentId) {
      setRows([])
      setSummaries([])
      return
    }
    load()
  }, [studentId, load])

  const parseOptInt = (v) => {
    if (v === '' || v === null || v === undefined) return undefined
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!studentId) return
    setSaving(true)
    try {
      await marksService.addMarks(
        {
          subject: form.subject.trim(),
          internalMarks: parseOptInt(form.internalMarks),
          externalMarks: parseOptInt(form.externalMarks),
          semester: Number(form.semester),
          examType: form.examType,
        },
        studentId
      )
      setShowAdd(false)
      setForm(emptyMarksForm())
      await load()
      setToast({ message: 'Marks added.', type: 'success' })
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Could not add marks.',
        type: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  const openEdit = (m) => {
    setEditingId(m.id)
    setEditForm({
      subject: m.subject || '',
      internalMarks: m.internalMarks != null ? String(m.internalMarks) : '',
      externalMarks: m.externalMarks != null ? String(m.externalMarks) : '',
      semester: m.semester ?? 1,
      examType: m.examType || 'INTERNAL',
    })
    setShowEdit(true)
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    if (!editingId) return
    setSaving(true)
    try {
      await marksService.updateMarks(editingId, {
        subject: editForm.subject.trim(),
        internalMarks: parseOptInt(editForm.internalMarks),
        externalMarks: parseOptInt(editForm.externalMarks),
        semester: Number(editForm.semester),
        examType: editForm.examType,
      })
      setShowEdit(false)
      setEditingId(null)
      await load()
      setToast({ message: 'Marks updated.', type: 'success' })
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Could not update marks.',
        type: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this marks record?')) return
    try {
      await marksService.deleteMarks(id)
      await load()
      setToast({ message: 'Record deleted.', type: 'success' })
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Could not delete.',
        type: 'error',
      })
    }
  }

  if (!studentId) {
    return (
      <Card>
        <p className="text-gray-600">Select a student to view and manage marks.</p>
      </Card>
    )
  }

  if (loading && rows.length === 0 && summaries.length === 0) {
    return <Loader />
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-end">
        <button type="button" onClick={() => setShowAdd(true)} className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add marks
        </button>
      </div>

      {summaries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaries.map((summary) => (
            <Card key={summary.semester}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Semester {summary.semester}</h3>
                <span
                  className={`badge ${
                    summary.semesterGPA >= 3.0
                      ? 'badge-success'
                      : summary.semesterGPA >= 2.0
                        ? 'badge-warning'
                        : 'badge-danger'
                  }`}
                >
                  GPA: {summary.semesterGPA}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Average</span>
                  <span className="font-medium text-gray-900">{summary.averageMarks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Grade</span>
                  <span className="font-medium text-gray-900">{summary.overallGrade}</span>
                </div>
              </div>
              {summary.weakSubjects && (
                <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Weak: {summary.weakSubjects}</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All marks records</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Semester</th>
                <th>Exam</th>
                <th>Int</th>
                <th>Ext</th>
                <th>Total</th>
                <th>Grade</th>
                <th className="w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id}>
                  <td className="font-medium">{m.subject}</td>
                  <td>{m.semester}</td>
                  <td>{m.examType}</td>
                  <td>{m.internalMarks ?? '—'}</td>
                  <td>{m.externalMarks ?? '—'}</td>
                  <td>{m.totalMarks ?? '—'}</td>
                  <td>{m.grade ?? '—'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(m)}
                        className="text-primary-600 hover:text-primary-800 p-1"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        aria-label="Delete"
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
        {rows.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">No marks records yet.</div>
        )}
      </Card>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Add marks</h2>
              <button type="button" onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-gray-700" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  className="input-field"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Internal (0–100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="input-field"
                    value={form.internalMarks}
                    onChange={(e) => setForm((f) => ({ ...f, internalMarks: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">External (0–100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="input-field"
                    value={form.externalMarks}
                    onChange={(e) => setForm((f) => ({ ...f, externalMarks: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  className="input-field"
                  value={form.semester}
                  onChange={(e) => setForm((f) => ({ ...f, semester: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam type</label>
                <select
                  className="input-field"
                  value={form.examType}
                  onChange={(e) => setForm((f) => ({ ...f, examType: e.target.value }))}
                >
                  {EXAM_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Edit marks</h2>
              <button
                type="button"
                onClick={() => {
                  setShowEdit(false)
                  setEditingId(null)
                }}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  className="input-field"
                  value={editForm.subject}
                  onChange={(e) => setEditForm((f) => ({ ...f, subject: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Internal</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="input-field"
                    value={editForm.internalMarks}
                    onChange={(e) => setEditForm((f) => ({ ...f, internalMarks: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">External</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="input-field"
                    value={editForm.externalMarks}
                    onChange={(e) => setEditForm((f) => ({ ...f, externalMarks: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  className="input-field"
                  value={editForm.semester}
                  onChange={(e) => setEditForm((f) => ({ ...f, semester: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam type</label>
                <select
                  className="input-field"
                  value={editForm.examType}
                  onChange={(e) => setEditForm((f) => ({ ...f, examType: e.target.value }))}
                >
                  {EXAM_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEdit(false)
                    setEditingId(null)
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
                  {saving ? 'Saving…' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentMarksPanel
