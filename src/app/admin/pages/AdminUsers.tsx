import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { api } from '../../lib/api';
import { VerificationBadge } from '../../components/verification-badge';
import { UserX, UserCheck, Search, Eye, FileText, AlertCircle, Phone, Mail, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  biNumber: string;
  createdAt: string;
  biStatus: string;
  propertyTitleStatus: string;
  addressProofStatus: string;
  verificationScore: number;
  isVerified: boolean;
  pendingDocuments: number;
}

interface UserDocument {
  id: number;
  documentType: string;
  fileName: string;
  filePath: string;
  status: string;
  uploadedAt: string;
}

const DOCUMENT_TYPES: Record<string, string> = {
  bi: 'Bilhete de Identidade',
  propertyTitle: 'Documento de Propriedade',
  addressProof: 'Comprovante de Endereço',
};

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await api.admin.getUsers();
      setUsers(data);
    } catch (err: any) {
      toast.error('Erro ao carregar utilizadores: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleVerify = async (userId: number, status: { isVerified: boolean; biStatus: string; propertyTitleStatus: string; verificationScore: number }) => {
    try {
      await api.admin.verifyUser(userId, status);
      toast.success(status.isVerified ? 'Utilizador aprovado com sucesso!' : 'Utilizador rejeitado');
      loadUsers();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleViewDetails = async (user: User) => {
    try {
      setSelectedUser(user);
      const details = await api.admin.getUser(user.id);
      setUserDetails(details);
      setShowDetailsDialog(true);
    } catch (err: any) {
      toast.error('Erro ao carregar detalhes: ' + err.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.biNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || u.userType === filterType;
    
    return matchesSearch && matchesType;
  });

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'landlord': return 'Proprietário';
      case 'tenant': return 'Inquilino';
      case 'admin': return 'Administrador';
      default: return type;
    }
  };

  const getUserTypeBadge = (type: string) => {
    switch (type) {
      case 'landlord':
        return <Badge className="bg-blue-100 text-blue-700">Proprietário</Badge>;
      case 'tenant':
        return <Badge className="bg-green-100 text-green-700">Inquilino</Badge>;
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-700">Admin</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando utilizadores...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Utilizadores</h1>
          <p className="text-gray-500 mt-1">Aprove membros e gerencie documentos</p>
        </div>
        <Badge variant="outline" className="text-blue-600">Total: {users.length}</Badge>
      </div>

      {/* Filter and Search */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Pesquisar por nome, email ou BI..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {['all', 'landlord', 'tenant'].map((type) => (
                <Button
                  key={type}
                  size="sm"
                  variant={filterType === type ? 'default' : 'outline'}
                  onClick={() => setFilterType(type)}
                >
                  {type === 'all' ? 'Todos' : type === 'landlord' ? 'Proprietários' : 'Inquilinos'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Lista de Utilizadores</CardTitle>
          <CardDescription>
            {filteredUsers.length} utilizador(es) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilizador</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Documentos Pendentes</TableHead>
                  <TableHead>Verificação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{u.firstName} {u.lastName}</p>
                        <p className="text-sm text-gray-500">{u.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getUserTypeBadge(u.userType)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{u.phone || 'N/A'}</p>
                        <p className="text-gray-500">BI: {u.biNumber || 'N/A'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {u.pendingDocuments > 0 ? (
                        <Badge className="bg-yellow-100 text-yellow-700">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {u.pendingDocuments} pendente(s)
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-500">Nenhum</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <VerificationBadge 
                        isVerified={u.isVerified}
                        score={u.verificationScore}
                        biStatus={u.biStatus}
                        propertyTitleStatus={u.propertyTitleStatus}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetails(u)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {u.userType === 'landlord' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-600 hover:bg-green-50"
                              onClick={() => handleVerify(u.id, { isVerified: true, biStatus: 'verified', propertyTitleStatus: 'verified', verificationScore: 100 })}
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleVerify(u.id, { isVerified: false, biStatus: 'rejected', propertyTitleStatus: 'rejected', verificationScore: 0 })}
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Utilizador</DialogTitle>
            <DialogDescription>
              Informações completas e documentos
            </DialogDescription>
          </DialogHeader>

          {selectedUser && userDetails && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Nome
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </label>
                  <p className="text-sm font-medium text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Telefone
                  </label>
                  <p className="text-sm font-medium text-gray-900">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Registro
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedUser.createdAt).toLocaleDateString('pt-AO')}
                  </p>
                </div>
              </div>

              {/* Verification Status */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Status de Verificação</h4>
                <div className="flex items-center gap-4">
                  <VerificationBadge 
                    isVerified={selectedUser.isVerified}
                    score={selectedUser.verificationScore}
                    biStatus={selectedUser.biStatus}
                    propertyTitleStatus={selectedUser.propertyTitleStatus}
                    size="md"
                  />
                  <span className="text-sm text-gray-600">
                    Score: {selectedUser.verificationScore}%
                  </span>
                </div>
              </div>

              {/* Documents */}
              {userDetails.documents && userDetails.documents.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Documentos Submetidos
                  </h4>
                  <div className="space-y-2">
                    {userDetails.documents.map((doc: UserDocument) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {DOCUMENT_TYPES[doc.documentType] || doc.documentType}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(doc.uploadedAt).toLocaleDateString('pt-AO')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            doc.status === 'verified' ? 'bg-green-100 text-green-700' :
                            doc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }>
                            {doc.status === 'verified' ? 'Aprovado' :
                             doc.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                          </Badge>
                          <a
                            href={`http://localhost:5000${doc.filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Ver
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedUser.userType === 'landlord' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => {
                      handleVerify(selectedUser.id, { isVerified: true, biStatus: 'verified', propertyTitleStatus: 'verified', verificationScore: 100 });
                      setShowDetailsDialog(false);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <UserCheck className="w-4 h-4 mr-2" /> Aprovar Utilizador
                  </Button>
                  <Button
                    onClick={() => {
                      handleVerify(selectedUser.id, { isVerified: false, biStatus: 'rejected', propertyTitleStatus: 'rejected', verificationScore: 0 });
                      setShowDetailsDialog(false);
                    }}
                    variant="destructive"
                    className="flex-1"
                  >
                    <UserX className="w-4 h-4 mr-2" /> Rejeitar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
