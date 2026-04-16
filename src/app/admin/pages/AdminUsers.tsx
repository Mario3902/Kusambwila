import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { api } from '../../lib/api';
import { VerificationBadge } from '../../components/verification-badge';
import { UserX, UserCheck } from 'lucide-react';

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Currently properties list landlordNames, but in real app we'd have /api/admin/users
    async function load() {
      try {
        const properties = await api.properties.getAll();
        // Extract unique landlords from properties for now as a mockup
        const uniqueLandlords = [];
        const seen = new Set();
        properties.forEach((p: any) => {
          if (p.landlordId && !seen.has(p.landlordId)) {
            seen.add(p.landlordId);
            uniqueLandlords.push({
              id: p.landlordId,
              name: p.landlordName,
              email: p.landlordEmail,
              verification: p.verification
            });
          }
        });
        setUsers(uniqueLandlords);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleVerify = async (userId: string, status: any) => {
    try {
      await api.admin.verifyUser(userId, status);
      // Refresh data
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando utilizadores...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Utilizadores</h1>
        <Badge variant="outline" className="text-blue-600">Total: {users.length}</Badge>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Verificação de Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilizador</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações de Verificação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u: any) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.verification?.verificationScore || 0}%</TableCell>
                  <TableCell>
                    <VerificationBadge 
                      isVerified={u.verification?.isVerified}
                      score={u.verification?.verificationScore}
                      biStatus={u.verification?.biStatus}
                      propertyTitleStatus={u.verification?.propertyTitleStatus}
                      size="sm"
                    />
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-green-600 hover:bg-green-50"
                      onClick={() => handleVerify(u.id, { isVerified: true, biStatus: 'verified', propertyTitleStatus: 'verified', verificationScore: 100 })}
                    >
                      <UserCheck className="w-4 h-4 mr-1" /> Aprovar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleVerify(u.id, { isVerified: false, biStatus: 'rejected', propertyTitleStatus: 'rejected', verificationScore: 0 })}
                    >
                      <UserX className="w-4 h-4 mr-1" /> Rejeitar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
