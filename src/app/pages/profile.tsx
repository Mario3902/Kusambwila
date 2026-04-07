import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  User, 
  Mail, 
  Phone, 
  Edit, 
  Save, 
  Home,
  Heart,
  Eye,
  Trash2,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/auth-context';
import { mockProperties } from '../lib/mock-data';
import { PropertyCard } from '../components/property-card';
import { toast } from 'sonner';

export function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const myProperties = user.userType === 'landlord' 
    ? mockProperties.filter((p) => p.landlordName === user.name)
    : [];
  
  const favoriteProperties = mockProperties.slice(0, 2);
  const viewedProperties = mockProperties.slice(2, 4);

  const handleSave = () => {
    toast.success('Perfil atualizado com sucesso!');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-900 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-white">
              <AvatarFallback className="text-3xl bg-white text-blue-900">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{user.name}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/20">
                  {user.userType === 'landlord' ? 'Proprietário' : 
                   user.userType === 'admin' ? 'Administrador' : 'Inquilino'}
                </Badge>
                <Badge className="bg-white/20">
                  Membro desde Mar 2026
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList>
            <TabsTrigger value="info">Informações</TabsTrigger>
            {user.userType === 'landlord' && (
              <TabsTrigger value="properties">Meus Imóveis</TabsTrigger>
            )}
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          {/* Info Tab */}
          <TabsContent value="info">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Gerir os seus dados pessoais</CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={() => setIsEditing(false)} variant="outline">
                      Cancelar
                    </Button>
                    <Button onClick={handleSave} className="bg-gradient-to-r from-blue-900 to-green-800">
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Utilizador</Label>
                    <Input
                      value={user.userType === 'landlord' ? 'Proprietário' : 
                             user.userType === 'admin' ? 'Administrador' : 'Inquilino'}
                      disabled
                    />
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Estatísticas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Home className="w-8 h-8 text-blue-900" />
                        <div>
                          <p className="text-2xl font-bold text-blue-900">
                            {user.userType === 'landlord' ? myProperties.length : 0}
                          </p>
                          <p className="text-sm text-gray-600">Imóveis Publicados</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Heart className="w-8 h-8 text-green-800" />
                        <div>
                          <p className="text-2xl font-bold text-green-800">
                            {favoriteProperties.length}
                          </p>
                          <p className="text-sm text-gray-600">Favoritos</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Eye className="w-8 h-8 text-purple-900" />
                        <div>
                          <p className="text-2xl font-bold text-purple-900">
                            {viewedProperties.length}
                          </p>
                          <p className="text-sm text-gray-600">Visualizados</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Properties Tab */}
          {user.userType === 'landlord' && (
            <TabsContent value="properties">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Meus Imóveis</CardTitle>
                      <CardDescription>
                        {myProperties.length} imóveis publicados
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => navigate('/publish')}
                      className="bg-gradient-to-r from-blue-900 to-green-800"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Publicar Novo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {myProperties.length === 0 ? (
                    <div className="text-center py-12">
                      <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Nenhum imóvel publicado
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Comece a publicar os seus imóveis agora
                      </p>
                      <Button onClick={() => navigate('/publish')}>
                        Publicar Primeiro Imóvel
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {myProperties.map((property) => (
                        <div key={property.id} className="relative">
                          <PropertyCard property={property} />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="bg-white hover:bg-gray-100"
                              onClick={() => toast.info('Funcionalidade em breve')}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="bg-white hover:bg-red-50 text-red-600"
                              onClick={() => toast.info('Funcionalidade em breve')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Imóveis Favoritos</CardTitle>
                <CardDescription>
                  {favoriteProperties.length} imóveis guardados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favoriteProperties.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Nenhum favorito
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Adicione imóveis aos favoritos para vê-los aqui
                    </p>
                    <Button onClick={() => navigate('/search')}>
                      Explorar Imóveis
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favoriteProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Visualizações</CardTitle>
                <CardDescription>
                  Imóveis que você visualizou recentemente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {viewedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
