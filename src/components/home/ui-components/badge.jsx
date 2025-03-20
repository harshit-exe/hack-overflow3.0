export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-gray-800 text-gray-300",
    purple: "bg-purple-600/30 text-purple-300",
    green: "bg-green-600/30 text-green-300",
    blue: "bg-blue-600/30 text-blue-300",
  }

  return (
    <div className={`inline-block px-3 py-1 rounded-full text-xs ${variants[variant]} ${className}`}>{children}</div>
  )
}

