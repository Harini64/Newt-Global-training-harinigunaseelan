import { useEffect, useState } from 'react'
import { analyticsService } from '../services/analyticsService'
import Card from '../components/Card'
import Loader from '../components/Loader'
import StatCard from '../components/StatCard'
import { TrendingUp, Award, Building2, BookOpen } from 'lucide-react'

const Analytics = () => {
  const [stats, setStats] = useState(null)
  const [topStudents, setTopStudents] = useState([])
  const [departmentStats, setDepartmentStats] = useState([])
  const [subjectStats, setSubjectStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const [statsRes, topRes, deptRes, subjectRes] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getTopStudents(10),
        analyticsService.getDepartmentStats(),
        analyticsService.getSubjectStats(),
      ])

      setStats(statsRes.data)
      setTopStudents(topRes.data)
      setDepartmentStats(deptRes.data)
      setSubjectStats(subjectRes.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={Award}
          />
          <StatCard
            title="Departments"
            value={stats.totalDepartments}
            icon={Building2}
          />
          <StatCard
            title="Avg Attendance"
            value={`${stats.averageAttendancePercentage}%`}
            icon={BookOpen}
          />
          <StatCard
            title="Passing Rate"
            value={
              stats.totalStudents > 0
                ? `${Math.round((stats.passingStudents / stats.totalStudents) * 100)}%`
                : '—'
            }
            icon={TrendingUp}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Students
          </h3>
          <div className="space-y-3">
            {topStudents.slice(0, 5).map((student, index) => (
              <div
                key={student.studentId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                    {student.rank}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{student.studentName}</p>
                    <p className="text-sm text-gray-600">{student.registerNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{student.gpa} GPA</p>
                  <p className="text-sm text-gray-600">{student.department}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Department Statistics
          </h3>
          <div className="space-y-3">
            {departmentStats.map((dept) => (
              <div
                key={dept.department}
                className="p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{dept.department}</span>
                  <span className="text-sm text-gray-600">{dept.totalStudents} students</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Avg GPA: {dept.averageGPA}</span>
                  <span className="text-gray-600">Attendance: {dept.averageAttendance}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Subject Performance
        </h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Average Marks</th>
                <th>Total Students</th>
                <th>Pass Rate</th>
              </tr>
            </thead>
            <tbody>
              {subjectStats.map((subject) => (
                <tr key={subject.subject}>
                  <td className="font-medium">{subject.subject}</td>
                  <td>{subject.averageMarks}</td>
                  <td>{subject.totalStudents}</td>
                  <td>
                    <span className={`badge ${
                      subject.passPercentage >= 75 ? 'badge-success' : 
                      subject.passPercentage >= 50 ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {subject.passPercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default Analytics
