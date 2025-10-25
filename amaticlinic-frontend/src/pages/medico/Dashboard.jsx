// src/pages/medico/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp,
  Stethoscope,
  LogOut,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const MedicoDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [citasHoy, setCitasHoy] = useState([]);
  const [proximasCitas, setProximasCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [idMedico, setIdMedico] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setError(null);
      
      // Obtener el ID del médico
      const responseMedicos = await api.get('/medicos');
      const medico = responseMedicos.data.find(m => m.idUsuario === user.id);
      
      if (medico) {
        setIdMedico(medico.id);
        
        // Cargar todas las citas del médico
        const responseCitas = await api.get(`/citas/medico/${medico.id}`);
        const todasCitas = responseCitas.data;
        
        // Filtrar citas de hoy
        const hoy = new Date().toISOString().split('T')[0];
        const citasDeHoy = todasCitas.filter(cita => 
          cita.fecha === hoy && cita.estado !== 'Cancelada'
        );
        setCitasHoy(citasDeHoy);
        
        // Próximas 5 citas
        const proximas = todasCitas
          .filter(cita => new Date(cita.fecha) >= new Date() && cita.estado !== 'Cancelada')
          .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
          .slice(0, 5);
        setProximasCitas(proximas);
        
        // Calcular estadísticas
        const citasPendientes = todasCitas.filter(c => 
          c.estado === 'Agendada' && new Date(c.fecha) >= new Date()
        ).length;
        
        const citasCompletadas = todasCitas.filter(c => 
          c.estado === 'Completada'
        ).length;
        
        const pacientesUnicos = new Set(todasCitas.map(c => c.idPaciente)).size;
        
        const citasEsteMes = todasCitas.filter(c => {
          const fecha = new Date(c.fecha);
          const hoy = new Date();
          return fecha.getMonth() === hoy.getMonth() && 
                 fecha.getFullYear() === hoy.getFullYear();
        }).length;
        
        setStats({
          citasHoy: citasDeHoy.length,
          citasPendientes,
          pacientesAtendidos: pacientesUnicos,
          citasEsteMes
        });
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('No se pudieron cargar los datos del dashboard');
      setStats({
        citasHoy: 0,
        citasPendientes: 0,
        pacientesAtendidos: 0,
        citasEsteMes: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado) => {
    const estilos = {
      Agendada: 'bg-blue-100 text-blue-800',
      Completada: 'bg-green-100 text-green-800',
      Cancelada: 'bg-red-100 text-red-800',
    };
    return estilos[estado] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-gray-800">AmatiClinic</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link to="/medico/dashboard" className="text-primary font-medium">
                Inicio
              </Link>
              <Link to="/medico/citas" className="text-gray-600 hover:text-gray-900">
                Mis Citas
              </Link>
              <Link to="/medico/pacientes" className="text-gray-600 hover:text-gray-900">
                Pacientes
              </Link>
              <Link to="/medico/historial" className="text-gray-600 hover:text-gray-900">
                Historial
              </Link>
              
              <div className="border-l pl-6 flex items-center space-x-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-800">Dr. {user.nombre}</p>
                  <p className="text-gray-500">{user.rol}</p>
                </div>
                <button onClick={logout} className="text-gray-600 hover:text-red-600" title="Cerrar sesión">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bienvenido, Dr. {user.nombre} {user.apellido}
          </h1>
          <p className="text-gray-600">
            Resumen de tu agenda médica
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        {/* Tarjetas de Estadísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Citas Hoy */}
            <div className="card-stat border-l-4 border-primary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Citas Hoy
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.citasHoy}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            {/* Citas Pendientes */}
            <div className="card-stat border-l-4 border-warning">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Citas Pendientes
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.citasPendientes}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
              </div>
            </div>

            {/* Pacientes Atendidos */}
            <div className="card-stat border-l-4 border-success">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Pacientes Atendidos
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.pacientesAtendidos}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-success" />
                </div>
              </div>
            </div>

            {/* Citas Este Mes */}
            <div className="card-stat border-l-4 border-purple">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Citas Este Mes
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.citasEsteMes}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-purple" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Citas de Hoy */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Calendar className="mr-2 text-primary" size={24} />
                Citas de Hoy
              </h2>
              <Link to="/medico/citas" className="text-primary hover:underline text-sm">
                Ver todas
              </Link>
            </div>

            {citasHoy.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No tienes citas programadas para hoy</p>
              </div>
            ) : (
              <div className="space-y-3">
                {citasHoy.map((cita) => (
                  <div key={cita.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{cita.nombrePaciente}</p>
                        <p className="text-sm text-gray-500">
                          {cita.horaInicio} - {cita.horaFin}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(cita.estado)}`}>
                      {cita.estado}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Próximas Citas */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <AlertCircle className="mr-2 text-success" size={24} />
                Próximas Citas
              </h2>
            </div>

            {proximasCitas.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No tienes citas próximas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {proximasCitas.map((cita) => (
                  <div key={cita.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-success/10 p-2 rounded-full">
                        <Users className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{cita.nombrePaciente}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-GT', { 
                            day: 'numeric', 
                            month: 'short' 
                          })} • {cita.horaInicio}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/medico/citas" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  Mis Citas
                </h3>
                <p className="text-gray-600 text-sm">
                  Ver todas tus citas médicas
                </p>
              </div>
            </div>
          </Link>

          <Link to="/medico/pacientes" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-success/10 p-4 rounded-full">
                <Users className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  Pacientes
                </h3>
                <p className="text-gray-600 text-sm">
                  Ver tus pacientes
                </p>
              </div>
            </div>
          </Link>

          <Link to="/medico/historial" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-purple/10 p-4 rounded-full">
                <FileText className="w-8 h-8 text-purple" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  Historial
                </h3>
                <p className="text-gray-600 text-sm">
                  Gestionar historiales médicos
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MedicoDashboard;