
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { formatCurrency } from '@/utils/formatters';
import { formatarDescricaoTaxa } from '@/utils/calculadora';
import { toast } from '@/hooks/use-toast';
import { InvestimentoComCalculo } from '@/types';

interface InvestimentoExportProps {
  investimentos: InvestimentoComCalculo[];
  onImport?: (data: any[]) => void;
}

const InvestimentoExport: React.FC<InvestimentoExportProps> = ({ investimentos, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportarExcel = () => {
    const dados = investimentos.map(inv => ({
      'Cliente': inv.clienteNome,
      'Tipo': inv.tipoInvestimento,
      'Modalidade': inv.modalidade,
      'Valor do Aporte': inv.valorAporte,
      'Data do Aporte': inv.dataAporte,
      'Data do Vencimento': inv.dataVencimento,
      'Taxa Utilizada': formatarDescricaoTaxa(inv),
      'Dias Corridos': inv.calculo.diasCorridos,
      'Dias Úteis': inv.calculo.diasUteis,
      'Rendimento Bruto': inv.calculo.rendimentoBruto,
      'IR': inv.calculo.valorIR,
      'IOF': inv.calculo.valorIOF,
      'Rendimento Líquido': inv.calculo.rendimentoLiquido
    }));
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dados);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Investimentos');
    XLSX.writeFile(workbook, 'investimentos.xlsx');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (onImport) {
          onImport(jsonData);
        }
      } catch (error) {
        console.error('Erro ao importar arquivo:', error);
        toast({
          title: "Erro na importação",
          description: "Ocorreu um erro ao importar o arquivo. Verifique se o formato está correto.",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex gap-2">
      <Button 
        className="bg-dourado hover:bg-dourado-dark"
        onClick={exportarExcel}
      >
        <Download className="mr-2" size={16} />
        Exportar Excel
      </Button>
      
      <Button 
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mr-2" size={16} />
        Importar Excel
      </Button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".xlsx,.xls"
        className="hidden"
      />
    </div>
  );
};

export default InvestimentoExport;
