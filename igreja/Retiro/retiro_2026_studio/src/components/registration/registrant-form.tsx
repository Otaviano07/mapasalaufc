'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CalendarIcon,
  User,
  Phone,
  Bed,
  BedDouble,
  CookingPot,
  CreditCard,
  Hash,
} from 'lucide-react';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { cn } from '@/lib/utils';

const days = [
  { id: "2024-11-15", label: "Sexta-feira (15/11)" },
  { id: "2024-11-16", label: "Sábado (16/11)" },
  { id: "2024-11-17", label: "Domingo (17/11)" },
];

interface RegistrantFormProps {
  index: number;
}

export default function RegistrantForm({ index }: RegistrantFormProps) {
  const { control, watch, setValue } = useFormContext();

  const birthDate = watch(`registrants.${index}.birthDate`);
  const sleepAtRetreat = watch(`registrants.${index}.sleepAtRetreat`);
  const daysCount = watch(`registrants.${index}.daysCount`);
  const selectedDays = watch(`registrants.${index}.selectedDays`) || [];

  return (
    <div className="space-y-6 pt-4">
      <FormField
        control={control}
        name={`registrants.${index}.fullName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Nome completo do inscrito" {...field} className="pl-9" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          control={control}
          name={`registrants.${index}.birthDate`}
          render={({ field, fieldState }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Nascimento</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="DD/MM/AAAA"
                        className="pl-9"
                        value={
                          field.value
                            ? field.value instanceof Date
                              ? format(field.value, 'dd/MM/yyyy')
                              : field.value
                            : ''
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value);
                          if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                            try {
                              const newDate = parse(value, 'dd/MM/yyyy', new Date());
                              if (!(field.value instanceof Date) || newDate.getTime() !== field.value.getTime()) {
                                setValue(`registrants.${index}.birthDate`, newDate, { shouldValidate: true });
                              }
                            } catch (err) {
                              // let zod handle
                            }
                          }
                        }}
                      />
                    </FormControl>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value instanceof Date ? field.value : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setValue(`registrants.${index}.birthDate`, date, { shouldValidate: true });
                      }
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1930-01-01')
                    }
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`registrants.${index}.phone`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone / WhatsApp</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="tel" placeholder="(21) 99999-9999" {...field} className="pl-9" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      <FormField
        control={control}
        name={`registrants.${index}.sleepAtRetreat`}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Dorme no Retiro?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex gap-4"
              >
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="sim" id={`sleep-yes-${index}`} />
                  </FormControl>
                  <FormLabel htmlFor={`sleep-yes-${index}`} className="font-normal cursor-pointer">Sim</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="nao" id={`sleep-no-${index}`} />
                  </FormControl>
                  <FormLabel htmlFor={`sleep-no-${index}`} className="font-normal cursor-pointer">Não</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {sleepAtRetreat === 'sim' && (
        <div className="animate-in fade-in-0 zoom-in-95 pl-2 border-l-2 ml-1">
          <FormField
            control={control}
            name={`registrants.${index}.accommodationType`}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Tipo de Acomodação</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col md:flex-row gap-4"
                  >
                    <FormItem className="flex-1">
                      <FormControl>
                        <RadioGroupItem value="individual" id={`acomodacao-individual-${index}`} className="sr-only" />
                      </FormControl>
                      <FormLabel htmlFor={`acomodacao-individual-${index}`} className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", field.value === 'individual' && 'border-primary')}>
                        <Bed className="mb-3 h-6 w-6" />
                        Individual
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex-1">
                      <FormControl>
                        <RadioGroupItem value="casal" id={`acomodacao-casal-${index}`} className="sr-only" />
                      </FormControl>
                      <FormLabel htmlFor={`acomodacao-casal-${index}`} className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", field.value === 'casal' && 'border-primary')}>
                        <BedDouble className="mb-3 h-6 w-6" />
                        Casal
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {sleepAtRetreat === 'nao' && (
        <div className="space-y-4 animate-in fade-in-0 zoom-in-95 pl-2 border-l-2 ml-1">
          <FormField
            control={control}
            name={`registrants.${index}.daysCount`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantos dias irá participar?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <SelectTrigger className="pl-9">
                        <SelectValue placeholder="Selecione o número de dias" />
                      </SelectTrigger>
                    </div>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1 dia</SelectItem>
                    <SelectItem value="2">2 dias</SelectItem>
                    <SelectItem value="3">3 dias</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {daysCount && (
            <FormField
              control={control}
              name={`registrants.${index}.selectedDays`}
              render={({ field: dayField }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Selecione os dias</FormLabel>
                    <FormDescription>
                      Você pode selecionar até {daysCount} dia(s).
                    </FormDescription>
                  </div>
                  {days.map((dayItem) => {
                    const isDisabled = selectedDays.length >= parseInt(daysCount, 10) && !dayField.value?.includes(dayItem.id);
                    return (
                      <FormItem
                        key={dayItem.id}
                        className={cn("flex flex-row items-start space-x-3 space-y-0 p-2 rounded-md border border-transparent hover:border-border", isDisabled && "text-muted-foreground")}
                      >
                        <FormControl>
                          <Checkbox
                            checked={dayField.value?.includes(dayItem.id)}
                            disabled={isDisabled}
                            onCheckedChange={(checked) => {
                              const currentDays = dayField.value || [];
                              return checked
                                ? dayField.onChange([...currentDays, dayItem.id])
                                : dayField.onChange(
                                  currentDays?.filter(
                                    (value) => value !== dayItem.id
                                  )
                                )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {dayItem.label}
                        </FormLabel>
                      </FormItem>
                    );
                  })}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      )}

      <Separator />

      <FormField
        control={control}
        name={`registrants.${index}.foodIntolerance`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Intolerância Alimentar</FormLabel>
            <FormControl>
              <div className="relative">
                <CookingPot className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  placeholder="Ex: intolerância a lactose, glúten, etc."
                  {...field}
                  className="pl-9"
                />
              </div>
            </FormControl>
            <FormDescription>
              Se não possuir, deixe este campo em branco.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <Separator />

      <FormField
        control={control}
        name={`registrants.${index}.paymentMethod`}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Forma de Pagamento da Pré-Inscrição</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col md:flex-row gap-4"
              >
                <FormItem className="flex-1">
                  <FormControl>
                    <RadioGroupItem value="pix" id={`payment-pix-${index}`} className="sr-only" />
                  </FormControl>
                  <FormLabel htmlFor={`payment-pix-${index}`} className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", field.value === 'pix' && 'border-primary')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3 h-6 w-6"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m16.5 7.5-9 9"/><path d="m16.5 16.5-9-9"/></svg>
                    Pix
                  </FormLabel>
                </FormItem>
                <FormItem className="flex-1">
                  <FormControl>
                    <RadioGroupItem value="cartao" id={`payment-card-${index}`} className="sr-only" />
                  </FormControl>
                  <FormLabel htmlFor={`payment-card-${index}`} className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", field.value === 'cartao' && 'border-primary')}>
                    <CreditCard className="mb-3 h-6 w-6" />
                    Cartão de Crédito
                  </FormLabel>
                </FormItem>
                <FormItem className="flex-1">
                  <FormControl>
                    <RadioGroupItem value="dinheiro" id={`payment-money-${index}`} className="sr-only" />
                  </FormControl>
                  <FormLabel htmlFor={`payment-money-${index}`} className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", field.value === 'dinheiro' && 'border-primary')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3 h-6 w-6"><rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>
                    Dinheiro
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
