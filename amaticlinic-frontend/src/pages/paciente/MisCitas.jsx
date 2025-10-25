// src/pages/paciente/MisCitas.jsx - VERSIÓN MEJORADA CON DEBUGGING
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Calendar,
  Clock,
  User,
  MapPin,
  FileText,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Stethoscope,
  LogOut,
  Filter
} from 'lucide-react';

const MisCitas = () => {
  const { user, logout } = useAuth();
  
  const [citas, setCitas] = useState([]);
  const [citasFiltradas, setCitasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todas');
  const [idPaciente, setIdPaciente] = useState(null);

  useEffect(() => {
    cargarCitas();
  }, []);

  useEffect(() => {
    filtrarCitas();
  }, [filtro, citas]);

  const cargarCitas = async () => {
    try {
      setError(null);
      console.log('👤 Usuario logueado:', user);
      
      // Obtener ID del paciente
      console.log('📡 Obteniendo lista de pacientes...');
      const responsePacientes = await api.get('/pacientes');
      console.log('✅ Pacientes recibidos:', responsePacientes.data);
      
      const paciente = responsePacientes.data.find(p => p.idUsuario === user.id);
      console.log('🔍 Paciente encontrado:', paciente);
      
      if (paciente) {
        setIdPaciente(paciente.id);
        
        // Obtener citas del paciente
        console.log(`📡 Obteniendo citas del paciente ID: ${paciente.id}`);
        const responseCitas = await api.get(`/citas/paciente/${paciente.id}`);
        console.log('✅ Citas recibidas:', responseCitas.data);
        
        if (responseCitas.data.length === 0) {
          console.log('⚠️ No se encontraron citas para este paciente');
        }
        
        setCitas(responseCitas.data);
      } else {
        console.error('❌ No se encontró paciente para el usuario:', user.id);
        setError('No se pudo encontrar tu información de paciente. Por favor contacta a recepción.');
      }
    } catch (error) {
      console.error('❌ Error al cargar citas:', error);
      console.error('Detalles del error:', error.response?.data);
      setError(`Error al cargar las citas: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filtrarCitas = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let resultado = [...citas];

    switch (filtro) {
      case 'proximas':
        resultado = resultado.filter(cita => {
          const fechaCita = new Date(cita.fecha);
          return fechaCita >= hoy && cita.estado !== 'Cancelada';
        });
        break;
      case 'pasadas':
        resultado = resultado.filter(cita => {
          const fechaCita = new Date(cita.fecha);
          return fechaCita < hoy;
        });
        break;
      case 'canceladas':
        resultado = resultado.filter(cita => cita.estado === 'Cancelada');
        break;
      default:
        break;
    }

    resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    setCitasFiltradas(resultado);
    
    console.log(`📊 Citas filtradas (${filtro}):`, resultado.length);
  };

  const cancelarCita = async (idCita) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      return;
    }

    try {
      await api.put(`/citas/${idCita}/cancelar`);
      alert('Cita cancelada exitosamente');
      cargarCitas();
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      alert('Error al cancelar la cita');
    }
  };

  const getEstadoBadge = (estado) => {
    const estilos = {
      Agendada: 'bg-blue-100 text-blue-800',
      Completada: 'bg-green-100 text-green-800',
      Cancelada: 'bg-red-100 text-red-800',
      Modificada: 'bg-yellow-100 text-yellow-800',
    };

    const iconos = {
      Agendada: <CheckCircle size={16} />,
      Completada: <CheckCircle size={16} />,
      Cancelada: <XCircle size={16} />,
      Modificada: <AlertCircle size={16} />,
    };

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${estilos[estado] || 'bg-gray-100 text-gray-800'}`}>
        {iconos[estado]}
        <span>{estado}</span>
      </span>
    );
  };

  const contarPorEstado = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return {
      todas: citas.length,
      proximas: citas.filter(c => new Date(c.fecha) >= hoy && c.estado !== 'Cancelada').length,
      pasadas: citas.filter(c => new Date(c.fecha) < hoy).length,
      canceladas: citas.filter(c => c.estado === 'Cancelada').length,
    };
  };

  const contadores = contarPorEstado();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus citas...</p>
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
              <Link to="/paciente/dashboard" className="text-gray-600 hover:text-gray-900">
                Inicio
              </Link>
              <Link to="/paciente/agendar" className="text-gray-600 hover:text-gray-900">
                Agendar Cita
              </Link>
              <Link to="/paciente/mis-citas" className="text-primary font-medium">
                Mis Citas
              </Link>
              <Link to="/paciente/medicos" className="text-gray-600 hover:text-gray-900">
                Médicos
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
            Mis Citas Médicas
          </h1>
          <p className="text-gray-600">
            Gestiona y consulta todas tus citas
          </p>
          {idPaciente && (
            <p className="text-xs text-gray-400 mt-1">
              ID Paciente: {idPaciente} | Usuario ID: {user.id}
            </p>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={cargarCitas}
              className="mt-2 text-red-600 hover:text-red-700 underline text-sm"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Filtrar por:</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setFiltro('todas')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                filtro === 'todas'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <p className="text-2xl font-bold">{contadores.todas}</p>
              <p className="text-sm">Todas</p>
            </button>

            <button
              onClick={() => setFiltro('proximas')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                filtro === 'proximas'
                  ? 'border-success bg-success/5 text-success'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <p className="text-2xl font-bold">{contadores.proximas}</p>
              <p className="text-sm">Próximas</p>
            </button>

            <button
              onClick={() => setFiltro('pasadas')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                filtro === 'pasadas'
                  ? 'border-gray-400 bg-gray-50 text-gray-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <p className="text-2xl font-bold">{contadores.pasadas}</p>
              <p className="text-sm">Pasadas</p>
            </button>

            <button
              onClick={() => setFiltro('canceladas')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                filtro === 'canceladas'
                  ? 'border-red-400 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <p className="text-2xl font-bold">{contadores.canceladas}</p>
              <p className="text-sm">Canceladas</p>
            </button>
          </div>
        </div>

        {/* Lista de Citas */}
        {citasFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              {citas.length === 0 
                ? 'Aún no tienes citas médicas agendadas'
                : `No tienes citas ${filtro !== 'todas' ? filtro : ''}`}
            </p>
            {citas.length === 0 && (
              <Link to="/paciente/agendar" className="btn-primary inline-flex items-center">
                <Calendar className="mr-2" size={18} />
                Agendar Nueva Cita
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {citasFiltradas.map((cita) => (
              <div
                key={cita.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          Dr. {cita.nombreMedico}
                        </h3>
                        <p className="text-primary font-medium">{cita.especialidad}</p>
                      </div>
                      {getEstadoBadge(cita.estado)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Fecha</p>
                          <p className="font-medium text-gray-800">
                            {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-GT', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Horario</p>
                          <p className="font-medium text-gray-800">
                            {cita.horaInicio} - {cita.horaFin}
                          </p>
                        </div>
                      </div>

                      {cita.consultorio && (
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Consultorio</p>
                            <p className="font-medium text-gray-800">
                              {cita.consultorio}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {cita.motivoConsulta && (
                      <div className="flex items-start space-x-3 mt-4 pt-4 border-t">
                        <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 mb-1">Motivo de Consulta</p>
                          <p className="text-gray-700">{cita.motivoConsulta}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {cita.estado === 'Agendada' && new Date(cita.fecha) >= new Date() && (
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <button
                        onClick={() => cancelarCita(cita.id)}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
                      >
                        <X size={18} />
                        <span>Cancelar Cita</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisCitas;