import { motion } from 'motion/react';
import { Link } from 'react-router';
import { MapPin, Bed, Bath, Maximize, Heart, Phone, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { Property } from '../lib/mock-data';
import { useState } from 'react';
import { toast } from 'sonner';
import { VerificationBadge } from './verification-badge';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
  };

  const zoneRankColors = {
    premium: 'bg-purple-100 text-purple-700',
    high: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-orange-100 text-orange-700',
    affordable: 'bg-green-100 text-green-700',
  };

  const zoneRankLabels = {
    premium: 'Premium',
    high: 'Alto',
    medium: 'Médio',
    low: 'Baixo',
    affordable: 'Acessível',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/property/${property.id}`}>
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="relative">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-52 object-cover"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              {property.featured && (
                <Badge className="bg-gradient-to-r from-blue-900 to-green-700 border-0">
                  Destaque
                </Badge>
              )}
              <Badge className={`${zoneRankColors[property.zoneRank]} border-0`}>
                {zoneRankLabels[property.zoneRank]}
              </Badge>
            </div>
            <button
              onClick={handleFavorite}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
              />
            </button>
            <div className="absolute bottom-3 left-3">
              <VerificationBadge
                isVerified={property.verification.isVerified}
                score={property.verification.verificationScore}
                biStatus={property.verification.biStatus}
                propertyTitleStatus={property.verification.propertyTitleStatus}
                size="sm"
              />
            </div>
          </div>

          <CardContent className="p-5">
            <div className="mb-3">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                {property.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mt-1.5">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">{property.location}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {property.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4 py-3 border-y border-gray-100">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Maximize className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{property.area}m²</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {property.price.toLocaleString('pt-AO')} Kz
                </p>
                <p className="text-xs text-gray-500">/mês</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  toast.success('Funcionalidade de contacto em breve!');
                }}
              >
                <Phone className="w-4 h-4 mr-1" />
                Contactar
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
