'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import RegistrantEditForm from './registrant-edit-form';
import { Trash2 } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function RegistrationsTable({ registrants: initialRegistrants }: { registrants: any[] }) {
  const [registrants, setRegistrants] = useState(initialRegistrants);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRegistrant, setSelectedRegistrant] = useState<any | null>(null);
  const [churches, setChurches] = useState<any[]>([]);

  useEffect(() => {
    setRegistrants(initialRegistrants);
  }, [initialRegistrants]);

  useEffect(() => {
    async function fetchChurches() {
      const churchesCollection = collection(db, 'churches');
      const churchesSnapshot = await getDocs(churchesCollection);
      const churchesData = churchesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChurches(churchesData);
    }
    fetchChurches();
  }, []);

  const handleEditClick = (registrant: any) => {
    setSelectedRegistrant(registrant);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (registrant: any) => {
    setSelectedRegistrant(registrant);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async (updatedData: any) => {
    if (selectedRegistrant) {
      const registrantRef = doc(db, 'registrants', selectedRegistrant.id);
      try {
        await updateDoc(registrantRef, updatedData);
        setRegistrants(registrants.map(r => r.id === selectedRegistrant.id ? { ...r, ...updatedData } : r));
        setIsEditDialogOpen(false);
        setSelectedRegistrant(null);
      } catch (error) {
        console.error('Failed to update registrant:', error);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedRegistrant) {
      const registrantRef = doc(db, 'registrants', selectedRegistrant.id);
      try {
        await deleteDoc(registrantRef);
        setRegistrants(registrants.filter(r => r.id !== selectedRegistrant.id));
        setIsDeleteDialogOpen(false);
        setSelectedRegistrant(null);
      } catch (error) {
        console.error('Failed to delete registrant:', error);
      }
    }
  };

  const getChurchName = (churchId: string) => {
    const church = churches.find(c => c.id === churchId);
    return church ? church.name : 'N/A';
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Igreja</TableHead>
            <TableHead>Status do Pagamento</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrants.map((registrant) => (
            <TableRow key={registrant.id}><TableCell>{registrant.fullName}</TableCell><TableCell>{getChurchName(registrant.churchId)}</TableCell><TableCell><Badge variant={registrant.paymentStatus === 'paid' ? 'default' : 'secondary'}>{registrant.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}</Badge></TableCell><TableCell className="flex gap-2"><Button variant="outline" size="sm" onClick={() => handleEditClick(registrant)}>Editar</Button><Button variant="destructive" size="sm" onClick={() => handleDeleteClick(registrant)}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedRegistrant && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Inscrito</DialogTitle>
            </DialogHeader>
            <RegistrantEditForm registrant={selectedRegistrant} onSave={handleSave} churches={churches} />
          </DialogContent>
        </Dialog>
      )}

      {selectedRegistrant && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
            </DialogHeader>
            <p>Tem certeza que deseja excluir o inscrito <strong>{selectedRegistrant.fullName}</strong>?</p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDeleteConfirm}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}