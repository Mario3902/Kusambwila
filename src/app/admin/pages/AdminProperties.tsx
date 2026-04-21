import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { api } from '../../lib/api';
import { Trash2, Search, Eye, MapPin, BedDouble, Bath, AlertTriangle, Home, CheckCircle, XCircle, Clock } from 'lucide-react';
import { VerificationBadge } from '../../components/verification-badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  district: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  featured: boolean;
  landlordName: string;
  landlordId: number;
  verification: {
    isVerified: boolean;
    verificationScore: number;
    biStatus: 'pending' | 'verified' | 'rejected';
    propertyTitleStatus: 'pending' | 'verified' | 'rejected';
  };
  images: { id: number; imageUrl: string }[];
}

const PROPERTY_TYPES: Record<string, string> = {
  apartment: 'Apartamento',
  house: 'Casa',
  commercial: 'Comercial',
  land: 'Terreno',
};

export function AdminProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      setLoading(true);
      const data = await api.properties.getAll();
      setProperties(data);
    } catch (err: any) {
      toast.error('Erro ao carregar imóveis: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = (property: Property) => {
    setSelectedProperty(property);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedProperty) return;
    
    try {
      setDeleting(true);
      await api.admin.deleteProperty(selectedProperty.id);
      toast.success('Imóvel removido com sucesso!');
      setShowDeleteDialog(false);
      loadProperties();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleApprove = (property: Property) => {
    setSelectedProperty(property);
    setShowApproveDialog(true);
  };

  const confirmApprove = async (approved: boolean) => {
    if (!selectedProperty) return;
    
    try {
      setApproving(true);
      await api.admin.verifyUser(selectedProperty.landlordId, {
        isVerified: approved,
        biStatus: approved ? 'verified' : 'rejected',
        propertyTitleStatus: approved ? 'verified' : 'rejected',
        verificationScore: approved ? 100 : 0
      });
      toast.success(approved ? 'Imóvel aprovado com sucesso!' : 'Imóvel rejeitado');
      setShowApproveDialog(false);
      loadProperties();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setApproving(false);
    }
  };

  const filtered = properties.filter((p) => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Carregando imóveis...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Imóveis</h1>
          <p className="text-gray-500 mt-1">Submissão de casas - visualize e gerencie todos os imóveis</p>
        </div>
        <Button 
          className="bg-blue-900"
          onClick={() => navigate('/publish')}
        >
          Publicar Imóvel
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Lista de Imóveis</CardTitle>
              <CardDescription>{filtered.length} imóvel(is) encontrado(s)</CardDescription>
            </div>
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Proprietário</TableHead>
                  <TableHead>Verificação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{p.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <BedDouble className="w-3 h-3" />
                          <span>{p.bedrooms || 0}</span>
                          <Bath className="w-3 h-3 ml-1" />
                          <span>{p.bathrooms || 0}</span>
                          {p.area && <span className="ml-1">{p.area}m²</span>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {PROPERTY_TYPES[p.type] || p.type}
                      </Badge>
                      {p.featured && (
                        <Badge className="bg-yellow-100 text-yellow-700 ml-1">Destaque</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{p.district}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-blue-900">
                      {p.price.toLocaleString('pt-AO')} Kz
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{p.landlordName || 'N/A'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <VerificationBadge 
                        isVerified={p.verification?.isVerified}
                        score={p.verification?.verificationScore}
                        biStatus={p.verification?.biStatus}
                        propertyTitleStatus={p.verification?.propertyTitleStatus}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-blue-600"
                          onClick={() => navigate(`/property/${p.id}`)}
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {!p.verification?.isVerified && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-green-600"
                            onClick={() => handleApprove(p)}
                            title="Aprovar/Rejeitar"
                          >
                            <Home className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-600"
                          onClick={() => handleDelete(p)}
                          title="Remover imóvel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Approve/Reject Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" />
              Aprovar Imóvel
            </DialogTitle>
            <DialogDescription>
              Valide a conformidade deste imóvel antes de aprovar
            </DialogDescription>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{selectedProperty.title}</p>
                <p className="text-sm text-gray-500">{selectedProperty.district} - {selectedProperty.price.toLocaleString('pt-AO')} Kz</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Proprietário:</span>
                  <span className="text-sm font-medium">{selectedProperty.landlordName || 'N/A'}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Verificação do proprietário: {selectedProperty.verification?.isVerified ? 'Verificado' : 'Pendente'}</span>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowApproveDialog(false)}
                  disabled={approving}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => confirmApprove(false)}
                  disabled={approving}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" /> Rejeitar
                </Button>
                <Button
                  onClick={() => confirmApprove(true)}
                  disabled={approving}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Aprovar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este imóvel? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {selectedProperty && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{selectedProperty.title}</p>
              <p className="text-sm text-gray-500">{selectedProperty.district} - {selectedProperty.price.toLocaleString('pt-AO')} Kz</p>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleting}
              variant="destructive"
              className="flex-1"
            >
              {deleting ? 'Removendo...' : 'Remover Imóvel'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
