export default function Dashboard({ health, loading }) {
  if (loading) {
    return (
      <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-slate-700 rounded"></div>
          <div className="h-6 bg-slate-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!health) {
    return (
      <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700">
        <p className="text-slate-400">No health data available</p>
      </div>
    )
  }

  const isHealthy = health.status === 'healthy'

  return (
    <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Service Status</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          isHealthy 
            ? 'bg-green-900/30 text-green-300 border border-green-500/50' 
            : 'bg-red-900/30 text-red-300 border border-red-500/50'
        }`}>
          {health.status.toUpperCase()}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700/50 p-4 rounded">
            <p className="text-slate-400 text-sm mb-1">Uptime</p>
            <p className="text-xl font-semibold text-white">
              {Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m
            </p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded">
            <p className="text-slate-400 text-sm mb-1">Version</p>
            <p className="text-xl font-semibold text-white">{health.version}</p>
          </div>
        </div>

        <div className="bg-slate-700/50 p-4 rounded">
          <p className="text-slate-400 text-sm mb-2">Environment</p>
          <p className="font-mono text-sm text-slate-200">{health.environment}</p>
        </div>

        <div className="bg-slate-700/50 p-4 rounded">
          <p className="text-slate-400 text-sm mb-2">Last Check</p>
          <p className="font-mono text-sm text-slate-200">
            {new Date(health.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
