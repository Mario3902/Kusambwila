import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Mail, Phone, CheckCircle2,
  DollarSign, LogOut, Edit3, PlusCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/auth-context';
import { api } from '../lib/api';
import { VerificationBadge } from '../components/verification-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PropertyCard } from '../components/property-card';

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [myProperties, setMyProperties] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || '',
      });

      if (user.userType === 'landlord') {
        fetchMyProperties();
      }
    }
  }, [user]);

  const fetchMyProperties = async () => {
    try {
      const properties = await api.properties.getAll();
      // Filtering locally since backend currently returns all
      const filtered = properties.filter((p: any) => p.landlordId === user?.id);
      setMyProperties(filtered);
    } catch (err) {
      console.error('Erro ao carregar propriedades:', err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.auth.updateProfile({ ...formData });
      setIsEditing(false);
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Por favor, faça login para ver o perfil.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancelar' : <><Edit3 className="w-4 h-4 mr-2" /> Editar Perfil</>}
            </Button>
            <Button variant="destructive" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Basic Info Card */}
          <Card className="lg:col-span-1 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-900 to-green-700 mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-500 mb-4">{user.email}</p>
              <Badge className="mb-6 bg-blue-100 text-blue-700 border-0 capitalize">
                {user.userType === 'landlord' ? 'Proprietário' : user.userType === 'admin' ? 'Administrador' : 'Inquilino'}
              </Badge>
              
              <div className="space-y-3 text-left border-t pt-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4" /> {user.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4" /> {user.email}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details and Role-Based Content */}
          <div className="lg:col-span-2 space-y-6">
            {isEditing ? (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Editar Informações</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Primeiro Nome</Label>
                        <Input 
                          value={formData.firstName} 
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Apelido</Label>
                        <Input 
                          value={formData.lastName} 
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input 
                        value={formData.phone} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-900">Guardar Alterações</Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="general">
                <TabsList className="mb-6">
                  <TabsTrigger value="general">Geral</TabsTrigger>
                  {user.userType === 'landlord' && <TabsTrigger value="properties">Meus Imóveis</TabsTrigger>}
                  {user.userType === 'landlord' && <TabsTrigger value="earnings">Ganhos</TabsTrigger>}
                  {user.userType === 'tenant' && <TabsTrigger value="favorites">Favoritos</TabsTrigger>}
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Status de Verificação
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-gray-50 rounded-xl">
                        <VerificationBadge 
                          isVerified={user.isVerified || false}
                          score={user.verificationScore || 0}
                          biStatus={user.biStatus || 'pending'}
                          propertyTitleStatus={user.propertyTitleStatus || 'pending'}
                          size="lg"
                        />
                        <div className="text-sm text-gray-600 max-w-md">
                          {user.isVerified ? 
                            'Sua conta está totalmente verificada. Isso aumenta a confiança dos seus clientes.' : 
                            'A sua conta ainda não foi verificada. Envie os seus documentos para ganhar o selo de confiança.'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {user.userType === 'landlord' && (
                  <>
                    <TabsContent value="properties" className="space-y-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Os meus imóveis</h3>
                        <Button onClick={() => navigate('/publish')} className="bg-green-700">
                          <PlusCircle className="w-4 h-4 mr-2" /> Publicar Novo
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myProperties.length === 0 ? (
                          <p className="text-gray-500 italic">Não possui imóveis publicados.</p>
                        ) : (
                          myProperties.map((property: any) => (
                            <PropertyCard key={property.id} property={property} />
                          ))
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="earnings" className="space-y-6">
                      <Card className="shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            Relatório de Ganhos
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                              <p className="text-sm text-green-600">Receita Mensal</p>
                              <p className="text-2xl font-bold text-green-900">150.000 Kz</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                              <p className="text-sm text-blue-600">Ocupação</p>
                              <p className="text-2xl font-bold text-blue-900">92%</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                              <p className="text-sm text-purple-600">Total Imóveis</p>
                              <p className="text-2xl font-bold text-purple-900">3</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </>
                )}

                {user.userType === 'tenant' && (
                  <TabsContent value="favorites" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <p className="text-gray-500 italic">Os seus imóveis favoritos aparecerão aqui.</p>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
