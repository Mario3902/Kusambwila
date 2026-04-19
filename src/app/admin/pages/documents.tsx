import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { FileCheck, AlertCircle, Clock, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';

interface Document {
  id: number;
  userId: number;
  documentType: string;
  fileName: string;
  filePath: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  uploadedAt: string;
  verifiedAt?: string;
  reviewedByName?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const DOCUMENT_TYPES = {
  bi: 'Bilhete de Identidade',
  propertyTitle: 'Documento de Propriedade',
  addressProof: 'Comprovante de Endereço',
};

export default function AdminDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    if (user?.userType === 'admin') {
      loadDocuments();
    }
  }, [user, selectedStatus]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await api.admin.documents.getAll(selectedStatus);
      setDocuments(data);
    } catch (error) {
      toast.error('Erro ao carregar documentos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (doc: Document) => {
    try {
      const fullDoc = await api.admin.documents.getOne(doc.id);
      setSelectedDocument(fullDoc);
      setShowDetailsDialog(true);
    } catch (error) {
      toast.error('Erro ao carregar detalhes do documento');
    }
  };

  const handleOpenReview = (action: 'approve' | 'reject') => {
    setReviewAction(action);
    setShowReviewDialog(true);
  };

  const handleApproveDocument = async () => {
    if (!selectedDocument) return;

    try {
      setReviewing(true);
      await api.admin.documents.approve(selectedDocument.id, reviewNotes);
      toast.success('Documento aprovado com sucesso!');
      setShowReviewDialog(false);
      setShowDetailsDialog(false);
      setReviewNotes('');
      loadDocuments();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao aprovar documento');
    } finally {
      setReviewing(false);
    }
  };

  const handleRejectDocument = async () => {
    if (!selectedDocument) return;

    if (!rejectionReason.trim()) {
      toast.error('Motivo da rejeição é obrigatório');
      return;
    }

    try {
      setReviewing(true);
      await api.admin.documents.reject(selectedDocument.id, rejectionReason);
      toast.success('Documento rejeitado com sucesso!');
      setShowReviewDialog(false);
      setShowDetailsDialog(false);
      setRejectionReason('');
      loadDocuments();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao rejeitar documento');
    } finally {
      setReviewing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle size={16} /> Aprovado
          </div>
        );
      case 'rejected':
        return (
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            <XCircle size={16} /> Rejeitado
          </div>
        );
      case 'pending':
        return (
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            <Clock size={16} /> Pendente
          </div>
        );
      default:
        return null;
    }
  };

  if (user?.userType !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Esta página é apenas para administradores</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusOptions = [
    { value: 'pending', label: 'Pendentes', count: 0 },
    { value: 'verified', label: 'Aprovados', count: 0 },
    { value: 'rejected', label: 'Rejeitados', count: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Documentos para Verificação</h1>
          <p className="mt-2 text-gray-600">Revise os documentos submetidos pelos proprietários</p>
        </div>

        {/* Status Filter */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {(['pending', 'verified', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status === 'pending' ? 'Pendentes' : status === 'verified' ? 'Aprovados' : 'Rejeitados'}
            </button>
          ))}
        </div>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
            <CardDescription>
              {loading ? 'Carregando...' : `${documents.length} documento(s) encontrado(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Carregando documentos...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>
                  {selectedStatus === 'pending'
                    ? 'Nenhum documento pendente'
                    : selectedStatus === 'verified'
                    ? 'Nenhum documento aprovado'
                    : 'Nenhum documento rejeitado'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Proprietário</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo de Doc.</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Arquivo</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {doc.firstName} {doc.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{doc.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {DOCUMENT_TYPES[doc.documentType as keyof typeof DOCUMENT_TYPES] || doc.documentType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={`http://localhost:5000${doc.filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                          >
                            {doc.fileName} <ExternalLink size={14} />
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(doc.uploadedAt).toLocaleDateString('pt-AO')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(doc.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewDetails(doc)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Documento</DialogTitle>
            <DialogDescription>
              Revise as informações e tome uma decisão
            </DialogDescription>
          </DialogHeader>

          {selectedDocument && (
            <div className="space-y-6">
              {/* Landlord Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">Nome</label>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedDocument.firstName} {selectedDocument.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">Email</label>
                  <p className="text-sm font-medium text-gray-900">{selectedDocument.email}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">Telefone</label>
                  <p className="text-sm font-medium text-gray-900">{selectedDocument.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedDocument.status)}</div>
                </div>
              </div>

              {/* Document Info */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 uppercase">Tipo de Documento</label>
                <p className="text-sm font-medium text-gray-900">
                  {DOCUMENT_TYPES[selectedDocument.documentType as keyof typeof DOCUMENT_TYPES] ||
                    selectedDocument.documentType}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 uppercase">Arquivo</label>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-900">{selectedDocument.fileName}</span>
                  <a
                    href={`http://localhost:5000${selectedDocument.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>

              {selectedDocument.status === 'rejected' && selectedDocument.rejectionReason && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Motivo da rejeição:</strong> {selectedDocument.rejectionReason}
                  </AlertDescription>
                </Alert>
              )}

              {/* Review Actions */}
              {selectedDocument.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleOpenReview('approve')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Aprovar
                  </Button>
                  <Button
                    onClick={() => handleOpenReview('reject')}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Rejeitar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Aprovar Documento' : 'Rejeitar Documento'}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve'
                ? 'Adicione notas opcionais antes de aprovar'
                : 'Explique o motivo da rejeição'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {reviewAction === 'approve' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Adicione qualquer observação..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo da Rejeição *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explique por que este documento foi rejeitado..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => setShowReviewDialog(false)}
                variant="outline"
                disabled={reviewing}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={
                  reviewAction === 'approve' ? handleApproveDocument : handleRejectDocument
                }
                disabled={reviewing || (reviewAction === 'reject' && !rejectionReason.trim())}
                className={`flex-1 ${
                  reviewAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {reviewing ? 'Processando...' : reviewAction === 'approve' ? 'Aprovar' : 'Rejeitar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
