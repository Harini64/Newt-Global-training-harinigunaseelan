import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Students from '../pages/Students'
import StudentDetails from '../pages/StudentDetails'
import Attendance from '../pages/Attendance'
import Marks from '../pages/Marks'
import Analytics from '../pages/Analytics'
import Accounts from '../pages/Accounts'
import Profile from '../pages/Profile'
import Layout from '../layouts/Layout'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

const AdminRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={
          <AdminRoute>
            <Students />
          </AdminRoute>
        } />
        <Route path="students/:id" element={
          <AdminRoute>
            <StudentDetails />
          </AdminRoute>
        } />
        <Route path="attendance" element={<Attendance />} />
        <Route path="marks" element={<Marks />} />
        <Route path="analytics" element={
          <AdminRoute>
            <Analytics />
          </AdminRoute>
        } />
        <Route path="accounts" element={
          <AdminRoute>
            <Accounts />
          </AdminRoute>
        } />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default AppRoutes
