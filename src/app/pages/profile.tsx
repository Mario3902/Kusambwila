import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Mail, Phone, CheckCircle2,
  DollarSign, LogOut, Edit3, PlusCircle, Trash2, X, Home,
  Heart, Bookmark, CheckCircle, XCircle, MapPin, BedDouble, Bath
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/auth-context';
import { api } from '../lib/api';
import { VerificationBadge } from '../components/verification-badge';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PropertyCard } from '../components/property-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';

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
  const [favorites, setFavorites] = useState([]);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    price: 0,
    location: '',
    district: '',
    type: 'apartment',
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || '',
      });

      if (user.userType === 'landlord') {
        fetchMyProperties();
      } else if (user.userType === 'tenant') {
        fetchFavorites();
      }
    }
  }, [user]);

  const fetchMyProperties = async () => {
    try {
      const properties = await api.properties.getMyProperties();
      setMyProperties(properties);
    } catch (err) {
      console.error('Erro ao carregar propriedades:', err);
      toast.error('Erro ao carregar imóveis');
    }
  };

  const fetchFavorites = async () => {
    try {
      const data = await api.favorites.getAll();
      setFavorites(data);
    } catch (err) {
      console.error('Erro ao carregar favoritos:', err);
    }
  };

  const handleRemoveFavorite = async (propertyId: number) => {
    try {
      await api.favorites.remove(propertyId);
      toast.success('Removido dos favoritos');
      fetchFavorites();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdatePropertyStatus = async (propertyId: number, status: 'available' | 'rented' | 'inactive') => {
    try {
      setUpdatingStatus(propertyId);
      await api.properties.updateStatus(propertyId, status);
      toast.success(`Imóvel marcado como ${status === 'rented' ? 'arrendado' : status === 'available' ? 'disponível' : 'inativo'}`);
      fetchMyProperties();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdatingStatus(null);
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

  const handleEditProperty = (property: any) => {
    setEditingProperty(property);
    setEditForm({
      title: property.title,
      description: property.description || '',
      price: property.price,
      location: property.location,
      district: property.district,
      type: property.type,
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      area: property.area || 0,
    });
    setShowEditDialog(true);
  };

  const handleSaveProperty = async () => {
    if (!editingProperty) return;
    
    try {
      setSaving(true);
      await api.properties.update(editingProperty.id, editForm);
      toast.success('Imóvel atualizado com sucesso!');
      setShowEditDialog(false);
      fetchMyProperties();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProperty = (property: any) => {
    setEditingProperty(property);
    setShowDeleteDialog(true);
  };

  const confirmDeleteProperty = async () => {
    if (!editingProperty) return;
    
    try {
      setDeleting(true);
      await api.admin.deleteProperty(editingProperty.id);
      toast.success('Imóvel removido com sucesso!');
      setShowDeleteDialog(false);
      fetchMyProperties();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
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
                      <div className="grid grid-cols-1 gap-4">
                        {myProperties.length === 0 ? (
                          <p className="text-gray-500 italic">Não possui imóveis publicados.</p>
                        ) : (
                          myProperties.map((property: any) => (
                            <Card key={property.id} className="overflow-hidden">
                              <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-48 h-48 md:h-auto bg-gray-100 relative">
                                  {property.imageUrl ? (
                                    <img 
                                      src={property.imageUrl} 
                                      alt={property.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      <Home className="w-12 h-12" />
                                    </div>
                                  )}
                                  <Badge className={`absolute top-2 left-2 ${
                                    property.status === 'rented' ? 'bg-red-100 text-red-700' :
                                    property.status === 'available' ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {property.status === 'rented' ? 'Arrendado' :
                                     property.status === 'available' ? 'Disponível' : 'Inativo'}
                                  </Badge>
                                </div>
                                <div className="flex-1 p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-bold text-lg">{property.title}</h4>
                                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                        <MapPin className="w-4 h-4" />
                                        {property.district}
                                      </div>
                                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                          <BedDouble className="w-4 h-4" /> {property.bedrooms || 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Bath className="w-4 h-4" /> {property.bathrooms || 0}
                                        </span>
                                        {property.area && <span>{property.area}m²</span>}
                                      </div>
                                    </div>
                                    <p className="font-bold text-blue-900 text-lg">
                                      {property.price?.toLocaleString('pt-AO')} Kz
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                    <div className="text-sm text-gray-500">
                                      {property.favoritesCount > 0 && (
                                        <span className="flex items-center gap-1">
                                          <Heart className="w-4 h-4 text-red-500" /> 
                                          {property.favoritesCount} favoritos
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex gap-2">
                                      {property.status !== 'rented' && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-green-600 border-green-600 hover:bg-green-50"
                                          onClick={() => handleUpdatePropertyStatus(property.id, 'rented')}
                                          disabled={updatingStatus === property.id}
                                        >
                                          <CheckCircle className="w-4 h-4 mr-1" />
                                          {updatingStatus === property.id ? '...' : 'Marcar Arrendado'}
                                        </Button>
                                      )}
                                      {property.status === 'rented' && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                          onClick={() => handleUpdatePropertyStatus(property.id, 'available')}
                                          disabled={updatingStatus === property.id}
                                        >
                                          <XCircle className="w-4 h-4 mr-1" />
                                          {updatingStatus === property.id ? '...' : 'Marcar Disponível'}
                                        </Button>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditProperty(property)}
                                      >
                                        <Edit3 className="w-4 h-4 mr-1" /> Editar
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDeleteProperty(property)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
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
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Os meus favoritos
                      </h3>
                      <span className="text-sm text-gray-500">{favorites.length} imóvel(is)</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {favorites.length === 0 ? (
                        <Card className="p-8 text-center">
                          <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">Não tem imóveis nos favoritos.</p>
                          <p className="text-sm text-gray-400 mt-1">Clique no coração nos imóveis para adicionar</p>
                          <Button 
                            onClick={() => navigate('/properties')} 
                            className="mt-4 bg-blue-900"
                          >
                            Explorar Imóveis
                          </Button>
                        </Card>
                      ) : (
                        favorites.map((fav: any) => (
                          <Card key={fav.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                              <div className="w-full md:w-48 h-48 md:h-auto bg-gray-100 relative">
                                {fav.imageUrl ? (
                                  <img 
                                    src={fav.imageUrl} 
                                    alt={fav.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Home className="w-12 h-12" />
                                  </div>
                                )}
                                <Badge className={`absolute top-2 left-2 ${
                                  fav.status === 'rented' ? 'bg-red-100 text-red-700' :
                                  fav.status === 'available' ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {fav.status === 'rented' ? 'Arrendado' :
                                   fav.status === 'available' ? 'Disponível' : 'Inativo'}
                                </Badge>
                              </div>
                              <div className="flex-1 p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-bold text-lg">{fav.title}</h4>
                                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                      <MapPin className="w-4 h-4" />
                                      {fav.district}
                                    </div>
                                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                                      <span className="flex items-center gap-1">
                                        <BedDouble className="w-4 h-4" /> {fav.bedrooms || 0}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Bath className="w-4 h-4" /> {fav.bathrooms || 0}
                                      </span>
                                      {fav.area && <span>{fav.area}m²</span>}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                      Proprietário: {fav.landlordFirstName} {fav.landlordLastName}
                                    </p>
                                  </div>
                                  <p className="font-bold text-blue-900 text-lg">
                                    {fav.price?.toLocaleString('pt-AO')} Kz
                                  </p>
                                </div>
                                
                                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => navigate(`/property/${fav.propertyId}`)}
                                  >
                                    Ver Detalhes
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRemoveFavorite(fav.propertyId)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-1" /> Remover
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            )}
          </div>
        </div>
      </div>

      {/* Edit Property Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" />
              Editar Imóvel
            </DialogTitle>
            <DialogDescription>
              Modifique as informações do seu imóvel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Título do imóvel"
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Descrição do imóvel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preço (Kz)</Label>
                <Input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                  placeholder="Preço"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="apartment">Apartamento</option>
                  <option value="house">Casa</option>
                  <option value="commercial">Comercial</option>
                  <option value="land">Terreno</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quartos</Label>
                <Input
                  type="number"
                  value={editForm.bedrooms}
                  onChange={(e) => setEditForm({ ...editForm, bedrooms: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Casas de Banho</Label>
                <Input
                  type="number"
                  value={editForm.bathrooms}
                  onChange={(e) => setEditForm({ ...editForm, bathrooms: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Área (m²)</Label>
              <Input
                type="number"
                value={editForm.area}
                onChange={(e) => setEditForm({ ...editForm, area: Number(e.target.value) })}
                placeholder="Área em metros quadrados"
              />
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={saving}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" /> Cancelar
              </Button>
              <Button
                onClick={handleSaveProperty}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Property Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Remover Imóvel
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este imóvel? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {editingProperty && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{editingProperty.title}</p>
              <p className="text-sm text-gray-500">{editingProperty.district} - {editingProperty.price?.toLocaleString('pt-AO')} Kz</p>
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
              onClick={confirmDeleteProperty}
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
