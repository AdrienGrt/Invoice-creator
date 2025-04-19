import { formatCurrency, formatDate } from "@/lib/utils"
import type { InvoiceData } from "@/types"

interface Template1PreviewProps {
  data: InvoiceData
}

export function Template1Preview({ data }: Template1PreviewProps) {
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
    <div className="relative p-6 bg-gradient-to-br from-purple-50 to-white text-black shadow-md overflow-auto max-h-[800px] text-sm">
      {/* Formes décoratives */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-bl-full opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-tr-full opacity-10"></div>

      {/* En-tête */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          {data.logo && <img src={data.logo || "/placeholder.svg"} alt="Logo" className="max-h-16 max-w-32 mb-4" />}
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            {documentTitle}
          </h1>
          <p className="text-sm text-gray-600">N° {data.documentNumber || `${documentTitle}-0001`}</p>
          <p className="text-sm text-gray-600">Date d'émission: {formatDate(data.issueDate)}</p>
          {data.documentType === "invoice" && (
            <p className="text-sm text-gray-600">Date d'échéance: {formatDate(data.dueDate)}</p>
          )}
        </div>

        <div className="text-right">
          <div className="font-bold text-purple-700">{data.sender.name}</div>
          <div className="text-sm whitespace-pre-line">{data.sender.address}</div>
          {data.sender.siret && <div className="text-sm">SIRET: {data.sender.siret}</div>}
          {data.sender.email && <div className="text-sm">{data.sender.email}</div>}
          {data.sender.phone && <div className="text-sm">{data.sender.phone}</div>}
        </div>
      </div>

      {/* Informations client */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border-l-4 border-purple-500">
        <h2 className="font-bold mb-2 text-purple-700">Client</h2>
        <div className="font-medium">{data.client.name}</div>
        {data.client.reference && <div className="text-sm">Réf: {data.client.reference}</div>}
        <div className="text-sm whitespace-pre-line">{data.client.address}</div>
        {data.client.email && <div className="text-sm">{data.client.email}</div>}
        {data.client.phone && <div className="text-sm">{data.client.phone}</div>}
      </div>

      {/* Tableau des prestations */}
      <div className="mb-8 overflow-hidden rounded-lg shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
              <th className="text-left py-3 px-4 font-semibold">Description</th>
              <th className="text-right py-3 px-4 font-semibold">Qté</th>
              <th className="text-right py-3 px-4 font-semibold">Prix unitaire</th>
              <th className="text-right py-3 px-4 font-semibold">TVA</th>
              <th className="text-right py-3 px-4 font-semibold">Total HT</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.items.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-purple-50" : "bg-white"}>
                <td className="py-3 px-4 text-left">{item.description}</td>
                <td className="py-3 px-4 text-right">{item.quantity}</td>
                <td className="py-3 px-4 text-right">{formatCurrency(item.unitPrice)}</td>
                <td className="py-3 px-4 text-right">{item.taxRate}%</td>
                <td className="py-3 px-4 text-right">{formatCurrency(item.totalHT)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totaux */}
      <div className="flex justify-end mb-8">
        <div className="w-64 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Total HT:</span>
            <span className="font-medium">{formatCurrency(totalHT)}</span>
          </div>
          {!data.isExemptFromTax && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Total TVA:</span>
              <span className="font-medium">{formatCurrency(totalTVA)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 mt-1 border-t border-purple-200">
            <span className="font-bold text-purple-700">Total TTC:</span>
            <span className="font-bold text-purple-700">{formatCurrency(totalTTC)}</span>
          </div>
          {data.isExemptFromTax && (
            <div className="text-xs text-gray-600 mt-1">TVA non applicable - Article 293B du CGI</div>
          )}
        </div>
      </div>

      {/* Conditions de paiement */}
      {data.paymentTerms && (
        <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-purple-700 mb-1">Conditions de paiement</h3>
          <p className="text-sm">{data.paymentTerms}</p>
        </div>
      )}

      {/* Notes */}
      {data.notes && <div className="text-xs text-gray-600 border-t border-purple-100 pt-4 mt-4">{data.notes}</div>}
    </div>
  )
}
