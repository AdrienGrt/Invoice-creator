import { formatCurrency, formatDate } from "@/lib/utils"
import type { InvoiceData } from "@/types"

interface Template4PreviewProps {
  data: InvoiceData
}

export function Template4Preview({ data }: Template4PreviewProps) {
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
    <div className="p-6 bg-indigo-900 text-white shadow-md overflow-auto max-h-[800px] text-sm">
      {/* En-tête avec design moderne et sombre */}
      <div className="flex justify-between items-start mb-8">
        <div>
          {data.logo && (
            <div className="bg-white p-2 rounded-lg shadow-lg inline-block mb-4">
              <img src={data.logo || "/placeholder.svg"} alt="Logo" className="max-h-16 max-w-32" />
            </div>
          )}
          <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
            {documentTitle}
          </h1>
          <div className="flex space-x-4 mt-2">
            <div className="bg-indigo-800 px-3 py-1 rounded-full text-xs">
              N° {data.documentNumber || `${documentTitle}-0001`}
            </div>
            <div className="bg-indigo-800 px-3 py-1 rounded-full text-xs">Émis le {formatDate(data.issueDate)}</div>
            {data.documentType === "invoice" && (
              <div className="bg-indigo-800 px-3 py-1 rounded-full text-xs">Échéance {formatDate(data.dueDate)}</div>
            )}
          </div>
        </div>
      </div>

      {/* Informations émetteur et client */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-indigo-800 p-5 rounded-xl">
          <h2 className="text-xs uppercase tracking-wider text-indigo-300 mb-2">Émetteur</h2>
          <div className="font-bold text-lg text-blue-300 mb-1">{data.sender.name}</div>
          <div className="text-indigo-200 whitespace-pre-line">{data.sender.address}</div>
          {data.sender.siret && <div className="text-indigo-200 mt-1">SIRET: {data.sender.siret}</div>}
          {data.sender.email && <div className="text-indigo-200">{data.sender.email}</div>}
          {data.sender.phone && <div className="text-indigo-200">{data.sender.phone}</div>}
        </div>

        <div className="bg-indigo-800 p-5 rounded-xl">
          <h2 className="text-xs uppercase tracking-wider text-indigo-300 mb-2">Client</h2>
          <div className="font-bold text-lg text-blue-300 mb-1">{data.client.name}</div>
          {data.client.reference && <div className="text-indigo-200">Réf: {data.client.reference}</div>}
          <div className="text-indigo-200 whitespace-pre-line">{data.client.address}</div>
          {data.client.email && <div className="text-indigo-200">{data.client.email}</div>}
          {data.client.phone && <div className="text-indigo-200">{data.client.phone}</div>}
        </div>
      </div>

      {/* Tableau des prestations */}
      <div className="mb-8">
        <h2 className="text-xs uppercase tracking-wider text-indigo-300 mb-3">Détails des prestations</h2>
        <div className="bg-indigo-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-indigo-700">
                <th className="text-left py-3 px-4 font-semibold text-indigo-300">Description</th>
                <th className="text-right py-3 px-4 font-semibold text-indigo-300">Qté</th>
                <th className="text-right py-3 px-4 font-semibold text-indigo-300">Prix unitaire</th>
                <th className="text-right py-3 px-4 font-semibold text-indigo-300">TVA</th>
                <th className="text-right py-3 px-4 font-semibold text-indigo-300">Total HT</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index} className="border-b border-indigo-700/50">
                  <td className="py-3 px-4 text-left">{item.description}</td>
                  <td className="py-3 px-4 text-right">{item.quantity}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-3 px-4 text-right">{item.taxRate}%</td>
                  <td className="py-3 px-4 text-right font-medium text-blue-300">{formatCurrency(item.totalHT)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totaux */}
      <div className="flex justify-end mb-8">
        <div className="w-64 bg-indigo-800 rounded-xl overflow-hidden">
          <div className="flex justify-between py-2 px-4 border-b border-indigo-700/50">
            <span className="text-indigo-300">Total HT:</span>
            <span className="font-medium text-white">{formatCurrency(totalHT)}</span>
          </div>
          {!data.isExemptFromTax && (
            <div className="flex justify-between py-2 px-4 border-b border-indigo-700/50">
              <span className="text-indigo-300">Total TVA:</span>
              <span className="font-medium text-white">{formatCurrency(totalTVA)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500">
            <span className="font-bold">Total TTC:</span>
            <span className="font-bold">{formatCurrency(totalTTC)}</span>
          </div>
          {data.isExemptFromTax && (
            <div className="text-xs text-indigo-300 p-2">TVA non applicable - Article 293B du CGI</div>
          )}
        </div>
      </div>

      {/* Conditions de paiement */}
      {data.paymentTerms && (
        <div className="mb-6 bg-indigo-800 p-5 rounded-xl">
          <h3 className="font-bold text-blue-300 mb-2">Conditions de paiement</h3>
          <p className="text-sm text-indigo-200">{data.paymentTerms}</p>
        </div>
      )}

      {/* Notes */}
      {data.notes && <div className="text-xs text-indigo-300 border-t border-indigo-700 pt-4 mt-4">{data.notes}</div>}
    </div>
  )
}
