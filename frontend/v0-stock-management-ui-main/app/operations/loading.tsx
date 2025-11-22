export default function OperationsLoading() {
  return (
    <div className="min-h-screen p-6 bg-amber-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-amber-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-700 font-bold">Loading operations...</p>
      </div>
    </div>
  )
}
