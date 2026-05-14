import { useAuth } from '../context/AuthContext';
import MasterDashboard from '../components/dashboard/MasterDashboard';
import ResponsibleDashboard from '../components/dashboard/ResponsibleDashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  return user?.role === 'master' ? <MasterDashboard /> : <ResponsibleDashboard />;
}
