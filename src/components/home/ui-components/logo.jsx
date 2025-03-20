import Link from "next/link"

export default function Logo({ className = "" }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="w-7 h-7 bg-[#8CE563] rounded-md flex items-center justify-center">
        <span className="text-black font-bold text-xs">L</span>
      </div>
      <span className="font-semibold text-white">Layers</span>
    </Link>
  )
}

