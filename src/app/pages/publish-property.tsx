import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  Home, 
  Upload, 
  MapPin, 
  DollarSign, 
  FileText, 
  Image as ImageIcon,
  Video,
  Eye,
  CheckCircle2,
  AlertCircle,
  IdCard
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/auth-context';
import { districts, propertyTypes } from '../lib/mock-data';
import { toast } from 'sonner';
import { Separator } from '../components/ui/separator';

export function PublishProperty() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    district: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [biNumber, setBiNumber] = useState('');
  const [biDocument, setBiDocument] = useState<File | null>(null);
  const [propertyDocument, setPropertyDocument] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated || user?.userType !== 'landlord') {
    navigate('/');
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages([...images, ...newImages]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handleBiDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBiDocument(e.target.files[0]);
    }
  };

  const handlePropertyDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPropertyDocument(e.target.files[0]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description || !formData.price || 
        !formData.location || !formData.district || !formData.type) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (images.length === 0) {
      toast.error('Adicione pelo menos uma imagem do imóvel');
      return;
    }

    // Validação de documentos obrigatórios
    if (!biNumber) {
      toast.error('Por favor, forneça o número do BI');
      return;
    }

    if (!biDocument) {
      toast.error('Por favor, carregue o documento do BI');
      return;
    }

    if (!propertyDocument) {
      toast.error('Por favor, carregue o documento da propriedade');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Imóvel publicado com sucesso! Documentos enviados para verificação.');
    navigate('/profile');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-green-800 rounded-lg flex items-center justify-center">
                <Home className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Publicar Imóvel
            </h1>
            <p className="text-lg text-gray-600">
              Preencha as informações do seu imóvel para publicação
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8 space-x-4">
            {[
              { num: 1, label: 'Informações Básicas' },
              { num: 2, label: 'Detalhes' },
              { num: 3, label: 'Multimédia' },
              { num: 4, label: 'Documentação' },
            ].map((s) => (
              <div key={s.num} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s.num
                      ? 'bg-gradient-to-r from-blue-900 to-green-800 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-6 h-6" /> : s.num}
                </div>
                {s.num < 4 && (
                  <div
                    className={`w-16 h-1 ${
                      step > s.num ? 'bg-gradient-to-r from-blue-900 to-green-800' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>
                    Forneça as informações principais do imóvel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Anúncio *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Ex: Apartamento T3 Moderno na Talatona"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Descreva o imóvel em detalhe..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo de Imóvel *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => handleSelectChange('type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Preço Mensal (Kz) *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          placeholder="150000"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-gradient-to-r from-blue-900 to-green-800"
                    >
                      Próximo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Imóvel</CardTitle>
                  <CardDescription>
                    Adicione informações específicas sobre o imóvel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="district">Distrito *</Label>
                      <Select
                        value={formData.district}
                        onValueChange={(value) => handleSelectChange('district', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o distrito" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Localização Completa *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <Input
                          id="location"
                          name="location"
                          placeholder="Rua, bairro, referências"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Quartos</Label>
                      <Input
                        id="bedrooms"
                        name="bedrooms"
                        type="number"
                        placeholder="3"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Casas de Banho</Label>
                      <Input
                        id="bathrooms"
                        name="bathrooms"
                        type="number"
                        placeholder="2"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="area">Área (m²)</Label>
                      <Input
                        id="area"
                        name="area"
                        type="number"
                        placeholder="120"
                        value={formData.area}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amenities">Comodidades</Label>
                    <Textarea
                      id="amenities"
                      name="amenities"
                      placeholder="Piscina, Segurança 24h, Estacionamento, etc. (separados por vírgula)"
                      value={formData.amenities}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Voltar
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-gradient-to-r from-blue-900 to-green-800"
                    >
                      Próximo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Media */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Fotos e Vídeo</CardTitle>
                  <CardDescription>
                    Adicione imagens e vídeo do imóvel (mínimo 1 imagem)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Image Upload */}
                  <div className="space-y-4">
                    <Label>Fotos do Imóvel *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="images" className="cursor-pointer">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          Clique para adicionar fotos
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG até 10MB cada
                        </p>
                      </label>
                    </div>

                    {/* Image Preview */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Video Upload */}
                  <div className="space-y-4">
                    <Label>Vídeo do Imóvel (Opcional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="video"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                      <label htmlFor="video" className="cursor-pointer">
                        <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          Clique para adicionar vídeo
                        </p>
                        <p className="text-sm text-gray-500">
                          MP4, MOV até 50MB
                        </p>
                      </label>
                    </div>

                    {video && (
                      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Video className="w-5 h-5 text-gray-600" />
                          <span className="text-sm">{video.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setVideo(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remover
                        </button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Document Upload */}
                  <div className="space-y-4">
                    <Label>Documentos Obrigatórios</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="biNumber">Número do BI *</Label>
                        <Input
                          id="biNumber"
                          name="biNumber"
                          placeholder="Ex: 0000000000000"
                          value={biNumber}
                          onChange={(e) => setBiNumber(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Documento do BI *</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                          <input
                            type="file"
                            id="biDocument"
                            accept="application/pdf"
                            onChange={handleBiDocumentChange}
                            className="hidden"
                          />
                          <label htmlFor="biDocument" className="cursor-pointer">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">
                              Clique para adicionar documento
                            </p>
                            <p className="text-sm text-gray-500">
                              PDF até 5MB
                            </p>
                          </label>
                        </div>

                        {biDocument && (
                          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-5 h-5 text-gray-600" />
                              <span className="text-sm">{biDocument.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setBiDocument(null)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remover
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Documento da Propriedade *</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                          <input
                            type="file"
                            id="propertyDocument"
                            accept="application/pdf"
                            onChange={handlePropertyDocumentChange}
                            className="hidden"
                          />
                          <label htmlFor="propertyDocument" className="cursor-pointer">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">
                              Clique para adicionar documento
                            </p>
                            <p className="text-sm text-gray-500">
                              PDF até 5MB
                            </p>
                          </label>
                        </div>

                        {propertyDocument && (
                          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-5 h-5 text-gray-600" />
                              <span className="text-sm">{propertyDocument.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPropertyDocument(null)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remover
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                    >
                      Voltar
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => setStep(4)}
                        className="bg-gradient-to-r from-blue-900 to-green-800"
                      >
                        Próximo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Documentation */}
            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Documentação Obrigatória</CardTitle>
                  <CardDescription>
                    Carregue os documentos necessários para verificação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-900 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-900 font-semibold mb-1">
                        Verificação de Identidade e Propriedade
                      </p>
                      <p className="text-xs text-blue-700">
                        Para garantir a segurança de todos os utilizadores, solicitamos documentos que comprovem sua identidade e a propriedade do imóvel. Todos os documentos são tratados de forma confidencial.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="biNumber">Número do BI *</Label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="biNumber"
                        type="text"
                        placeholder="000000000AA000"
                        value={biNumber}
                        onChange={(e) => setBiNumber(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Informe o número do seu Bilhete de Identidade
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="biDocument">Documento do BI (PDF ou Imagem) *</Label>
                    <div className="relative">
                      <input
                        id="biDocument"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleBiDocumentChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="biDocument"
                        className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {biDocument ? biDocument.name : 'Carregar documento do BI'}
                          </span>
                        </div>
                        {biDocument && (
                          <span className="text-xs text-green-600 font-semibold flex items-center">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Carregado
                          </span>
                        )}
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      Carregue uma cópia do seu BI (frente e verso). Formatos: PDF, JPG, PNG (máx. 5MB)
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="propertyDocument">Documento da Propriedade *</Label>
                    <div className="relative">
                      <input
                        id="propertyDocument"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handlePropertyDocumentChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="propertyDocument"
                        className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {propertyDocument ? propertyDocument.name : 'Carregar documento da propriedade'}
                          </span>
                        </div>
                        {propertyDocument && (
                          <span className="text-xs text-green-600 font-semibold flex items-center">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Carregado
                          </span>
                        )}
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      Escritura pública, contrato de compra e venda, ou outro documento que comprove a propriedade do imóvel
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-xs text-green-900">
                      <strong>Privacidade garantida:</strong> Seus documentos serão utilizados apenas para verificação de identidade e propriedade. Não compartilhamos suas informações com terceiros.
                    </p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(3)}
                    >
                      Voltar
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => toast.info('Funcionalidade de pré-visualização em breve')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Pré-visualizar
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-blue-900 to-green-800"
                        disabled={loading}
                      >
                        {loading ? (
                          'Publicando...'
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Publicar Imóvel
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}