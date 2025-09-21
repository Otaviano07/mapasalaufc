'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome da igreja deve ter pelo menos 2 caracteres." }),
  spots: z.coerce.number().min(0, { message: "Vagas não podem ser negativas." }),
});

interface ChurchFormProps {
  church?: any; // Optional for adding new church
  onSave: (data: z.infer<typeof formSchema>) => void;
}

export default function ChurchForm({ church, onSave }: ChurchFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: church?.name || '',
      spots: church?.spots || 0,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    onSave(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Igreja</FormLabel>
              <FormControl>
                <Input placeholder="Nome da igreja" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="spots"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade de Vagas</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Vagas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{church ? 'Salvar Alterações' : 'Adicionar Igreja'}</Button>
      </form>
    </Form>
  );
}
