'use server';

import { MultiRegistrationData } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export async function submitRegistration(prevState: any, formData: FormData) {
  try {
    const churchId = formData.get('churchId') as string;

    const registrantsData: any[] = [];
    const registrantsMap = new Map<number, any>();

    for (const [key, value] of formData.entries()) {
      const match = key.match(/registrants\[(\d+)\]\.(.*)/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2];
        if (!registrantsMap.has(index)) {
          registrantsMap.set(index, {});
        }
        registrantsMap.get(index)[field] = value;
      }
    }

    Array.from(registrantsMap.values()).forEach(registrant => {
      registrantsData.push({
        ...registrant,
        churchId: churchId,
        paymentStatus: 'pending', // Default status for new registrations
      });
    });

    const { data, error } = await supabase
      .from('registrants')
      .insert(registrantsData)
      .select();

    if (error) {
      console.error('Error inserting registrants:', error);
      return { success: false, message: 'Erro ao processar a inscrição. Tente novamente.' };
    }

    console.log('Registration data submitted to Supabase:', data);
    return { success: true, message: 'Inscrição realizada com sucesso!' };

  } catch (error) {
    console.error('Unexpected error submitting registration:', error);
    return { success: false, message: 'Ocorreu um erro inesperado. Tente novamente.' };
  }
}