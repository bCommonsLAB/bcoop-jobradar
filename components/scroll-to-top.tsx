"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function scrollToTop(smooth = true) {
  window.scrollTo({
    top: 0,
    behavior: smooth ? "smooth" : "auto"
  })
}

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300)
    }
    
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  if (!isVisible) return null

  return (
    <Button
      onClick={() => scrollToTop()}
      className="fixed bottom-6 right-6 rounded-full w-12 h-12 shadow-lg z-50 hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
      size="icon"
      aria-label="Nach oben scrollen"
    >
      <ArrowUp className="w-5 h-5" />
      <span className="sr-only">Nach oben scrollen</span>
    </Button>
  )
}

