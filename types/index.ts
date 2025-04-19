export interface InvoiceData {
  documentType: "invoice" | "quote"
  documentNumber: string
  issueDate: string
  dueDate: string
  sender: {
    name: string
    address: string
    siret: string
    email: string
    phone: string
  }
  client: {
    name: string
    address: string
    reference: string
    email: string
    phone: string
  }
  items: InvoiceItem[]
  paymentTerms: string
  notes: string
  logo: string | null
  defaultTaxRate: number
  isExemptFromTax: boolean
}

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
  totalHT: number
  totalTTC: number
}

export const emptyInvoiceData: InvoiceData = {
  documentType: "invoice",
  documentNumber: "",
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  sender: {
    name: "",
    address: "",
    siret: "",
    email: "",
    phone: "",
  },
  client: {
    name: "",
    address: "",
    reference: "",
    email: "",
    phone: "",
  },
  items: [
    {
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxRate: 20,
      totalHT: 0,
      totalTTC: 0,
    },
  ],
  paymentTerms: "Paiement à réception de facture",
  notes: "Auto-entrepreneur non soumis à la TVA. TVA non applicable, art. 293B du CGI.",
  logo: null,
  defaultTaxRate: 20,
  isExemptFromTax: false,
}
