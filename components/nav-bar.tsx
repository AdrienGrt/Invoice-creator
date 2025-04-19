"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Home, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function NavBar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <FileText className="h-6 w-6" />
              <span>FacturePro</span>
            </Link>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === "/" ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Home className="h-4 w-4" />
              Accueil
            </Link>
            <Link
              href="/creation"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === "/creation" ? "text-primary" : "text-muted-foreground",
              )}
            >
              <FileText className="h-4 w-4" />
              Création de facture
            </Link>
          </nav>

          {/* Bouton menu mobile */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                pathname === "/" ? "bg-muted text-primary" : "text-muted-foreground",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              Accueil
            </Link>
            <Link
              href="/creation"
              className={cn(
                "flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                pathname === "/creation" ? "bg-muted text-primary" : "text-muted-foreground",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="h-4 w-4" />
              Création de facture
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
