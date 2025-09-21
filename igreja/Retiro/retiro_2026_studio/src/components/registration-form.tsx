'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, Controller, FormProvider } from 'react-hook-form';
import { format, parse, differenceInYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CalendarIcon,
  Church,
  User,
  Phone,
  Loader2,
  PartyPopper,
  AlertTriangle,
  Bed,
  BedDouble,
  CookingPot,
  CreditCard,
  Hash,
  Trash2,
  PlusCircle,
  Users
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SuccessMessage from './registration/success-message';
import FeeSummary from './registration/fee-summary';
import RegistrantForm from './registration/registrant-form';

import { MultiRegistrationSchema, type MultiRegistrationData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CHILD_EXEMPTION_AGE, REGISTRATION_FEE, JUNIOR_REGISTRATION_FEE, JUNIOR_AGE_START, JUNIOR_AGE_END, PRE_REGISTRATION_FEE } from '@/lib/data';
import { supabase } from '@/lib/supabaseClient';
import { submitRegistration } from '@/app/actions';
import { useEffect, useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFeeCalculation } from '@/hooks/use-fee-calculation';




const initialState = {
  message: '',
  success: false,
};

const days = [
  { id: "2024-11-15", label: "Sexta-feira (15/11)" },
  { id: "2024-11-16", label: "Sábado (16/11)" },
  { id: "2024-11-17", label: "Domingo (17/11)" },
];

const defaultRegistrant = {
    fullName: '',
    phone: '',
    selectedDays: [],
};


export default function RegistrationForm() {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState(initialState);

  const { toast } = useToast();
  const [selectedChurchSpots, setSelectedChurchSpots] = useState<number | null>(null);
  const [churches, setChurches] = useState<any[]>([]); // State to store fetched churches

  const form = useForm<MultiRegistrationData>({
    resolver: zodResolver(MultiRegistrationSchema),
    defaultValues: {
      registrants: [defaultRegistrant],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "registrants",
  });

  const churchId = form.watch('churchId');
  const registrants = form.watch('registrants');
  const { totalFee, totalPreFee } = useFeeCalculation(registrants);

  // Fetch churches on component mount
  useEffect(() => {
    async function fetchChurches() {
      const { data, error } = await supabase.from('churches').select('*');
      if (error) {
        console.error('Error fetching churches:', error);
      } else {
        setChurches(data);
      }
    }
    fetchChurches();
  }, []);

  useEffect(() => {
    if (churchId && churches.length > 0) { // Ensure churches are loaded
      const church = churches.find(c => c.id === churchId);
      setSelectedChurchSpots(church ? church.spots : null);
    } else {
      setSelectedChurchSpots(null);
    }
  }, [churchId, churches]); // Add churches to dependency array

  useEffect(() => {
    if (!formState.success && formState.message) {
      toast({
        variant: 'destructive',
        title: 'Erro na Inscrição',
        description: formState.message,
      });
    }
  }, [formState, toast]);

  const onSubmit = (data: MultiRegistrationData) => {
    const formData = new FormData();
    formData.append('churchId', data.churchId);
    
    data.registrants.forEach((registrant, index) => {
      Object.entries(registrant).forEach(([key, value]) => {
        const fieldName = `registrants[${index}].${key}`;
        if (value) {
          if (value instanceof Date) {
            formData.append(fieldName, value.toISOString());
          } else if (Array.isArray(value)) {
            formData.append(fieldName, value.join(','));
          } else {
            formData.append(fieldName, value as string);
          }
        }
      });
    });

    startTransition(async () => {
      const result = await submitRegistration(initialState, formData);
      setFormState(result);
    });
  };

  if (formState.success) {
    return <SuccessMessage />;
  }

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="churchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Igreja</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                          <div className="relative">
                          <Church className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <SelectTrigger className="pl-9">
                            <SelectValue placeholder="Selecione sua igreja" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent>
                        {churches.map(church => (
                            <SelectItem key={church.id} value={church.id} disabled={church.spots === 0}>
                            {church.name} ({church.spots > 0 ? `${church.spots} vagas` : 'Esgotado'})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedChurchSpots !== null && selectedChurchSpots === 0 && (
                 <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Vagas Esgotadas</AlertTitle>
                  <AlertDescription>
                    Infelizmente, não há mais vagas disponíveis para esta igreja. Por favor, entre em contato com o ancião ou diretor da sua igreja para mais informações.
                  </AlertDescription>
                </Alert>
              )}

              {selectedChurchSpots !== null && selectedChurchSpots > 0 && (
                <div className="space-y-4 animate-in fade-in-0 zoom-in-95">
                  <Separator />
                   <div className="flex justify-between items-center">
                     <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary"/>
                        Inscritos
                     </h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append(defaultRegistrant)}
                        disabled={fields.length >= selectedChurchSpots}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar
                      </Button>
                   </div>


                   <Accordion type="multiple" defaultValue={['item-0']} className="w-full">
                     {fields.map((item, index) => {
                       const birthDate = form.watch(`registrants.${index}.birthDate`);
                       const sleepAtRetreat = form.watch(`registrants.${index}.sleepAtRetreat`);
                       const daysCount = form.watch(`registrants.${index}.daysCount`);
                       const selectedDays = form.watch(`registrants.${index}.selectedDays`) || [];

                       return (
                         <AccordionItem value={`item-${index}`} key={item.id} className="border bg-card rounded-md mb-2 px-4">
                           <div className="flex items-center pr-2">
                             <AccordionTrigger className="flex-grow">
                               <span>Inscrito #{index + 1}: {form.watch(`registrants.${index}.fullName`) || 'Novo Inscrito'}</span>
                             </AccordionTrigger>
                             {fields.length > 1 && (
                               <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => remove(index)}>
                                 <Trash2 className="h-4 w-4" />
                               </Button>
                             )}
                           </div>
                           <AccordionContent>
                             <RegistrantForm index={index} />
                           </AccordionContent>
                         </AccordionItem>
                       )
                     })}
                   </Accordion>

                   {selectedChurchSpots > 0 && fields.length >= selectedChurchSpots && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Limite de Vagas Atingido</AlertTitle>
                        <AlertDescription>
                            Você adicionou o número máximo de inscritos para as vagas disponíveis nesta igreja ({selectedChurchSpots}).
                        </AlertDescription>
                    </Alert>
                   )}
                </div>
              )}

            {selectedChurchSpots !== null && selectedChurchSpots > 0 && (
              <FeeSummary
                totalFee={totalFee}
                totalPreFee={totalPreFee}
                isPending={isPending}
                registrantsCount={fields.length}
              />
            )}
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}