import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Sobre Nós</h1>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Nossa História</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                A TechMart nasceu da paixão por tecnologia e do desejo de oferecer os melhores produtos 
                tecnológicos com qualidade, confiança e excelência no atendimento.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Desde nossa fundação, nos dedicamos a selecionar cuidadosamente cada produto, garantindo 
                que nossos clientes tenham acesso às últimas inovações tecnológicas com os melhores preços 
                do mercado.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Nossa Missão</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Democratizar o acesso à tecnologia de ponta, oferecendo produtos de alta qualidade 
                com preços justos, entrega rápida e suporte especializado para todos os nossos clientes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Nossos Valores</h2>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• <strong>Qualidade:</strong> Selecionamos apenas os melhores produtos</li>
                <li>• <strong>Confiança:</strong> Transparência e honestidade em todas as relações</li>
                <li>• <strong>Inovação:</strong> Sempre em busca das últimas tecnologias</li>
                <li>• <strong>Atendimento:</strong> Suporte especializado e dedicado</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

