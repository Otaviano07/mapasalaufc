import { z } from 'zod';
import { parse } from 'date-fns';

const dateSchema = z.union([
  z.date(),
  z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Formato de data inválido. Use DD/MM/AAAA.").transform((str, ctx) => {
    try {
      const date = parse(str, 'dd/MM/yyyy', new Date());
      // Check if parsed date is valid
      if (isNaN(date.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Data inválida.",
        });
        return z.NEVER;
      }
      return date;
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data inválida.",
      });
      return z.NEVER;
    }
  }),
], {
  required_error: "A data de nascimento é obrigatória.",
  invalid_type_error: "Data inválida.",
});

export const RegistrationSchema = z.object({
  fullName: z.string().min(3, { message: 'O nome completo é obrigatório.' }),
  birthDate: dateSchema,
  phone: z.string().min(10, { message: 'Por favor, insira um telefone válido com DDD.' }),
  
  sleepAtRetreat: z.string().optional(),
  accommodationType: z.string().optional(),
  
  daysCount: z.string().optional(),
  selectedDays: z.array(z.string()).optional(),

  foodIntolerance: z.string().optional(),
  paymentMethod: z.string().optional(),

}).superRefine((data, ctx) => {
  if (!data.sleepAtRetreat) {
    ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe se dormirá no retiro.',
        path: ['sleepAtRetreat'],
    });
  }
  if (data.sleepAtRetreat === 'sim' && !data.accommodationType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'O tipo de acomodação é obrigatório para quem dorme no retiro.',
      path: ['accommodationType'],
    });
  }
  
  if (data.sleepAtRetreat === 'nao') {
    if (!data.daysCount) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Informe quantos dias participará.',
            path: ['daysCount'],
        });
    }
    if (!data.selectedDays || data.selectedDays.length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Selecione os dias de participação.',
            path: ['selectedDays'],
        });
    } else if (data.daysCount && data.selectedDays.length > parseInt(data.daysCount, 10)) {
       ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Você só pode selecionar ${data.daysCount} dia(s).`,
            path: ['selectedDays'],
        });
    }
  }

  if(!data.paymentMethod) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Selecione a forma de pagamento.',
      path: ['paymentMethod'],
    });
  }
});

export type RegistrationData = z.infer<typeof RegistrationSchema>;

export const MultiRegistrationSchema = z.object({
    churchId: z.string({ required_error: 'Selecione uma igreja.' }),
    registrants: z.array(RegistrationSchema).min(1, { message: 'É necessário pelo menos um inscrito.' }),
});

export type MultiRegistrationData = z.infer<typeof MultiRegistrationSchema>;
