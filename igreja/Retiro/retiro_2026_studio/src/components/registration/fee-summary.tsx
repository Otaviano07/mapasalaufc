'use client';

import { CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FeeSummaryProps {
  totalFee: number;
  totalPreFee: number;
  isPending: boolean;
  registrantsCount: number;
}

export default function FeeSummary({ totalFee, totalPreFee, isPending, registrantsCount }: FeeSummaryProps) {
  return (
    <CardFooter className="flex-col items-stretch p-0 gap-4">
      <div className="bg-secondary p-4 rounded-lg space-y-3">
        {totalFee > 0 ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-md text-secondary-foreground">Valor Total da Pré-inscrição:</span>
              <span className="text-lg font-bold text-primary">
                {totalPreFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-md text-secondary-foreground">Valor Restante:</span>
              <span className="text-lg font-bold text-primary">
                {(totalFee - totalPreFee).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            <Separator className="my-2 bg-border" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-secondary-foreground">Valor Total:</span>
              <span className="text-2xl font-bold text-primary">
                {totalFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center pt-2">
              Para garantir sua(s) vaga(s), o pagamento da pré-inscrição deve ser realizado primeiro.
            </p>
          </>
        ) : (
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-secondary-foreground">Valor Total da Inscrição:</span>
            <span className="text-2xl font-bold text-primary">
              {totalFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              <span className="text-sm font-normal ml-2">({registrantsCount}x Isento)</span>
            </span>
          </div>
        )}
      </div>
      <Button type="submit" disabled={isPending} className="w-full text-lg py-6">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Enviando...
          </>
        ) : (
          `Finalizar Inscrição (${registrantsCount} ${registrantsCount > 1 ? 'Pessoas' : 'Pessoa'})`
        )}
      </Button>
    </CardFooter>
  );
}
