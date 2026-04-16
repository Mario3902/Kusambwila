import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export function AdminSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Painel de Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Esta secção será expandida com configurações do sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
