import CalculadoraForm from "./CalculadoraForm";

export const metadata = { title: "Calculadora de Orçamento | Decorwall" };

export default function CalculadoraPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <CalculadoraForm />
    </main>
  );
}

