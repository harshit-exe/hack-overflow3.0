import Link from "next/link";

export default function Logo({ className = "" }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="font-bold text-2xl md:text-3xl lg:text-4xl">
      <span className=" text-[#8CE563]">
        M
      </span>arg.ai</div>
    </Link>
  );
}
