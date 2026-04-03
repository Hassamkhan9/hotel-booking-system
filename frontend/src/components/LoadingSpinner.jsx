export default function LoadingSpinner({ fullPage = false, message = 'Loading...' }) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-navy-800 rounded-full animate-spin mb-4" />
        <p className="text-sm text-gray-500 tracking-widest uppercase">{message}</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-navy-800 rounded-full animate-spin mb-4" />
      <p className="text-sm text-gray-400 tracking-widest uppercase">{message}</p>
    </div>
  )
}