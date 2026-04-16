import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { api } from '../../lib/api';
import { Edit3, Trash2, Search } from 'lucide-react';
import { VerificationBadge } from '../../components/verification-badge';

export function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await api.properties.getAll();
        setProperties(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = properties.filter((p: any) => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Carregando imóveis...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Imóveis</h1>
        <Button className="bg-blue-900">Publicar Imóvel</Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Imóveis</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Pesquisar imóvel..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imóvel</TableHead>
                <TableHead>Zona</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Proprietário</TableHead>
                <TableHead>Verificação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell>{p.district}</TableCell>
                  <TableCell>{p.price.toLocaleString('pt-AO')} Kz</TableCell>
                  <TableCell>{p.landlordName || 'N/A'}</TableCell>
                  <TableCell>
                    <VerificationBadge 
                      isVerified={p.verification?.isVerified}
                      score={p.verification?.verificationScore}
                      biStatus={p.verification?.biStatus}
                      propertyTitleStatus={p.verification?.propertyTitleStatus}
                      size="sm"
                    />
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="icon" className="text-blue-600"><Edit3 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
