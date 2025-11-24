export default function MetricsPanel({ health, loading }) {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-slate-700 rounded"></div>
          <div className="h-6 bg-slate-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!health) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <p className="text-slate-400">No metrics available</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
      <h2 className="text-xl font-bold text-white mb-6">System Metrics</h2>

      <div className="space-y-4">
        <div className="bg-slate-700/50 p-4 rounded">
          <p className="text-slate-400 text-sm mb-1">RSS Memory</p>
          <p className="text-lg font-semibold text-white">{health.memory.rss}</p>
          <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{width: '45%'}}></div>
          </div>
        </div>

        <div className="bg-slate-700/50 p-4 rounded">
          <p className="text-slate-400 text-sm mb-1">Heap Used</p>
          <p className="text-lg font-semibold text-white">{health.memory.heapUsed}</p>
          <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{width: '32%'}}></div>
          </div>
        </div>

        <div className="bg-slate-700/50 p-4 rounded">
          <p className="text-slate-400 text-sm mb-1">Heap Total</p>
          <p className="text-lg font-semibold text-white">{health.memory.heapTotal}</p>
        </div>
      </div>
    </div>
  )
}
