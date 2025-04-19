"use client"

import type { ReactNode } from "react"

interface StripeProps {
  children: ReactNode
}

export function Stripe({ children }: StripeProps) {
  // Cette composante est un placeholder pour simuler l'intégration de Stripe
  // Dans une implémentation réelle, elle utiliserait @stripe/react-stripe-js
  return <div className="stripe-element">{children}</div>
}
