
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

const ClienteList: React.FC = () => {
  const { clientes, excluirCliente, investimentos } = useAppContext();

  const calcularValoresConsolidados = (clienteId: string) => {
    const investimentosCliente = investimentos.filter(inv => inv.clienteId === clienteId);
    const valorAplicado = investimentosCliente.reduce((total, inv) => total + inv.valorAporte, 0);
    const patrimonioProjetado = investimentosCliente.reduce((total, inv) => {
      const rendimentoLiquido = inv.calculo?.rendimentoLiquido || 0;
      return total + inv.valorAporte + rendimentoLiquido;
    }, 0);
    
    return { valorAplicado, patrimonioProjetado };
  };

  if (clientes.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Nenhum cliente cadastrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Clientes Cadastrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Plano Contratado</TableHead>
                <TableHead>Vigência</TableHead>
                <TableHead>Início do Plano</TableHead>
                <TableHead>Contribuição</TableHead>
                <TableHead>Valor Aplicado</TableHead>
                <TableHead>Patrimônio Projetado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((cliente) => {
                const { valorAplicado, patrimonioProjetado } = calcularValoresConsolidados(cliente.id);
                return (
                  <TableRow key={cliente.id} className="whitespace-nowrap">
                    <TableCell className="font-medium whitespace-nowrap">{cliente.nome}</TableCell>
                    <TableCell className="whitespace-nowrap">{cliente.planoContratado}</TableCell>
                    <TableCell className="whitespace-nowrap">{cliente.vigenciaPlano}</TableCell>
                    <TableCell className="whitespace-nowrap">{cliente.inicioPlano ?? '-'}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatCurrency(cliente.contribuicao)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatCurrency(valorAplicado)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatCurrency(patrimonioProjetado)}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => excluirCliente(cliente.id)}
                      >
                        <Trash2 size={16} />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClienteList;
