'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Church, DollarSign, Clock } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminDashboard() {
  const [registrantsCount, setRegistrantsCount] = useState(0);
  const [paidRegistrantsCount, setPaidRegistrantsCount] = useState(0);
  const [pendingRegistrantsCount, setPendingRegistrantsCount] = useState(0);
  const [churchesCount, setChurchesCount] = useState(0);
  const [registrationsPerChurch, setRegistrationsPerChurch] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const registrantsCollection = collection(db, 'registrants');
      const registrantsSnapshot = await getDocs(registrantsCollection);
      const registrants = registrantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setRegistrantsCount(registrants.length);
      setPaidRegistrantsCount(registrants.filter((r: any) => r.paymentStatus === 'paid').length);
      setPendingRegistrantsCount(registrants.filter((r: any) => r.paymentStatus === 'pending').length);

      const churchesCollection = collection(db, 'churches');
      const churchesSnapshot = await getDocs(churchesCollection);
      const churches = churchesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setChurchesCount(churches.length);

      const registrationsByChurch = churches.map((church: any) => ({
        name: church.name,
        registrations: registrants.filter((r: any) => r.churchId === church.id).length,
      }));
      setRegistrationsPerChurch(registrationsByChurch);
    }

    fetchData();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Inscritos
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{registrantsCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Inscritos Pagos
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{paidRegistrantsCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Inscritos Pendentes
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingRegistrantsCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Igrejas
          </CardTitle>
          <Church className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{churchesCount}</div>
        </CardContent>
      </Card>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Inscrições por Igreja</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={registrationsPerChurch}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="registrations" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
