import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { analyticsService } from '../services/analyticsService'
import StatCard from '../components/StatCard'
import Card from '../components/Card'
import Loader from '../components/Loader'
import { Users, Calendar, BookOpen, TrendingUp, AlertTriangle } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchDashboardStats()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchDashboardStats = async () => {
    try {
      const response = await analyticsService.getDashboardStats()
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Welcome back, {user?.name}!
      </h1>

      {user?.role === 'ADMIN' && stats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={Users}
            />
            <StatCard
              title="Total Departments"
              value={stats.totalDepartments}
              icon={BookOpen}
            />
            <StatCard
              title="Avg Attendance"
              value={`${stats.averageAttendancePercentage}%`}
              icon={Calendar}
            />
            <StatCard
              title="Passing Students"
              value={stats.passingStudents}
              icon={TrendingUp}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Attendance Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Records</span>
                  <span className="font-semibold">{stats.totalAttendanceRecords}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Low Attendance Students</span>
                  <span className="font-semibold text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {stats.lowAttendanceStudents}
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performance Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Marks Records</span>
                  <span className="font-semibold">{stats.totalMarksRecords}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Failing Students</span>
                  <span className="font-semibold text-red-600">{stats.failingStudents}</span>
                </div>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Student Dashboard
          </h3>
          <p className="text-gray-600">
            Welcome to your student portal. Use the navigation menu to view your
            attendance, marks, and profile information.
          </p>
        </Card>
      )}
    </div>
  )
}

export default Dashboard
