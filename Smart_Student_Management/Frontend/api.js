import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { studentService } from '../services/studentService'
import Card from '../components/Card'
import Loader from '../components/Loader'
import StudentAttendancePanel from '../components/StudentAttendancePanel'
import StudentMarksPanel from '../components/StudentMarksPanel'
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from 'lucide-react'

const StudentDetails = () => {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudent()
  }, [id])

  const fetchStudent = async () => {
    try {
      const response = await studentService.getStudentById(id)
      setStudent(response.data)
    } catch (error) {
      console.error('Failed to fetch student:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  if (!student) {
    return <div className="text-center py-8">Student not found</div>
  }

  return (
    <div>
      <Link
        to="/students"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to students
      </Link>

      <Card>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{student.userName}</h1>
            <p className="text-gray-600">{student.registerNumber}</p>
          </div>
          <span className="badge badge-info">{student.userRole}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-600">{student.userEmail}</span>
              </div>
              {student.phone && (
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">{student.phone}</span>
                </div>
              )}
              {student.address && (
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">{student.address}</span>
                </div>
              )}
              {student.dateOfBirth && (
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">{student.dateOfBirth}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Academic Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Department</span>
                <span className="font-medium">{student.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Year</span>
                <span className="font-medium">{student.year}</span>
              </div>
              {student.section && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Section</span>
                  <span className="font-medium">{student.section}</span>
                </div>
              )}
              {student.admissionYear && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Admission Year</span>
                  <span className="font-medium">{student.admissionYear}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-8 space-y-8">
        <section aria-labelledby="att-heading">
          <h2 id="att-heading" className="text-lg font-semibold text-gray-900 mb-4">
            Attendance
          </h2>
          <StudentAttendancePanel studentId={student.id} />
        </section>
        <section aria-labelledby="marks-heading">
          <h2 id="marks-heading" className="text-lg font-semibold text-gray-900 mb-4">
            Marks
          </h2>
          <StudentMarksPanel studentId={student.id} />
        </section>
      </div>
    </div>
  )
}

export default StudentDetails
