import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useSearchParams } from 'react-router';
import { Search as SearchIcon, SlidersHorizontal, Grid, List, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { PropertyCard } from '../components/property-card';
import { mockProperties, districts, propertyTypes } from '../lib/mock-data';
import { Badge } from '../components/ui/badge';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('location') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || 'all');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [bedrooms, setBedrooms] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredProperties = useMemo(() => {
    let filtered = mockProperties;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter((p) => p.type === selectedType);
    }

    // Filter by district
    if (selectedDistrict !== 'all') {
      filtered = filtered.filter((p) => p.district === selectedDistrict);
    }

    // Filter by price range
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by bedrooms
    if (bedrooms !== 'all') {
      filtered = filtered.filter((p) => p.bedrooms === parseInt(bedrooms));
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'date':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      default:
        break;
    }

    return filtered;
  }, [searchTerm, selectedType, selectedDistrict, priceRange, bedrooms, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedDistrict('all');
    setPriceRange([0, 1000000]);
    setBedrooms('all');
    setSearchParams({});
  };

  const activeFiltersCount = 
    (searchTerm ? 1 : 0) +
    (selectedType !== 'all' ? 1 : 0) +
    (selectedDistrict !== 'all' ? 1 : 0) +
    (bedrooms !== 'all' ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== 1000000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-900 to-green-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Encontre o seu imóvel ideal</h1>
          <p className="text-lg text-gray-100">
            {filteredProperties.length} imóveis disponíveis
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filtros</h2>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Limpar ({activeFiltersCount})
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label>Pesquisar</Label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Localização, palavra-chave..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div className="space-y-2">
                  <Label>Tipo de Imóvel</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* District */}
                <div className="space-y-2">
                  <Label>Distrito</Label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os distritos</SelectItem>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <Label>Faixa de Preço</Label>
                  <Slider
                    min={0}
                    max={1000000}
                    step={10000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-4"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{priceRange[0].toLocaleString('pt-AO')} Kz</span>
                    <span>{priceRange[1].toLocaleString('pt-AO')} Kz</span>
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="space-y-2">
                  <Label>Quartos</Label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Qualquer quantidade</SelectItem>
                      <SelectItem value="1">1 quarto</SelectItem>
                      <SelectItem value="2">2 quartos</SelectItem>
                      <SelectItem value="3">3 quartos</SelectItem>
                      <SelectItem value="4">4 quartos</SelectItem>
                      <SelectItem value="5">5+ quartos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Mobile Filters */}
                  <Sheet>
                    <SheetTrigger asChild className="lg:hidden">
                      <Button variant="outline">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filtros
                        {activeFiltersCount > 0 && (
                          <Badge className="ml-2">{activeFiltersCount}</Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filtros de Pesquisa</SheetTitle>
                      </SheetHeader>
                      <div className="space-y-6 mt-6">
                        {/* Same filters as desktop sidebar */}
                        <div className="space-y-2">
                          <Label>Pesquisar</Label>
                          <Input
                            placeholder="Localização, palavra-chave..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Tipo de Imóvel</Label>
                          <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos os tipos</SelectItem>
                              {propertyTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Distrito</Label>
                          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos os distritos</SelectItem>
                              {districts.map((district) => (
                                <SelectItem key={district} value={district}>
                                  {district}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-4">
                          <Label>Faixa de Preço</Label>
                          <Slider
                            min={0}
                            max={1000000}
                            step={10000}
                            value={priceRange}
                            onValueChange={setPriceRange}
                          />
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{priceRange[0].toLocaleString('pt-AO')} Kz</span>
                            <span>{priceRange[1].toLocaleString('pt-AO')} Kz</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Quartos</Label>
                          <Select value={bedrooms} onValueChange={setBedrooms}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Qualquer quantidade</SelectItem>
                              <SelectItem value="1">1 quarto</SelectItem>
                              <SelectItem value="2">2 quartos</SelectItem>
                              <SelectItem value="3">3 quartos</SelectItem>
                              <SelectItem value="4">4 quartos</SelectItem>
                              <SelectItem value="5">5+ quartos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button onClick={clearFilters} variant="outline" className="w-full">
                          Limpar Filtros
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Mais recentes</SelectItem>
                      <SelectItem value="price-asc">Preço: Menor para maior</SelectItem>
                      <SelectItem value="price-desc">Preço: Maior para menor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum imóvel encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  Tente ajustar os filtros para ver mais resultados
                </p>
                <Button onClick={clearFilters}>Limpar Filtros</Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                    : 'space-y-6'
                }
              >
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
