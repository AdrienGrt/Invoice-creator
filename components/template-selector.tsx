"use client"

import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Template1Preview } from "@/components/templates/template-1"
import { Template2Preview } from "@/components/templates/template-2"
import { Template3Preview } from "@/components/templates/template-3"
import { Template4Preview } from "@/components/templates/template-4"
import type { InvoiceData } from "@/types"

interface TemplateSelectorProps {
  invoiceData: InvoiceData
  selectedTemplate: string
  onSelectTemplate: (template: string) => void
}

export function TemplateSelector({ invoiceData, selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="space-y-6">
      <p className="text-center text-muted-foreground mb-8">
        Choisissez le design qui convient le mieux à votre activité. Le contenu sera automatiquement appliqué.
      </p>

      <RadioGroup
        value={selectedTemplate}
        onValueChange={onSelectTemplate}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="template1" id="template1" />
            <Label htmlFor="template1" className="font-medium">
              Template Classique
            </Label>
          </div>
          <Card
            className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
            onClick={() => onSelectTemplate("template1")}
          >
            <CardContent className="p-2">
              <div className="border rounded-md overflow-hidden" style={{ height: "400px", overflow: "hidden" }}>
                <Template1Preview data={invoiceData} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="template2" id="template2" />
            <Label htmlFor="template2" className="font-medium">
              Template Moderne
            </Label>
          </div>
          <Card
            className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
            onClick={() => onSelectTemplate("template2")}
          >
            <CardContent className="p-2">
              <div className="border rounded-md overflow-hidden" style={{ height: "400px", overflow: "hidden" }}>
                <Template2Preview data={invoiceData} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="template3" id="template3" />
            <Label htmlFor="template3" className="font-medium">
              Template Élégant
            </Label>
          </div>
          <Card
            className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
            onClick={() => onSelectTemplate("template3")}
          >
            <CardContent className="p-2">
              <div className="border rounded-md overflow-hidden" style={{ height: "400px", overflow: "hidden" }}>
                <Template3Preview data={invoiceData} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="template4" id="template4" />
            <Label htmlFor="template4" className="font-medium">
              Template Personnalisé
            </Label>
          </div>
          <Card
            className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
            onClick={() => onSelectTemplate("template4")}
          >
            <CardContent className="p-2">
              <div className="border rounded-md overflow-hidden" style={{ height: "400px", overflow: "hidden" }}>
                <Template4Preview data={invoiceData} />
              </div>
            </CardContent>
          </Card>
        </div>
      </RadioGroup>
    </div>
  )
}
