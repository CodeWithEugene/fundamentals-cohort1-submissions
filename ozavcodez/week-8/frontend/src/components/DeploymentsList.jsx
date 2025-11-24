export default function DeploymentsList({ deployments, loading }) {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700 bg-slate-700/50">
        <h2 className="text-xl font-bold text-white">Recent Deployments</h2>
      </div>

      {deployments.length === 0 ? (
        <div className="px-6 py-8 text-center text-slate-400">
          No deployments recorded yet
        </div>
      ) : (
        <div className="divide-y divide-slate-700">
          {deployments.map((deployment) => (
            <div
              key={deployment.id}
              className="px-6 py-4 hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {deployment.service}
                    </h3>
                    <span className="text-sm px-2 py-1 bg-slate-700 text-slate-300 rounded">
                      v{deployment.version}
                    </span>
                    <span className="text-sm px-2 py-1 bg-slate-700 text-slate-300 rounded">
                      {deployment.environment}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">
                    {new Date(deployment.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded text-sm font-semibold ${
                  deployment.status === 'success'
                    ? 'bg-green-900/30 text-green-300'
                    : 'bg-red-900/30 text-red-300'
                }`}>
                  {deployment.status.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
