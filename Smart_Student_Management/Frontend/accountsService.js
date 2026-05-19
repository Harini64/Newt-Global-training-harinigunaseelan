import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { marksService } from '../services/marksService'
import Card from '../components/Card'
import Loader from '../components/Loader'
import StudentSelector from '../components/StudentSelector'
import StudentMarksPanel from '../components/StudentMarksPanel'
import { AlertCircle } from 'lucide-react'

const Marks = () => {
  const { user } = useAuth()
  const [selectedStudentId, setSelectedStudentId] = useState(null)
  const [summaries, setSummaries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const response = await marksService.getMyAllSemesterSummaries()
        if (!cancelled) setSummaries(response.data)
      } catch (error) {
        console.error('Failed to fetch marks:', error)
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Marks</h1>
        <Card className="mb-6">
          <StudentSelector value={selectedStudentId} onChange={setSelectedStudentId} />
          <p className="text-sm text-gray-600 mt-3">
            Add or edit marks per subject; GPA and semester cards are computed from saved records.{' '}
            <Link to="/students" className="text-primary-600 font-medium hover:text-primary-700">
              Students list
            </Link>
          </p>
        </Card>
        <StudentMarksPanel studentId={selectedStudentId} />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Marks</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaries.map((summary) => (
          <Card key={summary.semester}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Semester {summary.semester}
              </h3>
              <span className={`badge ${
                summary.semesterGPA >= 3.0 ? 'badge-success' : 
                summary.semesterGPA >= 2.0 ? 'badge-warning' : 'badge-danger'
              }`}>
                GPA: {summary.semesterGPA}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Marks</span>
                <span className="font-medium">{summary.totalMarks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average</span>
                <span className="font-medium">{summary.averageMarks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Grade</span>
                <span className="font-medium">{summary.overallGrade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Passed</span>
                <span className="font-medium text-green-600">{summary.passedSubjects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Failed</span>
                <span className="font-medium text-red-600">{summary.failedSubjects}</span>
              </div>
            </div>

            {summary.weakSubjects && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <div className="flex items-center text-red-800">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Weak Subjects:</span>
                </div>
                <p className="text-sm text-red-700 mt-1">{summary.weakSubjects}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {summaries.length === 0 && (
        <Card>
          <div className="text-center py-8 text-gray-500">
            No marks records found
          </div>
        </Card>
      )}
    </div>
  )
}

export default Marks
