import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { attendanceService } from '../services/attendanceService'
import Card from '../components/Card'
import Loader from '../components/Loader'
import StudentSelector from '../components/StudentSelector'
import StudentAttendancePanel from '../components/StudentAttendancePanel'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

const Attendance = () => {
  const { user } = useAuth()
  const [selectedStudentId, setSelectedStudentId] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [percentage, setPercentage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const [listRes, pctRes] = await Promise.all([
          attendanceService.getMyAttendance({ page: 0, size: 50 }),
          attendanceService.getMyAttendancePercentage(),
        ])
        if (!cancelled) {
          setAttendance(listRes.data.content)
          setPercentage(pctRes.data)
        }
      } catch (error) {
        console.error('Failed to fetch attendance:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user?.role])

  if (loading) return <Loader />

  if (user?.role === 'ADMIN') {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Attendance</h1>
        <Card className="mb-6">
          <StudentSelector value={selectedStudentId} onChange={setSelectedStudentId} />
          <p className="text-sm text-gray-600 mt-3">
            Records are stored per student in the database. You can also open a student from the{' '}
            <Link to="/students" className="text-primary-600 font-medium hover:text-primary-700">
              Students
            </Link>{' '}
            list for the same tools on their profile page.
          </p>
        </Card>
        <StudentAttendancePanel studentId={selectedStudentId} />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Attendance</h1>

      {percentage && (
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Overall Attendance
              </h3>
              <p className="text-gray-600">
                {percentage.presentClasses} present out of {percentage.totalClasses} classes
              </p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${
                percentage.overallPercentage >= 75 ? 'text-green-600' : 'text-red-600'
              }`}>
                {percentage.overallPercentage}%
              </p>
              {percentage.isLowAttendance && (
                <div className="flex items-center text-red-600 mt-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  <span className="text-sm">Low Attendance</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Attendance Records
        </h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record.id}>
                  <td>{record.attendanceDate}</td>
                  <td>{record.subject}</td>
                  <td>
                    <span className={`badge ${
                      record.status === 'PRESENT' ? 'badge-success' : 'badge-danger'
                    }`}>
                      {record.status === 'PRESENT' ? (
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {record.status}
                    </span>
                  </td>
                  <td>{record.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {attendance.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No attendance records found
          </div>
        )}
      </Card>
    </div>
  )
}

export default Attendance
