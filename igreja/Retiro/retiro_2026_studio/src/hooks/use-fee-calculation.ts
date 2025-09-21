'use client';

import { useState, useEffect } from 'react';
import { differenceInYears, parse } from 'date-fns';
import { REGISTRATION_FEE, CHILD_EXEMPTION_AGE, JUNIOR_REGISTRATION_FEE, JUNIOR_AGE_START, JUNIOR_AGE_END, PRE_REGISTRATION_FEE } from '@/lib/data';
import type { MultiRegistrationData } from '@/lib/types';

export function useFeeCalculation(registrants: MultiRegistrationData['registrants']) {
  const [totalFee, setTotalFee] = useState(0);
  const [totalPreFee, setTotalPreFee] = useState(0);

  useEffect(() => {
    let currentTotalFee = 0;
    let currentTotalPreFee = 0;

    registrants.forEach(registrant => {
      let fee = REGISTRATION_FEE;
      let date: Date | undefined;
      const { birthDate } = registrant;

      if (birthDate instanceof Date) {
        date = birthDate;
      } else if (typeof birthDate === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
        try { date = parse(birthDate, 'dd/MM/yyyy', new Date()); } catch (e) { /* ignore */ }
      }

      if (date) {
        const age = differenceInYears(new Date(), date);
        if (age < CHILD_EXEMPTION_AGE) {
          fee = 0;
        } else if (age >= JUNIOR_AGE_START && age <= JUNIOR_AGE_END) {
          fee = JUNIOR_REGISTRATION_FEE;
        }
      }
      currentTotalFee += fee;
      if (fee > 0) {
        currentTotalPreFee += PRE_REGISTRATION_FEE;
      }
    });

    setTotalFee(currentTotalFee);
    setTotalPreFee(currentTotalPreFee);
  }, [registrants]);

  return { totalFee, totalPreFee };
}
