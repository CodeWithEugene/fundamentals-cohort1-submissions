export default function Header() {
  return (
    <header className="bg-slate-900/50 border-b border-slate-700 backdrop-blur">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">DeployHub</h1>
            <p className="text-slate-400 text-sm mt-1">CI/CD Pipeline Monitoring & Observability</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Production Dashboard</p>
            <p className="text-slate-500 text-xs mt-1">{new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
