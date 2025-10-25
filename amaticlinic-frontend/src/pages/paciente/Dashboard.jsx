// src/pages/paciente/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp,
  Plus,
  Stethoscope,
  LogOut
} from 'lucide-react';

const PacienteDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [idPaciente, setIdPaciente] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setError(null);
      
      // Primero obtener el ID del paciente
      const responsePacientes = await api.get('/pacientes');
      const paciente = responsePacientes.data.find(p => p.idUsuario === user.id);
      
      if (paciente) {
        setIdPaciente(paciente.id);
        
        // Intentar obtener estadísticas
        try {
          const responseStats = await api.get(`/estadisticas/paciente/${paciente.id}`);
          setStats(responseStats.data);
        } catch (statsError) {
          // Si no hay endpoint de estadísticas, usar valores por defecto
          console.log('No hay estadísticas disponibles, usando valores por defecto');
          setStats({
            citasProgramadas: 0,
            diasProximaCita: '-',
            medicosDisponibles: 0,
            citasEsteMes: 0
          });
        }
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('No se pudieron cargar los datos del dashboard');
      // Establecer valores por defecto en caso de error
      setStats({
        citasProgramadas: 0,
        diasProximaCita: '-',
        medicosDisponibles: 0,
        citasEsteMes: 0
      });
    } finally {
      setLoading(false);
    }
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
              <Link 
                to="/paciente/dashboard" 
                className="text-primary font-medium"
              >
                Inicio
              </Link>
              <Link 
                to="/paciente/agendar" 
                className="text-gray-600 hover:text-gray-900"
              >
                Agendar Cita
              </Link>
              <Link 
                to="/paciente/mis-citas" 
                className="text-gray-600 hover:text-gray-900"
              >
                Mis Citas
              </Link>
              <Link 
                to="/paciente/medicos" 
                className="text-gray-600 hover:text-gray-900"
              >
                Médicos
              </Link>
              
              <div className="border-l pl-6 flex items-center space-x-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-800">{user.nombre}</p>
                  <p className="text-gray-500">{user.rol}</p>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600"
                  title="Cerrar sesión"
                >
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
            Bienvenido, {user.nombre} {user.apellido}
          </h1>
          <p className="text-gray-600">
            Gestiona tus citas médicas y consulta tu información de salud
          </p>
        </div>

        {/* Error message si existe */}
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        {/* Botón de Acción Rápida */}
        <div className="mb-8">
          <Link
            to="/paciente/agendar"
            className="inline-flex items-center space-x-2 btn-primary py-3 px-6 text-lg"
          >
            <Plus size={24} />
            <span>Agendar Nueva Cita</span>
          </Link>
        </div>

        {/* Tarjetas de Estadísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Citas Programadas */}
            <div className="card-stat border-l-4 border-primary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Citas Programadas
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.citasProgramadas || 0}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            {/* Próxima Cita */}
            <div className="card-stat border-l-4 border-success">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Próxima Cita
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.diasProximaCita !== null && stats.diasProximaCita !== '-' 
                      ? `${stats.diasProximaCita} días` 
                      : 'Sin citas'}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-success" />
                </div>
              </div>
            </div>

            {/* Médicos Disponibles */}
            <div className="card-stat border-l-4 border-purple">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Médicos Disponibles
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.medicosDisponibles || 0}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-purple" />
                </div>
              </div>
            </div>

            {/* Citas Este Mes */}
            <div className="card-stat border-l-4 border-warning">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Citas Este Mes
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.citasEsteMes || 0}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-warning" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accesos Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/paciente/agendar"
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  Agendar Cita
                </h3>
                <p className="text-gray-600 text-sm">
                  Reserva una cita con un médico
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/paciente/mis-citas"
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-success/10 p-4 rounded-full">
                <Clock className="w-8 h-8 text-success" />
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

          <Link
            to="/paciente/medicos"
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple/10 p-4 rounded-full">
                <Users className="w-8 h-8 text-purple" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  Médicos
                </h3>
                <p className="text-gray-600 text-sm">
                  Buscar médicos disponibles
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PacienteDashboard;