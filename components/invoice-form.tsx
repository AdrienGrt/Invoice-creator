"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Trash, Plus, Upload, FileText, User, ListChecks, Settings } from "lucide-react"
import type { InvoiceData, InvoiceItem } from "@/types"
import { formatCurrency } from "@/lib/utils"

interface InvoiceFormProps {
  data: InvoiceData
  onChange: (data: InvoiceData) => void
  onReset: () => void
}

export function InvoiceForm({ data, onChange, onReset }: InvoiceFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const accentColor = "indigo" // Couleur d'accentuation choisie

  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...data.items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Recalculate total for this item
    if (field === "quantity" || field === "unitPrice" || field === "taxRate") {
      const item = newItems[index]
      const quantity = Number.parseFloat(item.quantity.toString()) || 0
      const unitPrice = Number.parseFloat(item.unitPrice.toString()) || 0
      const taxRate = Number.parseFloat(item.taxRate.toString()) || 0

      item.totalHT = quantity * unitPrice
      item.totalTTC = item.totalHT * (1 + taxRate / 100)
    }

    onChange({ ...data, items: newItems })
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxRate: data.defaultTaxRate,
      totalHT: 0,
      totalTTC: 0,
    }
    onChange({ ...data, items: [...data.items, newItem] })
  }

  const removeItem = (index: number) => {
    const newItems = [...data.items]
    newItems.splice(index, 1)
    onChange({ ...data, items: newItems })
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        handleChange("logo", result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Calculate totals
  const totalHT = data.items.reduce((sum, item) => sum + (Number.parseFloat(item.totalHT.toString()) || 0), 0)
  const totalTVA = data.items.reduce(
    (sum, item) =>
      sum +
      ((Number.parseFloat(item.totalHT.toString()) || 0) * (Number.parseFloat(item.taxRate.toString()) || 0)) / 100,
    0,
  )
  const totalTTC = totalHT + totalTVA

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-6">
      {/* Header Card */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <CardContent className="pt-6 pb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            {data.documentType === "invoice" ? "Générateur de Factures" : "Générateur de Devis"}
          </h1>
          <p className="text-gray-300">Créez facilement vos documents professionnels</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="sender" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6 p-1 bg-gray-100 rounded-xl">
          <TabsTrigger value="sender" className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-600 rounded-lg py-3 flex items-center justify-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Émetteur</span>
          </TabsTrigger>
          <TabsTrigger value="client" className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-600 rounded-lg py-3 flex items-center justify-center gap-2">
            <User className="h-4 w-4" />
            <span>Client</span>
          </TabsTrigger>
          <TabsTrigger value="items" className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-600 rounded-lg py-3 flex items-center justify-center gap-2">
            <ListChecks className="h-4 w-4" />
            <span>Prestations</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-600 rounded-lg py-3 flex items-center justify-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Paramètres</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sender">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-gray-50 border-b border-gray-100 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                <FileText className="h-5 w-5 text-indigo-500" />
                Informations de l'émetteur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="senderName" className="text-gray-700">Nom / Société</Label>
                  <Input
                    id="senderName"
                    value={data.sender.name}
                    onChange={(e) => handleChange("sender", { ...data.sender, name: e.target.value })}
                    className="focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderSiret" className="text-gray-700">SIRET</Label>
                  <Input
                    id="senderSiret"
                    value={data.sender.siret}
                    onChange={(e) => handleChange("sender", { ...data.sender, siret: e.target.value })}
                    className="focus-visible:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senderAddress" className="text-gray-700">Adresse</Label>
                <Textarea
                  id="senderAddress"
                  value={data.sender.address}
                  onChange={(e) => handleChange("sender", { ...data.sender, address: e.target.value })}
                  rows={3}
                  className="focus-visible:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="senderEmail" className="text-gray-700">Email</Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    value={data.sender.email}
                    onChange={(e) => handleChange("sender", { ...data.sender, email: e.target.value })}
                    className="focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderPhone" className="text-gray-700">Téléphone</Label>
                  <Input
                    id="senderPhone"
                    value={data.sender.phone}
                    onChange={(e) => handleChange("sender", { ...data.sender, phone: e.target.value })}
                    className="focus-visible:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="logo" className="text-gray-700">Logo (optionnel)</Label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="w-20 h-20 relative bg-gray-100 rounded-md p-2 flex items-center justify-center">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                      <FileText className="h-8 w-8" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Label
                      htmlFor="logo-upload"
                      className="flex items-center justify-center w-full h-10 px-4 py-2 text-sm border border-gray-200 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Upload className="mr-2 h-4 w-4 text-indigo-500" />
                      Choisir un logo
                    </Label>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="client">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-gray-50 border-b border-gray-100 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                <User className="h-5 w-5 text-indigo-500" />
                Informations du client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="text-gray-700">Nom / Société</Label>
                  <Input
                    id="clientName"
                    value={data.client.name}
                    onChange={(e) => handleChange("client", { ...data.client, name: e.target.value })}
                    className="focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientReference" className="text-gray-700">Référence client</Label>
                  <Input
                    id="clientReference"
                    value={data.client.reference}
                    onChange={(e) => handleChange("client", { ...data.client, reference: e.target.value })}
                    className="focus-visible:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientAddress" className="text-gray-700">Adresse</Label>
                <Textarea
                  id="clientAddress"
                  value={data.client.address}
                  onChange={(e) => handleChange("client", { ...data.client, address: e.target.value })}
                  rows={3}
                  className="focus-visible:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientEmail" className="text-gray-700">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={data.client.email}
                    onChange={(e) => handleChange("client", { ...data.client, email: e.target.value })}
                    className="focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientPhone" className="text-gray-700">Téléphone</Label>
                  <Input
                    id="clientPhone"
                    value={data.client.phone}
                    onChange={(e) => handleChange("client", { ...data.client, phone: e.target.value })}
                    className="focus-visible:ring-indigo-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-gray-50 border-b border-gray-100 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                <ListChecks className="h-5 w-5 text-indigo-500" />
                Détails des prestations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {data.items.map((item, index) => (
                <div key={index} className="p-5 border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-800 flex items-center gap-2">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-xs font-bold">
                        #{index + 1}
                      </span>
                      Prestation
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`item-${index}-description`} className="text-gray-700">Description</Label>
                    <Textarea
                      id={`item-${index}-description`}
                      value={item.description}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                      rows={2}
                      className="focus-visible:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`item-${index}-quantity`} className="text-gray-700">Quantité</Label>
                      <Input
                        id={`item-${index}-quantity`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", Number.parseFloat(e.target.value) || 0)}
                        className="focus-visible:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`item-${index}-price`} className="text-gray-700">Prix unitaire (€)</Label>
                      <Input
                        id={`item-${index}-price`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                        className="focus-visible:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`item-${index}-tax`} className="text-gray-700">TVA (%)</Label>
                      <Input
                        id={`item-${index}-tax`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={item.taxRate}
                        onChange={(e) => handleItemChange(index, "taxRate", Number.parseFloat(e.target.value) || 0)}
                        className="focus-visible:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 bg-gray-50 p-3 rounded-md">
                    <div>
                      <Label className="text-gray-500 text-sm">Total HT</Label>
                      <div className="font-medium text-gray-800">{formatCurrency(item.totalHT)}</div>
                    </div>
                    <div>
                      <Label className="text-gray-500 text-sm">Total TTC</Label>
                      <div className="font-medium text-gray-800">{formatCurrency(item.totalTTC)}</div>
                    </div>
                  </div>
                </div>
              ))}

              <Button 
                onClick={addItem} 
                variant="outline" 
                className="w-full gap-2 border-dashed border-2 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 py-6 transition-all"
              >
                <Plus className="h-5 w-5" />
                Ajouter une prestation
              </Button>

              <div className="bg-gray-50 p-6 rounded-lg space-y-3 mt-4 shadow-sm border border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Total HT</span>
                  <span className="font-medium">{formatCurrency(totalHT)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Total TVA</span>
                  <span className="font-medium">{formatCurrency(totalTVA)}</span>
                </div>
                <div className="h-px bg-gray-200 my-2"></div>
                <div className="flex justify-between text-lg font-bold text-indigo-700">
                  <span>Total TTC</span>
                  <span>{formatCurrency(totalTTC)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-gray-50 border-b border-gray-100 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                <Settings className="h-5 w-5 text-indigo-500" />
                Paramètres du document
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="documentType" className="text-gray-700">Type de document</Label>
                  <Select value={data.documentType} onValueChange={(value) => handleChange("documentType", value)}>
                    <SelectTrigger id="documentType" className="focus-visible:ring-indigo-500">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invoice">Facture</SelectItem>
                      <SelectItem value="quote">Devis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documentNumber" className="text-gray-700">
                    Numéro de {data.documentType === "invoice" ? "facture" : "devis"}
                  </Label>
                  <Input
                    id="documentNumber"
                    value={data.documentNumber}
                    onChange={(e) => handleChange("documentNumber", e.target.value)}
                    className="focus-visible:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="issueDate" className="text-gray-700">Date d'émission</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={data.issueDate}
                    onChange={(e) => handleChange("issueDate", e.target.value)}
                    className="focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-gray-700">Date d'échéance</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={data.dueDate}
                    onChange={(e) => handleChange("dueDate", e.target.value)}
                    className="focus-visible:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms" className="text-gray-700">Conditions de paiement</Label>
                <Textarea
                  id="paymentTerms"
                  value={data.paymentTerms}
                  onChange={(e) => handleChange("paymentTerms", e.target.value)}
                  rows={2}
                  className="focus-visible:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-700">Notes / Mentions légales</Label>
                <Textarea
                  id="notes"
                  value={data.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows={3}
                  className="focus-visible:ring-indigo-500"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultTaxRate" className="text-gray-700">Taux de TVA par défaut (%)</Label>
                  <Input
                    id="defaultTaxRate"
                    type="number"
                    min="0"
                    step="0.1"
                    value={data.defaultTaxRate}
                    onChange={(e) => handleChange("defaultTaxRate", Number.parseFloat(e.target.value) || 0)}
                    className="focus-visible:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <Switch
                    id="isExemptFromTax"
                    checked={data.isExemptFromTax}
                    onCheckedChange={(checked) => handleChange("isExemptFromTax", checked)}
                    className="data-[state=checked]:bg-indigo-600"
                  />
                  <Label htmlFor="isExemptFromTax" className="font-medium text-gray-700">TVA non applicable (Art. 293B du CGI)</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={onReset} 
          className="text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  )
}