// src/pages/recepcionista/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Calendar, 
  Users, 
  UserCog, 
  TrendingUp,
  Stethoscope,
  LogOut,
  Clock,
  CheckCircle,
  ClipboardList
} from 'lucide-react';

const RecepcionistaDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [citasHoy, setCitasHoy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setError(null);
      
      // Cargar todas las citas
      const responseCitas = await api.get('/citas');
      const todasCitas = responseCitas.data;
      
      // Cargar médicos y pacientes
      const responseMedicos = await api.get('/medicos');
      const responsePacientes = await api.get('/pacientes');
      
      // Filtrar citas de hoy
      const hoy = new Date().toISOString().split('T')[0];
      const citasDeHoy = todasCitas.filter(cita => cita.fecha === hoy);
      setCitasHoy(citasDeHoy);
      
      // Calcular estadísticas
      const citasPendientes = todasCitas.filter(c => 
        c.estado === 'Agendada' && new Date(c.fecha) >= new Date()
      ).length;
      
      const citasEsteMes = todasCitas.filter(c => {
        const fecha = new Date(c.fecha);
        const hoy = new Date();
        return fecha.getMonth() === hoy.getMonth() && 
               fecha.getFullYear() === hoy.getFullYear();
      }).length;
      
      setStats({
        citasHoy: citasDeHoy.length,
        citasPendientes,
        totalMedicos: responseMedicos.data.length,
        totalPacientes: responsePacientes.data.length,
        citasEsteMes
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('No se pudieron cargar los datos del dashboard');
      setStats({
        citasHoy: 0,
        citasPendientes: 0,
        totalMedicos: 0,
        totalPacientes: 0,
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
      Modificada: 'bg-yellow-100 text-yellow-800',
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
              <Link to="/recepcionista/dashboard" className="text-primary font-medium">
                Inicio
              </Link>
              <Link to="/recepcionista/citas" className="text-gray-600 hover:text-gray-900">
                Citas
              </Link>
              <Link to="/recepcionista/medicos" className="text-gray-600 hover:text-gray-900">
                Médicos
              </Link>
              <Link to="/recepcionista/horarios" className="text-gray-600 hover:text-gray-900">
              Horarios
              </Link>
              <Link to="/recepcionista/pacientes" className="text-gray-600 hover:text-gray-900">
                Pacientes
              </Link>
              
              <div className="border-l pl-6 flex items-center space-x-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-800">{user.nombre}</p>
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
            Bienvenida, {user.nombre} {user.apellido}
          </h1>
          <p className="text-gray-600">
            Panel de control - Gestión de la clínica
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                    Pendientes
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

            {/* Total Médicos */}
            <div className="card-stat border-l-4 border-success">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Médicos
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.totalMedicos}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <UserCog className="w-6 h-6 text-success" />
                </div>
              </div>
            </div>

            {/* Total Pacientes */}
            <div className="card-stat border-l-4 border-purple">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Pacientes
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.totalPacientes}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-purple" />
                </div>
              </div>
            </div>

            {/* Citas Este Mes */}
            <div className="card-stat border-l-4 border-red-400">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Este Mes
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.citasEsteMes}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Citas de Hoy */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <Calendar className="mr-3 text-primary" size={28} />
              Citas de Hoy
            </h2>
            <Link to="/recepcionista/citas" className="text-primary hover:underline text-sm font-medium">
              Ver todas las citas
            </Link>
          </div>

          {citasHoy.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay citas programadas para hoy</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Hora</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Paciente</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Médico</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Especialidad</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {citasHoy.map((cita) => (
                    <tr key={cita.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-800">{cita.horaInicio}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-800">{cita.nombrePaciente}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-800">Dr. {cita.nombreMedico}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-600">{cita.especialidad}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(cita.estado)}`}>
                          {cita.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Accesos Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/recepcionista/citas" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <ClipboardList className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  Gestionar Citas
                </h3>
                <p className="text-gray-600 text-sm">
                  Ver, crear y modificar
                </p>
              </div>
            </div>
          </Link>

          <Link to="/recepcionista/medicos" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-success/10 p-4 rounded-full">
                <UserCog className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  Médicos
                </h3>
                <p className="text-gray-600 text-sm">
                  Administrar médicos
                </p>
              </div>
            </div>
          </Link>

          <Link to="/recepcionista/pacientes" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-purple/10 p-4 rounded-full">
                <Users className="w-8 h-8 text-purple" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  Pacientes
                </h3>
                <p className="text-gray-600 text-sm">
                  Ver pacientes
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecepcionistaDashboard;
