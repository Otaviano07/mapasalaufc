'use client';

import { useState, useEffect } from 'react';
import RegistrationsTable from '@/components/admin/registrations-table';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function RegistrationsPage() {
  const [registrants, setRegistrants] = useState([]);

  useEffect(() => {
    async function fetchRegistrants() {
      const registrantsCollection = collection(db, 'registrants');
      const registrantsSnapshot = await getDocs(registrantsCollection);
      const registrantsData = registrantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegistrants(registrantsData);
    }

    fetchRegistrants();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inscrições</h1>
      <RegistrationsTable registrants={registrants} />
    </div>
  );
}