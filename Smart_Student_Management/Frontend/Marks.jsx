import { useEffect, useState } from 'react'
import { accountsService } from '../services/accountsService'
import Card from '../components/Card'
import Loader from '../components/Loader'
import Toast from '../components/Toast'
import { Plus, X } from 'lucide-react'

const emptyForm = () => ({
  name: '',
  email: '',
  password: '',
  role: 'ADMIN',
})

const Accounts = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const load = async () => {
    try {
      const res = await accountsService.listUsers({ page: 0, size: 100, sortBy: 'id', sortDir: 'asc' })
      setRows(res.data.content || [])
    } catch (error) {
      console.error(error)
      setToast({
        message: error.response?.data?.message || 'Could not load accounts.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleField = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await accountsService.createUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      })
      setShowModal(false)
      setForm(emptyForm())
      await load()
      setToast({ message: 'Account created. They can sign in with that email and password.', type: 'success' })
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Could not create account.'
      setToast({ message: msg, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User accounts</h1>
        <button type="button" onClick={() => setShowModal(true)} className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add account
        </button>
      </div>

      <Card>
        <p className="text-sm text-gray-600 mb-4">
          Create additional <strong>administrators</strong> or plain <strong>student logins</strong> (student logins
          here do not create academic profiles—use <strong>Students</strong> for full student records).
        </p>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td className="font-medium">{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className="badge badge-info">{u.role}</span>
                  </td>
                  <td className="text-gray-500">{u.createdAt ? String(u.createdAt).replace('T', ' ').slice(0, 19) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <div className="text-center py-8 text-gray-500">No users found.</div>
        )}
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">New account</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input name="name" value={form.name} onChange={handleField} className="input-field" required minLength={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (login)</label>
                <input name="email" type="email" value={form.email} onChange={handleField} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password (min 6)</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleField}
                  className="input-field"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select name="role" value={form.role} onChange={handleField} className="input-field">
                  <option value="ADMIN">Administrator</option>
                  <option value="STUDENT">Student (login only)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-50">
                  {submitting ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Accounts
