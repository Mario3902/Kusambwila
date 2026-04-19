import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Upload, File, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Document {
  id: number;
  documentType: string;
  fileName: string;
  filePath: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: string;
  rejectionReason?: string;
  adminNotes?: string;
  firstName?: string;
  lastName?: string;
}

const documentTypes = [
  { value: 'bi', label: 'Bilhete de Identidade (BI)' },
  { value: 'propertyTitle', label: 'Documento de Propriedade' },
  { value: 'addressProof', label: 'Comprovante de Endereço' },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'verified':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'rejected':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'pending':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    default:
      return null;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'verified':
      return 'Aprovado';
    case 'rejected':
      return 'Rejeitado';
    case 'pending':
      return 'Pendente';
    default:
      return status;
  }
};

export default function LandlordDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState('bi');

  useEffect(() => {
    if (user?.userType === 'landlord') {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await api.documents.getMyDocuments();
      setDocuments(data);
    } catch (error) {
      toast.error('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 10MB');
      return;
    }

    // Validar tipo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Apenas PDF e imagens (JPEG, PNG) são permitidos');
      return;
    }

    try {
      setUploading(true);
      await api.documents.upload(file, selectedType);
      toast.success('Documento enviado com sucesso!');
      loadDocuments();
      setSelectedType('bi');
      e.target.value = '';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar documento');
    } finally {
      setUploading(false);
    }
  };

  if (user?.userType !== 'landlord') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Esta página é apenas para proprietários</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meus Documentos</h1>
          <p className="mt-2 text-gray-600">Faça upload dos seus documentos para verificação</p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enviar Documento</CardTitle>
            <CardDescription>Faça upload de PDF ou imagem (JPEG, PNG) com tamanho máximo de 10MB</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Documento
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {uploading ? 'Enviando...' : 'Clique para selecionar arquivo'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    ou arraste um arquivo
                  </span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos Enviados</CardTitle>
            <CardDescription>
              {loading ? 'Carregando...' : `${documents.length} documento(s) enviado(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Carregando documentos...
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum documento enviado ainda
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <File className="w-8 h-8 text-gray-400" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{doc.fileName}</h3>
                        <p className="text-sm text-gray-500">
                          {documentTypes.find((t) => t.value === doc.documentType)?.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(doc.uploadedAt).toLocaleDateString('pt-AO')}
                        </p>
                        {doc.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            <strong>Motivo da rejeição:</strong> {doc.rejectionReason}
                          </div>
                        )}
                        {doc.adminNotes && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                            <strong>Notas do administrador:</strong> {doc.adminNotes}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {getStatusLabel(doc.status)}
                        </p>
                      </div>
                      {getStatusIcon(doc.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
