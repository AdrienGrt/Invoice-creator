import type { InvoiceData } from "@/types"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

import { formatCurrency, formatDate } from "./utils"



export async function generatePDF(data: InvoiceData, templateName = "template1"): Promise<void> {
  // Créer un nouveau document PDF
  const doc = new jsPDF()

  // Définir les marges
  const margin = 15
  const y = margin

  // Appliquer le style du template
  switch (templateName) {
    case "template2":
      return generateTemplate2PDF(data)
    case "template3":
      return generateTemplate3PDF(data)
    case "template4":
      return generateTemplate4PDF(data)
    case "template1":
    default:
      return generateTemplate1PDF(data)
  }
}

// Template 1 - Design Violet et Rose
async function generateTemplate1PDF(data: InvoiceData): Promise<void> {
  const doc = new jsPDF()
  const margin = 15
  let y = margin

  // Ajouter des formes décoratives
  doc.setFillColor(128, 0, 128, 0.1) // Violet pâle
  doc.roundedRect(doc.internal.pageSize.width - 60, 0, 60, 60, 0, 60, "F") // Coin supérieur droit

  doc.setFillColor(219, 39, 119, 0.1) // Rose pâle
  doc.roundedRect(0, doc.internal.pageSize.height - 30, 40, 30, 20, 0, "F") // Coin inférieur gauche

  // Ajouter le logo s'il existe
  if (data.logo) {
    try {
      const img = new Image()
      img.src = data.logo
      doc.addImage(img, "JPEG", margin, y, 40, 20)
      y += 25
    } catch (e) {
      console.error("Erreur lors de l'ajout du logo", e)
    }
  }

  // Titre du document avec dégradé (simulé)
  const documentTitle = data.documentType === "invoice" ? "FACTURE" : "DEVIS"
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(128, 0, 128) // Couleur violet
  doc.text(documentTitle, margin, y)

  // Numéro et dates
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100) // Gris
  doc.text(`N° ${data.documentNumber || `${documentTitle}-0001`}`, margin, y + 7)
  doc.text(`Date d'émission: ${formatDate(data.issueDate)}`, margin, y + 12)

  if (data.documentType === "invoice") {
    doc.text(`Date d'échéance: ${formatDate(data.dueDate)}`, margin, y + 17)
  }

  // Informations de l'émetteur
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(128, 0, 128) // Violet
  const rightColumnX = 140
  doc.text(data.sender.name, rightColumnX, y)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(0, 0, 0) // Noir
  const senderAddressLines = data.sender.address.split("\n")
  let addressY = y + 5

  senderAddressLines.forEach((line) => {
    doc.text(line, rightColumnX, addressY)
    addressY += 5
  })

  if (data.sender.siret) {
    doc.text(`SIRET: ${data.sender.siret}`, rightColumnX, addressY)
    addressY += 5
  }

  if (data.sender.email) {
    doc.text(data.sender.email, rightColumnX, addressY)
    addressY += 5
  }

  if (data.sender.phone) {
    doc.text(data.sender.phone, rightColumnX, addressY)
  }

  // Avancer le curseur Y
  y += 35

  // Informations du client
  doc.setFillColor(245, 240, 255) // Violet très pâle
  doc.roundedRect(margin, y, doc.internal.pageSize.width - margin * 2, 30, 5, 5, "F")
  doc.setDrawColor(128, 0, 128) // Violet
  doc.setLineWidth(0.5)
  doc.line(margin, y, margin + 4, y) // Petit accent de couleur

  doc.setTextColor(128, 0, 128) // Violet
  doc.setFont("helvetica", "bold")
  doc.text("Client", margin + 7, y + 7)

  doc.setTextColor(0, 0, 0) // Noir
  doc.setFont("helvetica", "normal")
  doc.text(data.client.name, margin + 7, y + 14)

  if (data.client.reference) {
    doc.text(`Réf: ${data.client.reference}`, margin + 7, y + 19)
  }

  const clientAddressLines = data.client.address.split("\n")
  let clientAddressY = y + 24

  clientAddressLines.forEach((line) => {
    doc.text(line, margin + 7, clientAddressY)
    clientAddressY += 5
  })

  if (data.client.email) {
    doc.text(data.client.email, margin + 7, clientAddressY)
    clientAddressY += 5
  }

  if (data.client.phone) {
    doc.text(data.client.phone, margin + 7, clientAddressY)
  }

  // Avancer le curseur Y
  y += 40

  // Tableau des prestations avec couleurs alternées
  const tableColumn = ["Description", "Qté", "Prix unitaire", "TVA", "Total HT"]
  const tableRows = data.items.map((item) => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.unitPrice),
    `${item.taxRate}%`,
    formatCurrency(item.totalHT),
  ])

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: y,
    margin: { left: margin, right: margin },
    styles: { overflow: "linebreak" },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 15, halign: "right" },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 20, halign: "right" },
      4: { cellWidth: 30, halign: "right" },
    },
 
  
    // Couleurs alternées pour les lignes
    bodyStyles: { fillColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 240, 255] },
  })
  
  
  // Récupérer la position Y après le tableau
  y = (doc as any).lastAutoTable.finalY + 10

  // Calcul des totaux
  const totalHT = data.items.reduce((sum, item) => sum + (Number.parseFloat(item.totalHT.toString()) || 0), 0)
  const totalTVA = data.items.reduce(
    (sum, item) =>
      sum +
      ((Number.parseFloat(item.totalHT.toString()) || 0) * (Number.parseFloat(item.taxRate.toString()) || 0)) / 100,
    0,
  )
  const totalTTC = totalHT + totalTVA

  // Afficher les totaux avec style
  const totalsX = doc.internal.pageSize.width - margin - 60
  doc.setFillColor(255, 255, 255) // Blanc
  doc.roundedRect(totalsX - 5, y - 5, 70, !data.isExemptFromTax ? 35 : 25, 5, 5, "F")
  doc.setDrawColor(245, 240, 255) // Violet très pâle
  doc.setLineWidth(0.5)
  doc.rect(totalsX - 5, y - 5, 70, !data.isExemptFromTax ? 35 : 25)

  doc.setTextColor(100, 100, 100) // Gris
  doc.text("Total HT:", totalsX, y)
  doc.text(formatCurrency(totalHT), doc.internal.pageSize.width - margin - 10, y, { align: "right" })

  if (!data.isExemptFromTax) {
    doc.text("Total TVA:", totalsX, y + 7)
    doc.text(formatCurrency(totalTVA), doc.internal.pageSize.width - margin - 10, y + 7, { align: "right" })
    y += 7
  }

  doc.setTextColor(128, 0, 128) // Violet
  doc.setFont("helvetica", "bold")
  doc.text("Total TTC:", totalsX, y + 7)
  doc.text(formatCurrency(totalTTC), doc.internal.pageSize.width - margin - 10, y + 7, { align: "right" })

  if (data.isExemptFromTax) {
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 100) // Gris
    doc.text("TVA non applicable - Article 293B du CGI", totalsX, y + 15)
  }

  // Avancer le curseur Y
  y += 25

  // Conditions de paiement
  if (data.paymentTerms) {
    doc.setFillColor(245, 240, 255) // Violet très pâle
    doc.roundedRect(margin, y - 5, doc.internal.pageSize.width - margin * 2, 20, 5, 5, "F")

    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(128, 0, 128) // Violet
    doc.text("Conditions de paiement", margin + 5, y + 3)

    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0) // Noir
    doc.text(data.paymentTerms, margin + 5, y + 10)

    y += 25
  }

  // Notes et mentions légales
  if (data.notes) {
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100) // Gris
    doc.text(data.notes, margin, doc.internal.pageSize.height - 15)
  }

  // Télécharger le PDF
  const fileName = `${data.documentType === "invoice" ? "Facture" : "Devis"}_${data.documentNumber || "1"}.pdf`
  doc.save(fileName)
}

// Template 2 - Design Teal & Emerald
async function generateTemplate2PDF(data: InvoiceData): Promise<void> {
  const doc = new jsPDF()
  const margin = 15
  let y = margin

  // En-tête avec bande colorée
  doc.setFillColor(0, 128, 128) // Teal
  doc.rect(0, 0, doc.internal.pageSize.width, 30, "F")

  // Titre du document
  const documentTitle = data.documentType === "invoice" ? "FACTURE" : "DEVIS"
  doc.setTextColor(255, 255, 255) // Blanc
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text(documentTitle, margin, 20)
  doc.setFontSize(10)
  doc.text(`N° ${data.documentNumber || `${documentTitle}-0001`}`, margin, 26)

  // Ajouter le logo s'il existe
  if (data.logo) {
    try {
      const img = new Image()
      img.src = data.logo
      // Fond blanc pour le logo
      doc.setFillColor(255, 255, 255)
      doc.roundedRect(doc.internal.pageSize.width - margin - 45, 5, 45, 25, 5, 5, "F")
      doc.addImage(img, "JPEG", doc.internal.pageSize.width - margin - 40, 7, 35, 20)
    } catch (e) {
      console.error("Erreur lors de l'ajout du logo", e)
    }
  }

  // Réinitialiser la couleur du texte
  doc.setTextColor(0, 0, 0) // Noir

  // Avancer le curseur Y après l'en-tête
  y = 40

  // Informations émetteur et client
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 128, 128) // Teal
  doc.text("DE", margin, y)
  doc.text("À", 110, y)

  // Cartes légèrement inclinées
  // Simuler une card inclinée pour l'émetteur
  doc.setFillColor(245, 255, 250) // Couleur très légère
  doc.roundedRect(margin - 5, y + 5, 90, 50, 5, 5, "F")
  doc.setDrawColor(0, 128, 128) // Teal
  doc.setLineWidth(0.5)
  doc.roundedRect(margin - 5, y + 5, 90, 50, 5, 5, "S")

  // Simuler une card inclinée pour le client
  doc.setFillColor(245, 255, 250) // Couleur très légère
  doc.roundedRect(110 - 5, y + 5, 90, 50, 5, 5, "F")
  doc.setDrawColor(0, 128, 128) // Teal
  doc.setLineWidth(0.5)
  doc.roundedRect(110 - 5, y + 5, 90, 50, 5, 5, "S")

  // Réinitialiser la couleur du texte
  doc.setTextColor(0, 0, 0) // Noir
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)

  // Informations de l'émetteur
  y += 15
  doc.setFont("helvetica", "bold")
  doc.text(data.sender.name, margin, y)
  doc.setFont("helvetica", "normal")

  const senderAddressLines = data.sender.address.split("\n")
  y += 5
  senderAddressLines.forEach((line) => {
    doc.text(line, margin, y)
    y += 5
  })

  if (data.sender.siret) {
    doc.text(`SIRET: ${data.sender.siret}`, margin, y)
    y += 5
  }

  if (data.sender.email) {
    doc.text(data.sender.email, margin, y)
    y += 5
  }

  if (data.sender.phone) {
    doc.text(data.sender.phone, margin, y)
  }

  // Informations du client
  y = 55
  doc.setFont("helvetica", "bold")
  doc.text(data.client.name, 110, y)
  doc.setFont("helvetica", "normal")

  if (data.client.reference) {
    y += 5
    doc.text(`Réf: ${data.client.reference}`, 110, y)
  }

  const clientAddressLines = data.client.address.split("\n")
  y += 5
  clientAddressLines.forEach((line) => {
    doc.text(line, 110, y)
    y += 5
  })

  if (data.client.email) {
    doc.text(data.client.email, 110, y)
    y += 5
  }

  if (data.client.phone) {
    doc.text(data.client.phone, 110, y)
  }

  // Dates avec icônes (simulées)
  y = 100
  doc.setFillColor(240, 255, 240) // Vert très pâle
  doc.roundedRect(margin, y, 80, 15, 5, 5, "F")

  // Simuler une icône de calendrier
  doc.setFillColor(0, 128, 128) // Teal
  doc.roundedRect(margin + 5, y + 3, 8, 8, 2, 2, "F")

  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 128, 128) // Teal
  doc.text("Date d'émission:", margin + 18, y + 8)
  doc.setTextColor(0, 0, 0) // Noir
  doc.setFont("helvetica", "normal")
  doc.text(formatDate(data.issueDate), margin + 60, y + 8)

  if (data.documentType === "invoice") {
    doc.setFillColor(240, 255, 240) // Vert très pâle
    doc.roundedRect(margin + 90, y, 80, 15, 5, 5, "F")

    // Simuler une icône d'horloge
    doc.setFillColor(16, 150, 72) // Emerald
    doc.roundedRect(margin + 95, y + 3, 8, 8, 2, 2, "F")

    doc.setFont("helvetica", "bold")
    doc.setTextColor(16, 150, 72) // Emerald
    doc.text("Date d'échéance:", margin + 108, y + 8)
    doc.setTextColor(0, 0, 0) // Noir
    doc.setFont("helvetica", "normal")
    doc.text(formatDate(data.dueDate), margin + 150, y + 8)
  }

  // Tableau des prestations
  y += 25
  const tableColumn = ["Description", "Qté", "Prix unitaire", "TVA", "Total HT"]
  const tableRows = data.items.map((item) => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.unitPrice),
    `${item.taxRate}%`,
    formatCurrency(item.totalHT),
  ])

  // En-tête du tableau
  doc.setFillColor(0, 128, 128) // Teal
  doc.rect(margin, y, doc.internal.pageSize.width - margin * 2, 10, "F")
  doc.setTextColor(255, 255, 255) // Blanc
  doc.setFont("helvetica", "bold")
  doc.text("Détails des prestations", margin + 5, y + 7)

  y += 10

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: y,
    margin: { left: margin, right: margin },
    styles: { overflow: "linebreak" },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 15, halign: "right" },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 20, halign: "right" },
      4: { cellWidth: 30, halign: "right" },
    },
  
  
    // Couleurs alternées pour les lignes
    bodyStyles: { fillColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 255, 245] },
  })

  // Récupérer la position Y après le tableau
  y = (doc as any).lastAutoTable.finalY + 10

  // Calcul des totaux
  const totalHT = data.items.reduce((sum, item) => sum + (Number.parseFloat(item.totalHT.toString()) || 0), 0)
  const totalTVA = data.items.reduce(
    (sum, item) =>
      sum +
      ((Number.parseFloat(item.totalHT.toString()) || 0) * (Number.parseFloat(item.taxRate.toString()) || 0)) / 100,
    0,
  )
  const totalTTC = totalHT + totalTVA

  // Afficher les totaux avec style moderne
  const totalsX = doc.internal.pageSize.width - margin - 60
  doc.setFillColor(245, 255, 250) // Couleur très légère
  doc.roundedRect(totalsX - 10, y, 80, !data.isExemptFromTax ? 35 : 30, 5, 5, "F")

  doc.setTextColor(100, 100, 100) // Gris
  doc.text("Total HT:", totalsX, y + 7)
  doc.text(formatCurrency(totalHT), doc.internal.pageSize.width - margin - 10, y + 7, { align: "right" })

  if (!data.isExemptFromTax) {
    doc.text("Total TVA:", totalsX, y + 15)
    doc.text(formatCurrency(totalTVA), doc.internal.pageSize.width - margin - 10, y + 15, { align: "right" })
    y += 8
  }

  // Rectangle de couleur pour le total TTC
  doc.setFillColor(0, 128, 128) // Teal
  doc.roundedRect(totalsX - 10, y + 10, 80, 15, 5, 5, "F")

  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 255, 255) // Blanc
  doc.text("Total TTC:", totalsX, y + 20)
  doc.text(formatCurrency(totalTTC), doc.internal.pageSize.width - margin - 10, y + 20, { align: "right" })

  if (data.isExemptFromTax) {
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 100) // Gris
    doc.text("TVA non applicable - Article 293B du CGI", totalsX - 10, y + 30)
  }

  // Conditions de paiement
  if (data.paymentTerms) {
    y += 35
    doc.setFillColor(240, 255, 240) // Vert très pâle
    doc.roundedRect(margin, y, doc.internal.pageSize.width - margin * 2, 25, 5, 5, "F")

    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 128, 128) // Teal
    doc.text("Conditions de paiement", margin + 5, y + 8)
    doc.setTextColor(0, 0, 0) // Noir
    doc.setFont("helvetica", "normal")
    doc.text(data.paymentTerms, margin + 5, y + 18)
  }

  // Notes et mentions légales
  if (data.notes) {
    doc.setFontSize(8)
    doc.text(data.notes, margin, doc.internal.pageSize.height - 15)
  }

  // Télécharger le PDF
  const fileName = `${data.documentType === "invoice" ? "Facture" : "Devis"}_${data.documentNumber || "1"}.pdf`
  doc.save(fileName)
}

// Template 3 - Design Ambre & Orange
async function generateTemplate3PDF(data: InvoiceData): Promise<void> {
  const doc = new jsPDF()
  const margin = 15
  let y = margin

  // En-tête avec design moderne
  doc.setFillColor(255, 191, 0) // Amber
  doc.rect(0, 0, doc.internal.pageSize.width, 25, "F")

  // Dégradé simulé
  doc.setFillColor(255, 69, 0, 0.5) // Orange avec transparence
  doc.rect(doc.internal.pageSize.width / 2, 0, doc.internal.pageSize.width / 2, 25, "F")

  // Ajouter le logo s'il existe
  if (data.logo) {
    try {
      const img = new Image()
      img.src = data.logo
      // Fond blanc pour le logo
      doc.setFillColor(255, 255, 255)
      doc.roundedRect(margin, 30, 40, 25, 5, 5, "F")
      doc.addImage(img, "JPEG", margin + 2, 32, 35, 20)
      y += 30
    } catch (e) {
      console.error("Erreur lors de l'ajout du logo", e)
    }
  }

  // Titre du document
  y = 60
  const documentTitle = data.documentType === "invoice" ? "FACTURE" : "DEVIS"
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 140, 0) // Orange
  doc.text(documentTitle, margin, y)

  // Numéro et dates
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100) // Gris
  doc.text(`N° ${data.documentNumber || `${documentTitle}-0001`}`, margin, y + 7)

  // Informations de l'émetteur
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 140, 0) // Orange
  const rightColumnX = 140
  doc.text(data.sender.name, rightColumnX, y - 25)

  // Arrière-plan pour les coordonnées de l'émetteur
  doc.setFillColor(255, 248, 225) // Amber très pâle
  doc.roundedRect(rightColumnX - 5, y - 30, 70, 40, 5, 5, "F")
  doc.setDrawColor(255, 191, 0) // Amber
  doc.setLineWidth(1)
  doc.line(rightColumnX - 5, y - 30, rightColumnX - 1, y - 30) // Petit accent de couleur

  doc.setFont("helvetica", "normal")
  doc.setTextColor(0, 0, 0) // Noir
  const senderAddressLines = data.sender.address.split("\n")
  let addressY = y - 20

  senderAddressLines.forEach((line) => {
    doc.text(line, rightColumnX, addressY)
    addressY += 5
  })

  if (data.sender.siret) {
    doc.text(`SIRET: ${data.sender.siret}`, rightColumnX, addressY)
    addressY += 5
  }

  if (data.sender.email) {
    doc.text(data.sender.email, rightColumnX, addressY)
    addressY += 5
  }

  if (data.sender.phone) {
    doc.text(data.sender.phone, rightColumnX, addressY)
  }

  // Client et dates
  y += 20

  // Créer deux colonnes pour le client et les dates
  doc.setFillColor(248, 248, 248) // Gris très pâle
  doc.roundedRect(margin, y, 90, 50, 5, 5, "F")

  doc.setTextColor(255, 140, 0) // Orange
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Client", margin + 5, y + 8)

  doc.setTextColor(0, 0, 0) // Noir
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(data.client.name, margin + 5, y + 15)

  if (data.client.reference) {
    doc.text(`Réf: ${data.client.reference}`, margin + 5, y + 20)
  }

  const clientAddressLines = data.client.address.split("\n")
  let clientY = y + 25

  clientAddressLines.forEach((line) => {
    doc.text(line, margin + 5, clientY)
    clientY += 5
  })

  if (data.client.email) {
    doc.text(data.client.email, margin + 5, clientY)
    clientY += 5
  }

  if (data.client.phone) {
    doc.text(data.client.phone, margin + 5, clientY)
  }

  // Dates dans des cadres séparés
  const datesX = margin + 100

  doc.setFillColor(255, 248, 225) // Amber très pâle
  doc.roundedRect(datesX, y, 80, 20, 5, 5, "F")

  doc.setTextColor(255, 140, 0) // Orange
  doc.setFont("helvetica", "bold")
  doc.text("Date d'émission", datesX + 5, y + 7)

  doc.setTextColor(0, 0, 0) // Noir
  doc.setFont("helvetica", "normal")
  doc.text(formatDate(data.issueDate), datesX + 5, y + 15)

  if (data.documentType === "invoice") {
    doc.setFillColor(255, 243, 224) // Orange très pâle
    doc.roundedRect(datesX, y + 25, 80, 20, 5, 5, "F")

    doc.setTextColor(255, 87, 34) // Deep Orange
    doc.setFont("helvetica", "bold")
    doc.text("Date d'échéance", datesX + 5, y + 32)

    doc.setTextColor(0, 0, 0) // Noir
    doc.setFont("helvetica", "normal")
    doc.text(formatDate(data.dueDate), datesX + 5, y + 40)
  }

  // Avancer le curseur Y
  y += 60

  // Titre pour les prestations
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 140, 0) // Orange
  doc.text("Détails des prestations", margin, y)

  y += 10

  // Tableau des prestations
  const tableColumn = ["Description", "Qté", "Prix unitaire", "TVA", "Total HT"]
  const tableRows = data.items.map((item) => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.unitPrice),
    `${item.taxRate}%`,
    formatCurrency(item.totalHT),
  ])

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: y,
    margin: { left: margin, right: margin },
    styles: { overflow: "linebreak" },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 15, halign: "right" },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 20, halign: "right" },
      4: { cellWidth: 30, halign: "right" },
    },
 
  
    // Couleurs alternées pour les lignes
    bodyStyles: { fillColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [255, 248, 225] }, // Amber très pâle
  })

  // Récupérer la position Y après le tableau
  y = (doc as any).lastAutoTable.finalY + 10

  // Calcul des totaux
  const totalHT = data.items.reduce((sum, item) => sum + (Number.parseFloat(item.totalHT.toString()) || 0), 0)
  const totalTVA = data.items.reduce(
    (sum, item) =>
      sum +
      ((Number.parseFloat(item.totalHT.toString()) || 0) * (Number.parseFloat(item.taxRate.toString()) || 0)) / 100,
    0,
  )
  const totalTTC = totalHT + totalTVA

  // Afficher les totaux
  const totalsX = doc.internal.pageSize.width - margin - 60

  doc.setFillColor(248, 248, 248) // Gris très pâle
  doc.roundedRect(totalsX - 5, y, 70, !data.isExemptFromTax ? 30 : 20, 5, 5, "F")

  doc.setTextColor(100, 100, 100) // Gris
  doc.text("Total HT:", totalsX, y + 7)
  doc.text(formatCurrency(totalHT), doc.internal.pageSize.width - margin - 10, y + 7, { align: "right" })

  if (!data.isExemptFromTax) {
    doc.text("Total TVA:", totalsX, y + 15)
    doc.text(formatCurrency(totalTVA), doc.internal.pageSize.width - margin - 10, y + 15, { align: "right" })
    y += 8
  }

  // Fond coloré pour le total TTC
  doc.setFillColor(255, 140, 0) // Orange
  doc.roundedRect(totalsX - 5, y + 10, 70, 15, 5, 5, "F")

  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 255, 255) // Blanc
  doc.text("Total TTC:", totalsX, y + 20)
  doc.text(formatCurrency(totalTTC), doc.internal.pageSize.width - margin - 10, y + 20, { align: "right" })

  if (data.isExemptFromTax) {
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 100) // Gris
    doc.text("TVA non applicable - Article 293B du CGI", totalsX - 5, y + 30)
  }

  // Conditions de paiement
  if (data.paymentTerms) {
    y += 35
    doc.setFillColor(255, 248, 225) // Amber très pâle
    doc.roundedRect(margin, y, doc.internal.pageSize.width - margin * 2, 25, 5, 5, "F")

    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(255, 140, 0) // Orange
    doc.text("Conditions de paiement", margin + 5, y + 8)
    doc.setTextColor(0, 0, 0) // Noir
    doc.setFont("helvetica", "normal")
    doc.text(data.paymentTerms, margin + 5, y + 18)
  }

  // Notes et mentions légales
  if (data.notes) {
    doc.setFontSize(8)
    doc.text(data.notes, margin, doc.internal.pageSize.height - 15)
  }

  // Télécharger le PDF
  const fileName = `${data.documentType === "invoice" ? "Facture" : "Devis"}_${data.documentNumber || "1"}.pdf`
  doc.save(fileName)
}

// Template 4 - Design Sombre (Indigo & Bleu)
async function generateTemplate4PDF(data: InvoiceData): Promise<void> {
  const doc = new jsPDF()
  const margin = 15
  let y = margin

  // Fond sombre pour tout le document (simulé avec un rectangle)
  doc.setFillColor(25, 25, 112, 0.95) // Indigo foncé
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F")

  // Ajouter le logo s'il existe
  if (data.logo) {
    try {
      const img = new Image()
      img.src = data.logo
      // Fond blanc pour le logo
      doc.setFillColor(255, 255, 255)
      doc.roundedRect(margin, y, 40, 25, 5, 5, "F")
      doc.addImage(img, "JPEG", margin + 2, y + 2, 35, 20)
      y += 30
    } catch (e) {
      console.error("Erreur lors de l'ajout du logo", e)
    }
  }

  // Titre du document
  const documentTitle = data.documentType === "invoice" ? "FACTURE" : "DEVIS"
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(135, 206, 250) // Light blue
  doc.text(documentTitle, margin, y)

  // Numéro et dates
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(200, 200, 255) // Light indigo

  // Badges pour numéro et dates
  doc.setFillColor(25, 25, 150) // Indigo un peu plus clair
  doc.roundedRect(margin, y + 5, 50, 14, 7, 7, "F")
  doc.text(`N° ${data.documentNumber || `${documentTitle}-0001`}`, margin + 5, y + 14)

  doc.roundedRect(margin + 55, y + 5, 50, 14, 7, 7, "F")
  doc.text(`Émis le ${formatDate(data.issueDate)}`, margin + 60, y + 14)

  if (data.documentType === "invoice") {
    doc.roundedRect(margin + 110, y + 5, 60, 14, 7, 7, "F")
    doc.text(`Échéance ${formatDate(data.dueDate)}`, margin + 115, y + 14)
  }

  // Avancer le curseur Y
  y += 30

  // Informations émetteur et client
  const colWidth = (doc.internal.pageSize.width - 2 * margin - 10) / 2

  // Cadre émetteur
  doc.setFillColor(25, 25, 150) // Indigo un peu plus clair
  doc.roundedRect(margin, y, colWidth, 60, 5, 5, "F")

  // Titre émetteur
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(135, 206, 250) // Light blue
  doc.text("ÉMETTEUR", margin + 5, y + 8)

  // Contenu émetteur
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 255, 255) // Blanc
  doc.text(data.sender.name, margin + 5, y + 18)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(200, 200, 255) // Light indigo
  const senderAddressLines = data.sender.address.split("\n")
  let addressY = y + 25

  senderAddressLines.forEach((line) => {
    doc.text(line, margin + 5, addressY)
    addressY += 5
  })

  if (data.sender.siret) {
    doc.text(`SIRET: ${data.sender.siret}`, margin + 5, addressY)
    addressY += 5
  }

  if (data.sender.email) {
    doc.text(data.sender.email, margin + 5, addressY)
    addressY += 5
  }

  if (data.sender.phone) {
    doc.text(data.sender.phone, margin + 5, addressY)
  }

  // Cadre client
  doc.setFillColor(25, 25, 150) // Indigo un peu plus clair
  doc.roundedRect(margin + colWidth + 10, y, colWidth, 60, 5, 5, "F")

  // Titre client
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(135, 206, 250) // Light blue
  doc.text("CLIENT", margin + colWidth + 15, y + 8)

  // Contenu client
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 255, 255) // Blanc
  doc.text(data.client.name, margin + colWidth + 15, y + 18)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(200, 200, 255) // Light indigo
  if (data.client.reference) {
    doc.text(`Réf: ${data.client.reference}`, margin + colWidth + 15, y + 25)
  }

  const clientAddressLines = data.client.address.split("\n")
  let clientY = y + 30

  clientAddressLines.forEach((line) => {
    doc.text(line, margin + colWidth + 15, clientY)
    clientY += 5
  })

  if (data.client.email) {
    doc.text(data.client.email, margin + colWidth + 15, clientY)
    clientY += 5
  }

  if (data.client.phone) {
    doc.text(data.client.phone, margin + colWidth + 15, clientY)
  }

  // Avancer le curseur Y
  y += 70

  // Tableau des prestations
  // Titre
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(135, 206, 250) // Light blue
  doc.text("DÉTAILS DES PRESTATIONS", margin, y)

  y += 5

  // Tableau
  const tableColumn = ["Description", "Qté", "Prix unitaire", "TVA", "Total HT"]
  const tableRows = data.items.map((item) => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.unitPrice),
    `${item.taxRate}%`,
    formatCurrency(item.totalHT),
  ])
 
  
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: y,
    margin: { left: margin, right: margin },
    styles: {
      overflow: "linebreak",
      textColor: [200, 200, 255],
      fillColor: [25, 25, 150],
    },
    headStyles: {
      fillColor: [65, 105, 225], // Royal blue
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 15, halign: "right" },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 20, halign: "right" },
      4: { cellWidth: 30, halign: "right", textColor: [135, 206, 250] },
    },
    // Couleurs alternées pour les lignes
    bodyStyles: { fillColor: [25, 25, 150] },
    alternateRowStyles: { fillColor: [25, 25, 170] },
  })

  // Récupérer la position Y après le tableau
  y = (doc as any).lastAutoTable.finalY + 10

  // Calcul des totaux
  const totalHT = data.items.reduce((sum, item) => sum + (Number.parseFloat(item.totalHT.toString()) || 0), 0)
  const totalTVA = data.items.reduce(
    (sum, item) =>
      sum +
      ((Number.parseFloat(item.totalHT.toString()) || 0) * (Number.parseFloat(item.taxRate.toString()) || 0)) / 100,
    0,
  )
  const totalTTC = totalHT + totalTVA

  // Afficher les totaux
  const totalsX = doc.internal.pageSize.width - margin - 60

  doc.setFillColor(25, 25, 150) // Indigo un peu plus clair
  doc.roundedRect(totalsX - 5, y, 70, !data.isExemptFromTax ? 30 : 20, 5, 5, "F")

  doc.setTextColor(200, 200, 255) // Light indigo
  doc.text("Total HT:", totalsX, y + 7)
  doc.text(formatCurrency(totalHT), doc.internal.pageSize.width - margin - 10, y + 7, { align: "right" })

  if (!data.isExemptFromTax) {
    doc.text("Total TVA:", totalsX, y + 15)
    doc.text(formatCurrency(totalTVA), doc.internal.pageSize.width - margin - 10, y + 15, { align: "right" })
    y += 8
  }

  // Bande de dégradé pour le total TTC (simulé)
  doc.setFillColor(65, 105, 225) // Royal blue
  doc.roundedRect(totalsX - 5, y + 10, 70, 15, 5, 5, "F")

  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 255, 255) // Blanc
  doc.text("Total TTC:", totalsX, y + 20)
  doc.text(formatCurrency(totalTTC), doc.internal.pageSize.width - margin - 10, y + 20, { align: "right" })

  if (data.isExemptFromTax) {
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(200, 200, 255) // Light indigo
    doc.text("TVA non applicable - Article 293B du CGI", totalsX - 5, y + 30)
  }

  // Conditions de paiement
  if (data.paymentTerms) {
    y += 35
    doc.setFillColor(25, 25, 150) // Indigo un peu plus clair
    doc.roundedRect(margin, y, doc.internal.pageSize.width - margin * 2, 25, 5, 5, "F")

    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(135, 206, 250) // Light blue
    doc.text("Conditions de paiement", margin + 5, y + 8)
    doc.setTextColor(255, 255, 255) // Blanc
    doc.setFont("helvetica", "normal")
    doc.text(data.paymentTerms, margin + 5, y + 18)
  }

  // Notes et mentions légales
  if (data.notes) {
    doc.setFontSize(8)
    doc.setTextColor(200, 200, 255) // Light indigo
    doc.text(data.notes, margin, doc.internal.pageSize.height - 15)
  }

  // Télécharger le PDF
  const fileName = `${data.documentType === "invoice" ? "Facture" : "Devis"}_${data.documentNumber || "1"}.pdf`
  doc.save(fileName)
}
