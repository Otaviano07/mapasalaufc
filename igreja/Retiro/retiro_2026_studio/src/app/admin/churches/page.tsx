'use client';

import { useState, useEffect } => 'react';
import ChurchesTable from '@/components/admin/churches-table';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ChurchesPage() {
  const [churches, setChurches] = useState([]);

  useEffect(() => {
    async function fetchChurches() {
      const churchesCollection = collection(db, 'churches');
      const churchesSnapshot = await getDocs(churchesCollection);
      const churchesData = churchesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChurches(churchesData);
    }

    fetchChurches();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Igrejas</h1>
      <ChurchesTable churches={churches} />
    </div>
  );
}