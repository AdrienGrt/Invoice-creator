import { formatCurrency, formatDate } from "@/lib/utils"
import type { InvoiceData } from "@/types"

interface Template3PreviewProps {
  data: InvoiceData
}

export function Template3Preview({ data }: Template3PreviewProps) {
  const totalHT = data.items.reduce((sum, item) => sum + (Number.parseFloat(item.totalHT.toString()) || 0), 0)
  const totalTVA = data.items.reduce(
    (sum, item) =>
      sum +
      ((Number.parseFloat(item.totalHT.toString()) || 0) * (Number.parseFloat(item.taxRate.toString()) || 0)) / 100,
    0,
  )
  const totalTTC = totalHT + totalTVA

  const documentTitle = data.documentType === "invoice" ? "FACTURE" : "DEVIS"

  return (
    <div className="p-6 bg-white text-black shadow-md overflow-auto max-h-[800px] text-sm">
      {/* En-tête avec design moderne */}
      <div className="relative mb-12">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-lg"></div>
        <div className="relative pt-28 px-6">
          <div className="flex justify-between items-start">
            <div>
              {data.logo && (
                <div className="absolute top-4 left-6 bg-white p-2 rounded-lg shadow-lg">
                  <img src={data.logo || "/placeholder.svg"} alt="Logo" className="max-h-16 max-w-32" />
                </div>
              )}
              <h1 className="text-3xl font-extrabold tracking-tight">{documentTitle}</h1>
              <p className="text-sm text-gray-600">N° {data.documentNumber || `${documentTitle}-0001`}</p>
            </div>
            <div className="text-right">
              <div className="inline-block bg-amber-50 px-4 py-2 rounded-lg border-l-4 border-amber-500">
                <div className="font-bold text-amber-800">{data.sender.name}</div>
                <div className="text-sm whitespace-pre-line">{data.sender.address}</div>
                {data.sender.siret && <div className="text-sm">SIRET: {data.sender.siret}</div>}
                {data.sender.email && <div className="text-sm">{data.sender.email}</div>}
                {data.sender.phone && <div className="text-sm">{data.sender.phone}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informations client et dates */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <h2 className="text-lg font-bold text-amber-600 mb-3">Client</h2>
          <div className="font-bold">{data.client.name}</div>
          {data.client.reference && <div className="text-sm">Réf: {data.client.reference}</div>}
          <div className="text-sm whitespace-pre-line">{data.client.address}</div>
          {data.client.email && <div className="text-sm">{data.client.email}</div>}
          {data.client.phone && <div className="text-sm">{data.client.phone}</div>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <div className="text-xs uppercase tracking-wider text-amber-600 mb-1">Date d'émission</div>
            <div className="font-bold text-amber-800">{formatDate(data.issueDate)}</div>
          </div>

          {data.documentType === "invoice" && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <div className="text-xs uppercase tracking-wider text-orange-600 mb-1">Date d'échéance</div>
              <div className="font-bold text-orange-800">{formatDate(data.dueDate)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Tableau des prestations */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-amber-600 mb-3">Détails des prestations</h2>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 bg-amber-50 font-semibold text-amber-800 border-b border-amber-200">
                  Description
                </th>
                <th className="text-right py-3 px-4 bg-amber-50 font-semibold text-amber-800 border-b border-amber-200">
                  Qté
                </th>
                <th className="text-right py-3 px-4 bg-amber-50 font-semibold text-amber-800 border-b border-amber-200">
                  Prix unitaire
                </th>
                <th className="text-right py-3 px-4 bg-amber-50 font-semibold text-amber-800 border-b border-amber-200">
                  TVA
                </th>
                <th className="text-right py-3 px-4 bg-amber-50 font-semibold text-amber-800 border-b border-amber-200">
                  Total HT
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="py-3 px-4 text-left border-b border-gray-100">{item.description}</td>
                  <td className="py-3 px-4 text-right border-b border-gray-100">{item.quantity}</td>
                  <td className="py-3 px-4 text-right border-b border-gray-100">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-3 px-4 text-right border-b border-gray-100">{item.taxRate}%</td>
                  <td className="py-3 px-4 text-right border-b border-gray-100 font-medium">
                    {formatCurrency(item.totalHT)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totaux */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 px-4 bg-gray-50 rounded-t-lg">
            <span className="text-gray-600">Total HT:</span>
            <span className="font-medium">{formatCurrency(totalHT)}</span>
          </div>
          {!data.isExemptFromTax && (
            <div className="flex justify-between py-2 px-4 bg-gray-100">
              <span className="text-gray-600">Total TVA:</span>
              <span className="font-medium">{formatCurrency(totalTVA)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-b-lg">
            <span className="font-bold">Total TTC:</span>
            <span className="font-bold">{formatCurrency(totalTTC)}</span>
          </div>
          {data.isExemptFromTax && (
            <div className="text-xs text-gray-600 mt-2 px-4">TVA non applicable - Article 293B du CGI</div>
          )}
        </div>
      </div>

      {/* Conditions de paiement */}
      {data.paymentTerms && (
        <div className="mb-6 bg-amber-50 p-5 rounded-lg border border-amber-100">
          <h3 className="font-bold text-amber-800 mb-2">Conditions de paiement</h3>
          <p className="text-sm">{data.paymentTerms}</p>
        </div>
      )}

      {/* Notes */}
      {data.notes && <div className="text-xs text-gray-600 border-t border-gray-200 pt-4 mt-4">{data.notes}</div>}
    </div>
  )
}
