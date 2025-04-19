import { Card } from "@/components/ui/card"
import { Template1Preview } from "@/components/templates/template-1"
import type { InvoiceData } from "@/types"

interface InvoicePreviewProps {
  data: InvoiceData
}

export function InvoicePreview({ data }: InvoicePreviewProps) {
  return (
    <Card className="overflow-hidden">
      <Template1Preview data={data} />
    </Card>
  )
}
