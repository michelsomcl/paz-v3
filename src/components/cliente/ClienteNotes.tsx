
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface ClienteNotesProps {
  clienteNome: string;
}

const ClienteNotes: React.FC<ClienteNotesProps> = ({ clienteNome }) => {
  const [notes, setNotes] = useState('');
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 text-blue-500 border-blue-200 hover:bg-blue-50"
        >
          <Pencil size={16} />
          <span className="sr-only">Anotações</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Anotações - {clienteNome}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Digite suas anotações aqui..."
            className="min-h-[200px]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClienteNotes;
