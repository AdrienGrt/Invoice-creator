"use client"

import { useState, useEffect } from "react"
import { InvoiceForm } from "@/components/invoice-form"
import { InvoicePreview } from "@/components/invoice-preview"
import { TemplateSelector } from "@/components/template-selector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Mail, Save, ArrowLeft, ArrowRight } from "lucide-react"
import { generatePDF } from "@/lib/pdf-generator"
import { useToast } from "@/hooks/use-toast"
import { type InvoiceData, emptyInvoiceData } from "@/types"
import { NavBar } from "@/components/nav-bar"

export default function CreationPage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(emptyInvoiceData)
  const [activeTab, setActiveTab] = useState<string>("form")
  const [step, setStep] = useState<"form" | "template">("form")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("template1")
  const { toast } = useToast()

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const savedData = localStorage.getItem("invoiceData")
    if (savedData) {
      try {
        setInvoiceData(JSON.parse(savedData))
      } catch (e) {
        console.error("Erreur lors du chargement des données sauvegardées", e)
      }
    }
  }, [])

  const handleSaveLocal = () => {
    localStorage.setItem("invoiceData", JSON.stringify(invoiceData))
    toast({
      title: "Sauvegardé localement",
      description: "Vos données ont été sauvegardées dans votre navigateur",
    })
  }

  const handleDownloadPDF = async () => {
    await generatePDF(invoiceData, selectedTemplate)
    toast({
      title: "PDF généré",
      description: "Votre document a été téléchargé",
    })
  }

  const handleSendEmail = () => {
    // Simulation d'envoi d'email
    toast({
      title: "Email simulé",
      description: "Dans une version complète, le document serait envoyé par email",
    })
  }

  const handleReset = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser le formulaire ?")) {
      setInvoiceData(emptyInvoiceData)
      localStorage.removeItem("invoiceData")
      toast({
        title: "Formulaire réinitialisé",
        description: "Toutes les données ont été effacées",
      })
    }
  }

  const handleContinue = () => {
    // Vérifier si les champs obligatoires sont remplis
    if (!invoiceData.sender.name || !invoiceData.client.name || invoiceData.items.length === 0) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir au moins les informations de base (émetteur, client et prestations)",
        variant: "destructive",
      })
      return
    }

    // Sauvegarder automatiquement
    localStorage.setItem("invoiceData", JSON.stringify(invoiceData))

    // Passer à l'étape suivante
    setStep("template")
  }

  const handleBack = () => {
    setStep("form")
  }

  return (
    <>
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            {step === "form" ? "Créer votre document" : "Choisir un template"}
          </h1>
          <p className="text-muted-foreground">
            {step === "form"
              ? "Remplissez le formulaire pour générer votre devis ou facture"
              : "Sélectionnez un design pour votre document"}
          </p>
        </div>

        {step === "form" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="form">Formulaire</TabsTrigger>
                  <TabsTrigger value="preview">Aperçu</TabsTrigger>
                </TabsList>
                <TabsContent value="form" className="lg:block">
                  <InvoiceForm data={invoiceData} onChange={setInvoiceData} onReset={handleReset} />
                </TabsContent>
                <TabsContent value="preview" className="lg:hidden">
                  <InvoicePreview data={invoiceData} />
                </TabsContent>
              </Tabs>
            </div>

            <div className="hidden lg:block sticky top-4 self-start">
              <div className="bg-muted p-4 rounded-lg mb-4">
                <h2 className="text-xl font-semibold mb-2">Aperçu en temps réel</h2>
                <InvoicePreview data={invoiceData} />
              </div>
            </div>
          </div>
        ) : (
          <TemplateSelector
            invoiceData={invoiceData}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
          />
        )}

        <div className="flex flex-wrap gap-4 justify-center mt-8">
          {step === "form" ? (
            <>
              <Button onClick={handleSaveLocal} variant="outline" className="gap-2">
                <Save className="h-4 w-4" />
                Sauvegarder localement
              </Button>
              <Button onClick={handleContinue} className="gap-2">
                Continuer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleBack} variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour au formulaire
              </Button>
              <Button onClick={handleDownloadPDF} className="gap-2">
                <Download className="h-4 w-4" />
                Télécharger en PDF
              </Button>
              <Button onClick={handleSendEmail} variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                Simuler envoi par email
              </Button>
            </>
          )}
        </div>
      </main>
    </>
  )
}
