import { useCallback, useEffect, useState } from 'react'
import { attendanceService } from '../services/attendanceService'
import Card from './Card'
import Toast from './Toast'
import Loader from './Loader'
import { CheckCircle, XCircle, AlertTriangle, Plus, Trash2, X } from 'lucide-react'

const emptyAttendanceForm = () => ({
  attendanceDate: new Date().toISOString().slice(0, 10),
  subject: '',
  status: 'PRESENT',
  remarks: '',
})

const formatApiDate = (d) => {
  if (!d) return ''
  if (typeof d === 'string') return d.length >= 10 ? d.slice(0, 10) : d
  return String(d)
}

const StudentAttendancePanel = ({ studentId }) => {
  const [attendance, setAttendance] = useState([])
  const [percentage, setPercentage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(emptyAttendanceForm)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const load = useCallback(async () => {
    if (!studentId) return
    setLoading(true)
    try {
      const [listRes, pctRes] = await Promise.all([
        attendanceService.getAttendanceByStudentId(studentId, { page: 0, size: 100, sortBy: 'attendanceDate', sortDir: 'desc' }),
        attendanceService.getAttendancePercentage(studentId),
      ])
      setAttendance(listRes.data.content || [])
      setPercentage(pctRes.data)
    } catch (error) {
      console.error(error)
      setToast({
        message: error.response?.data?.message || 'Could not load attendance.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    if (!studentId) {
      setAttendance([])
      setPercentage(null)
      return
    }
    load()
  }, [studentId, load])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!studentId) return
    setSaving(true)
    try {
      await attendanceService.markAttendance(
        {
          attendanceDate: form.attendanceDate,
          subject: form.subject.trim(),
          status: form.status,
          remarks: form.remarks.trim() || undefined,
        },
        studentId
      )
      setShowAdd(false)
      setForm(emptyAttendanceForm())
      await load()
      setToast({ message: 'Attendance saved.', type: 'success' })
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Could not save attendance.',
        type: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this attendance record?')) return
    try {
      await attendanceService.deleteAttendance(id)
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
        <p className="text-gray-600">Select a student to view and manage attendance.</p>
      </Card>
    )
  }

  if (loading && attendance.length === 0 && !percentage) {
    return <Loader />
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-end">
        <button type="button" onClick={() => setShowAdd(true)} className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add attendance
        </button>
      </div>

      {percentage && (
        <Card className="mb-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Overall attendance</h3>
              <p className="text-gray-600">
                {percentage.presentClasses} present out of {percentage.totalClasses} classes
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-3xl font-bold ${
                  percentage.overallPercentage >= 75 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {percentage.overallPercentage}%
              </p>
              {percentage.isLowAttendance && (
                <div className="flex items-center text-red-600 mt-1 justify-end">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  <span className="text-sm">Low attendance</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance records</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Remarks</th>
                <th className="w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record.id}>
                  <td>{formatApiDate(record.attendanceDate)}</td>
                  <td>{record.subject}</td>
                  <td>
                    <span
                      className={`badge ${
                        record.status === 'PRESENT' ? 'badge-success' : 'badge-danger'
                      }`}
                    >
                      {record.status === 'PRESENT' ? (
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {record.status}
                    </span>
                  </td>
                  <td>{record.remarks || '—'}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {attendance.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">No attendance records yet.</div>
        )}
      </Card>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Add attendance</h2>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={form.attendanceDate}
                  onChange={(e) => setForm((f) => ({ ...f, attendanceDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  className="input-field"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  required
                  minLength={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="input-field"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                >
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (optional)</label>
                <input
                  className="input-field"
                  value={form.remarks}
                  onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
                />
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
    </div>
  )
}

export default StudentAttendancePanel
