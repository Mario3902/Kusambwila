import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Heart,
  Share2,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Scan,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { VerificationBadge } from '../components/verification-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';

export function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAR, setShowAR] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const data = await api.properties.getOne(id);
        setProperty(data);
      } catch (err) {
        console.error('Erro ao carregar imóvel:', err);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProperty();
  }, [id]);

  const images: string[] = (() => {
    if (!property) return [];
    const raw = property.images || [];
    return raw.map((img: any) =>
      typeof img === 'string' ? img : img.url || ''
    ).filter(Boolean);
  })();

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: property?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado para a área de transferência');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-900" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Imóvel não encontrado</h2>
          <Button onClick={() => navigate('/search')}>Voltar à pesquisa</Button>
        </div>
      </div>
    );
  }

  const verification = property.verification || {
    isVerified: false,
    verificationScore: 0,
    biStatus: 'pending',
    propertyTitleStatus: 'pending',
  };

  const createdDate = property.createdAt
    ? new Date(property.createdAt).toLocaleDateString('pt-AO')
    : '—';

  const fallbackImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa';
  const currentImage = images[currentImageIndex] || fallbackImage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Image Gallery */}
      <div className="relative bg-black">
        <div className="container mx-auto px-4 py-0">
          <div className="relative h-[350px] md:h-[550px]">
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              src={currentImage}
              alt={`${property.title} - ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
              onError={(e: any) => { e.target.src = fallbackImage; }}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length || 1}
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setShowAR(true)}
                className="w-10 h-10 rounded-full bg-blue-600/90 backdrop-blur flex items-center justify-center hover:bg-blue-600 transition-colors"
                title="Ver em Realidade Aumentada"
              >
                <Scan className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleFavorite}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
              </button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? 'border-blue-500'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e: any) => { e.target.src = fallbackImage; }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {property.featured && (
                        <Badge className="bg-gradient-to-r from-blue-900 to-green-800 border-0">
                          Destaque
                        </Badge>
                      )}
                      <Badge variant="outline" className="capitalize">{property.type}</Badge>
                      <Badge variant="outline">{property.district}</Badge>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span className="text-lg">{property.location}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-3xl font-bold text-blue-900">
                      {property.price > 0 ? property.price.toLocaleString('pt-AO') + ' Kz' : '—'}
                    </p>
                    <p className="text-sm text-gray-500">Preço mensal</p>
                    <div className="mt-2">
                      <VerificationBadge
                        isVerified={verification.isVerified}
                        score={verification.verificationScore}
                        biStatus={verification.biStatus}
                        propertyTitleStatus={verification.propertyTitleStatus}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Bed className="w-5 h-5 text-blue-900" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Quartos</p>
                        <p className="font-semibold">{property.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Bath className="w-5 h-5 text-green-800" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Casas de banho</p>
                      <p className="font-semibold">{property.bathrooms}</p>
                    </div>
                  </div>
                  {property.area && (
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Maximize className="w-5 h-5 text-purple-900" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Área</p>
                        <p className="font-semibold">{property.area}m²</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-900" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Publicado</p>
                      <p className="font-semibold">{createdDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Descrição</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Localização</h2>
                <div className="bg-gray-200 h-60 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-semibold">{property.location}</p>
                    <p className="text-sm mt-1">{property.district}, Luanda</p>
                    <p className="text-xs mt-2">Mapa interativo disponível em breve</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Contactar Proprietário</h3>

                <div className="flex items-center space-x-3 mb-6">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-900 to-green-800 text-white text-lg">
                      {(property.landlordName || 'P').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{property.landlordName || 'Proprietário'}</p>
                    <p className="text-sm text-gray-600">Proprietário</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-900 to-green-800 hover:from-blue-800 hover:to-green-700"
                    onClick={() => toast.info('Funcionalidade de chamada em breve!')}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Ligar Agora
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      if (property.landlordEmail) {
                        window.location.href = `mailto:${property.landlordEmail}`;
                      } else {
                        toast.info('Contacto por email em breve!');
                      }
                    }}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Enviar Email
                  </Button>
                </div>

                <Separator className="my-6" />

                <div className="space-y-2 text-sm">
                  {property.landlordEmail && (
                    <div className="flex items-start space-x-2 text-gray-600">
                      <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="break-all">{property.landlordEmail}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Dicas de Segurança</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {[
                    'Visite o imóvel pessoalmente',
                    'Verifique a documentação',
                    'Não faça pagamentos antecipados sem contrato',
                    'Confirme a identidade do proprietário',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AR Modal */}
      <Dialog open={showAR} onOpenChange={setShowAR}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Scan className="w-6 h-6 text-blue-600" />
                  Realidade Aumentada
                </DialogTitle>
                <DialogDescription>
                  Visualize o imóvel em RA - {property?.title}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAR(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 h-[calc(90vh-100px)] px-6 pb-6">
            <iframe
              src="https://mywebar.com/pi/896161"
              frameBorder="0"
              scrolling="yes"
              seamless
              style={{ display: 'block', width: '100%', height: '100%', borderRadius: '8px' }}
              allow="camera;gyroscope;accelerometer;magnetometer;xr-spatial-tracking;microphone"
              title={`RA - ${property?.title || 'Imóvel'}`}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
