import { formatCurrency, formatDate } from "@/lib/utils"
import type { InvoiceData } from "@/types"

interface Template2PreviewProps {
  data: InvoiceData
}

export function Template2Preview({ data }: Template2PreviewProps) {
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
    <div className="p-6 bg-teal-50 text-black shadow-md overflow-auto max-h-[800px] text-sm">
      {/* En-tête avec bande colorée */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-6 -mx-6 -mt-6 mb-8 rounded-b-3xl shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{documentTitle}</h1>
            <p className="opacity-90">N° {data.documentNumber || `${documentTitle}-0001`}</p>
          </div>
          {data.logo && (
            <div className="bg-white p-2 rounded-lg shadow-md">
              <img src={data.logo || "/placeholder.svg"} alt="Logo" className="max-h-12 max-w-32" />
            </div>
          )}
        </div>
      </div>

      {/* Informations émetteur et client */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm space-y-1 transform -rotate-1">
          <h2 className="font-bold text-teal-600 border-b border-teal-200 pb-2 mb-2">DE</h2>
          <div className="font-bold">{data.sender.name}</div>
          <div className="whitespace-pre-line">{data.sender.address}</div>
          {data.sender.siret && <div>SIRET: {data.sender.siret}</div>}
          {data.sender.email && <div>{data.sender.email}</div>}
          {data.sender.phone && <div>{data.sender.phone}</div>}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm space-y-1 transform rotate-1">
          <h2 className="font-bold text-emerald-600 border-b border-emerald-200 pb-2 mb-2">À</h2>
          <div className="font-bold">{data.client.name}</div>
          {data.client.reference && <div>Réf: {data.client.reference}</div>}
          <div className="whitespace-pre-line">{data.client.address}</div>
          {data.client.email && <div>{data.client.email}</div>}
          {data.client.phone && <div>{data.client.phone}</div>}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
            <div className="bg-teal-500 text-white p-3 rounded-lg mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Date d'émission</span>
              <span className="font-bold text-teal-700">{formatDate(data.issueDate)}</span>
            </div>
          </div>
        </div>
        {data.documentType === "invoice" && (
          <div>
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
              <div className="bg-emerald-500 text-white p-3 rounded-lg mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Date d'échéance</span>
                <span className="font-bold text-emerald-700">{formatDate(data.dueDate)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tableau des prestations */}
      <div className="mb-8 bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
          <h2 className="font-bold">Détails des prestations</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-teal-50">
              <th className="text-left py-3 px-4 text-teal-700 font-semibold">Description</th>
              <th className="text-right py-3 px-4 text-teal-700 font-semibold">Qté</th>
              <th className="text-right py-3 px-4 text-teal-700 font-semibold">Prix unitaire</th>
              <th className="text-right py-3 px-4 text-teal-700 font-semibold">TVA</th>
              <th className="text-right py-3 px-4 text-teal-700 font-semibold">Total HT</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-teal-50"}>
                <td className="py-3 px-4 text-left">{item.description}</td>
                <td className="py-3 px-4 text-right">{item.quantity}</td>
                <td className="py-3 px-4 text-right">{formatCurrency(item.unitPrice)}</td>
                <td className="py-3 px-4 text-right">{item.taxRate}%</td>
                <td className="py-3 px-4 text-right font-medium">{formatCurrency(item.totalHT)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totaux */}
      <div className="flex justify-end mb-8">
        <div className="w-64 bg-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Total HT:</span>
            <span className="font-medium">{formatCurrency(totalHT)}</span>
          </div>
          {!data.isExemptFromTax && (
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Total TVA:</span>
              <span className="font-medium">{formatCurrency(totalTVA)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 mt-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 rounded-lg">
            <span className="font-bold">Total TTC:</span>
            <span className="font-bold">{formatCurrency(totalTTC)}</span>
          </div>
          {data.isExemptFromTax && (
            <div className="text-xs text-gray-600 mt-2 italic">TVA non applicable - Article 293B du CGI</div>
          )}
        </div>
      </div>

      {/* Conditions de paiement */}
      {data.paymentTerms && (
        <div className="mb-6 bg-white p-5 rounded-xl shadow-sm">
          <h3 className="font-bold text-teal-700 mb-2">Conditions de paiement</h3>
          <p className="text-sm">{data.paymentTerms}</p>
        </div>
      )}

      {/* Notes */}
      {data.notes && <div className="text-xs bg-white p-4 rounded-xl shadow-sm mt-4">{data.notes}</div>}
    </div>
  )
}
