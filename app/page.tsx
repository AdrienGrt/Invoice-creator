import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"
import { FileText, Download, Clock, CreditCard, ArrowRight, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <NavBar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 pt-20 pb-32">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 space-y-6 text-center md:text-left mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Générateur de <span className="text-indigo-600 dark:text-indigo-400">Devis & Factures</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                  Créez et téléchargez rapidement des documents professionnels au format PDF, sans inscription ni
                  compte à créer.
                </p>
                <div className="pt-4">
                  <Link href="/creation">
                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <span>Créer un document</span>
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                    <div className="p-6">
                      <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <img
                          src="https://images.unsplash.com/photo-1698047681432-006d2449c631?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          alt="Aperçu du générateur"
                          className="max-h-full rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">
              Pourquoi choisir notre <span className="text-indigo-600 dark:text-indigo-400">générateur</span> ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-4 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white">Simple et rapide</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Remplissez un formulaire intuitif et obtenez instantanément votre document professionnel.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-4 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Download className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white">Téléchargement PDF</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Exportez votre document au format PDF avec un design professionnel personnalisable.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-4 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white">Sans inscription</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Aucun compte à créer, utilisez l'outil immédiatement et en toute confidentialité.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">
              Comment ça <span className="text-indigo-600 dark:text-indigo-400">fonctionne</span> ?
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="space-y-10">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                        1
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Remplissez le formulaire</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Saisissez vos informations, celles de votre client et les détails des prestations ou produits.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                        2
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Personnalisez l'apparence</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Choisissez parmi plusieurs templates professionnels et ajoutez votre logo si souhaité.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                        3
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Téléchargez votre PDF</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Prévisualisez et téléchargez instantanément votre document au format PDF prêt à être envoyé.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1698047681432-006d2449c631?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Aperçu du processus"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-12 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Prêt à créer votre document ?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                Aucune inscription requise. Vos données restent sur votre appareil et ne sont jamais envoyées à nos
                serveurs pour une confidentialité totale.
              </p>
              <Link href="/creation">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CreditCard className="mr-2 h-5 w-5" />
                  <span>Créer maintenant</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-900 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="font-medium text-gray-900 dark:text-white">
                © {new Date().getFullYear()} Générateur de Devis/Factures
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tous droits réservés
              </p>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 text-center md:text-right">
              <p>
                Cet outil est fourni à titre informatif.
              </p>
              <p className="mt-1">
                Consultez un expert-comptable pour toute question fiscale.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}