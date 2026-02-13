"use client"

import { useRouter } from "next/navigation"
import { Languages } from "lucide-react"
import { Button } from "./ui/button"

export function LanguageToggleButton() {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-white hover:text-white hover:bg-white/20 rounded-xl"
      title="Profil / Profile"
      onClick={() => router.push("/profile")}
    >
      <Languages className="h-5 w-5" />
    </Button>
  )
}
