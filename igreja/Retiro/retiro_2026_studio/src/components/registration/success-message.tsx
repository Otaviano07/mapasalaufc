'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PartyPopper } from 'lucide-react';

export default function SuccessMessage() {
  return (
    <Card className="w-full shadow-2xl animate-in fade-in-50 zoom-in-95">
      <CardHeader className="text-center">
        <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full p-4 w-fit">
          <PartyPopper className="h-12 w-12 text-accent-foreground" />
        </div>
        <CardTitle className="text-2xl font-headline mt-4">Inscrição Realizada com Sucesso!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Obrigado por se inscrever! Em breve, você receberá um e-mail com mais detalhes e as formas de pagamento.
        </p>
      </CardContent>
    </Card>
  );
}
