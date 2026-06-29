import { ChartPie } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 w-max group">
      <ChartPie className="bg-primary text-white p-1.5 w-8 h-8 rounded-[10px] transition-transform group-hover:scale-110" />
      <p className="font-semibold transition-colors group-hover:text-primary">Moneto</p>
    </Link>
  )
}