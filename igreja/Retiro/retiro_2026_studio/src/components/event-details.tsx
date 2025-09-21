import { BedDouble, CalendarDays, UtensilsCrossed, MapPin, Sun, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const details = [
  {
    icon: <CalendarDays className="h-8 w-8 text-primary" />,
    title: 'Data',
    description: '15 a 17 de Novembro de 2024',
  },
  {
    icon: <MapPin className="h-8 w-8 text-primary" />,
    title: 'Local',
    description: 'Sítio Recanto de Ouro, Itaboraí - RJ',
  },
  {
    icon: <UtensilsCrossed className="h-8 w-8 text-primary" />,
    title: 'Alimentação Inclusa',
    description: 'Café da manhã, almoço e jantar preparados com carinho.',
  },
  {
    icon: <BedDouble className="h-8 w-8 text-primary" />,
    title: 'Acomodações',
    description: 'Quartos coletivos confortáveis para uma boa noite de sono.',
  },
   {
    icon: <Sun className="h-8 w-8 text-primary" />,
    title: 'Atividades Diurnas',
    description: 'Louvor, palestras, dinâmicas em grupo e tempo livre na piscina.',
  },
  {
    icon: <Moon className="h-8 w-8 text-primary" />,
    title: 'Programação Noturna',
    description: 'Cultos, momentos de oração e fogueira com louvor.',
  },
];

export default function EventDetails() {
  return (
    <section className="w-full py-12 md:py-20 lg:py-28 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Sobre o Retiro</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Prepare-se para dias inesquecíveis de aprendizado, louvor e comunhão em um lugar cercado pela natureza.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3">
          {details.map((item) => (
            <Card key={item.title} className="flex flex-col items-center text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-primary bg-card">
              <CardHeader className="p-0">
                {item.icon}
                <CardTitle className="mt-4 mb-2 font-headline">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
