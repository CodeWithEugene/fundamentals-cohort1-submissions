import { useState, useEffect } from 'react'
import axios from 'axios'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import MetricsPanel from './components/MetricsPanel'
import DeploymentsList from './components/DeploymentsList'

function App() {
  const [health, setHealth] = useState(null)
  const [deployments, setDeployments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [healthRes, deploymentsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/health`, { timeout: 5000 }),
        axios.get(`${BACKEND_URL}/api/deployments`, { timeout: 5000 })
      ])

      if (!healthRes.data.success) {
        throw new Error(healthRes.data.error?.message || 'Health check failed')
      }

      if (!deploymentsRes.data.success) {
        throw new Error(deploymentsRes.data.error?.message || 'Failed to fetch deployments')
      }

      setHealth(healthRes.data.data)
      setDeployments(deploymentsRes.data.data || [])
    } catch (err) {
      console.error('[v0] Error fetching data:', {
        status: err.response?.status,
        message: err.message,
        code: err.response?.data?.error?.code,
      })
      setError(err.response?.data?.error?.message || 'Failed to connect to backend')
      setDeployments([])
      setHealth(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-200">
              <span className="font-semibold">Connection Error:</span> {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Dashboard health={health} loading={loading} />
          <MetricsPanel health={health} loading={loading} />
        </div>

        <DeploymentsList deployments={deployments} loading={loading} />

        <button
          onClick={fetchData}
          disabled={loading}
          className="mt-8 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh Now'}
        </button>
      </main>
    </div>
  )
}

export default App
