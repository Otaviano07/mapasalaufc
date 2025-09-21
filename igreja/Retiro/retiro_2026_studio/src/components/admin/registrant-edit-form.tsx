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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Nome completo deve ter pelo menos 2 caracteres." }),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 caracteres." }),
  churchId: z.string().min(1, { message: "Selecione uma igreja." }),
  paymentStatus: z.enum(["paid", "pending"]), // Assuming these are the only two statuses
});

interface RegistrantEditFormProps {
  registrant: any;
  onSave: (data: z.infer<typeof formSchema>) => void;
  churches: any[];
}

export default function RegistrantEditForm({ registrant, onSave, churches }: RegistrantEditFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: registrant.fullName,
      phone: registrant.phone,
      churchId: registrant.churchId,
      paymentStatus: registrant.paymentStatus,
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
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="Telefone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="churchId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Igreja</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma igreja" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {churches.map((church) => (
                    <SelectItem key={church.id} value={church.id}>
                      {church.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentStatus"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Status do Pagamento</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="paid" />
                    </FormControl>
                    <FormLabel className="font-normal">Pago</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="pending" />
                    </FormControl>
                    <FormLabel className="font-normal">Pendente</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Salvar Alterações</Button>
      </form>
    </Form>
  );
}
