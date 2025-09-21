'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import ChurchForm from './church-form';
import { Trash2 } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ChurchesTable({ churches: initialChurches }: { churches: any[] }) {
  const [churches, setChurches] = useState(initialChurches);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedChurch, setSelectedChurch] = useState<any | null>(null);

  const handleAddClick = () => {
    setSelectedChurch(null);
    setIsEditDialogOpen(true);
  };

  const handleEditClick = (church: any) => {
    setSelectedChurch(church);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (church: any) => {
    setSelectedChurch(church);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedChurch) {
        // Update existing church
        const churchRef = doc(db, 'churches', selectedChurch.id);
        await updateDoc(churchRef, data);
        setChurches(churches.map(c => c.id === selectedChurch.id ? { ...c, ...data } : c));
      } else {
        // Add new church
        const churchesCollection = collection(db, 'churches');
        const docRef = await addDoc(churchesCollection, data);
        setChurches([...churches, { id: docRef.id, ...data }]);
      }
      setIsEditDialogOpen(false);
      setSelectedChurch(null);
    } catch (error) {
      console.error('Failed to save church:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedChurch) {
      const churchRef = doc(db, 'churches', selectedChurch.id);
      try {
        await deleteDoc(churchRef);
        setChurches(churches.filter(c => c.id !== selectedChurch.id));
        setIsDeleteDialogOpen(false);
        setSelectedChurch(null);
      } catch (error) {
        console.error('Failed to delete church:', error);
      }
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddClick}>Adicionar Igreja</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Vagas</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {churches.map((church) => (
            <TableRow key={church.id}><TableCell>{church.id}</TableCell><TableCell>{church.name}</TableCell><TableCell>{church.spots}</TableCell><TableCell className="flex gap-2"><Button variant="outline" size="sm" onClick={() => handleEditClick(church)}>Editar</Button><Button variant="destructive" size="sm" onClick={() => handleDeleteClick(church)}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedChurch && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedChurch ? 'Editar Igreja' : 'Adicionar Nova Igreja'}</DialogTitle>
            </DialogHeader>
            <ChurchForm church={selectedChurch} onSave={handleSave} />
          </DialogContent>
        </Dialog>
      )}

      {selectedChurch && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
            </DialogHeader>
            <p>Tem certeza que deseja excluir a igreja <strong>{selectedChurch.name}</strong>?</p>
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