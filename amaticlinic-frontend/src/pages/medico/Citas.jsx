// src/pages/medico/Citas.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Filter,
  Stethoscope,
  LogOut,
  Phone,
  Mail
} from 'lucide-react';

const MedicoCitas = () => {
  const { user, logout } = useAuth();
  
  const [citas, setCitas] = useState([]);
  const [citasFiltradas, setCitasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas');
  const [idMedico, setIdMedico] = useState(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarCitas();
  }, []);

  useEffect(() => {
    filtrarCitas();
  }, [filtro, citas]);

  const cargarCitas = async () => {
    try {
      const responseMedicos = await api.get('/medicos');
      const medico = responseMedicos.data.find(m => m.idUsuario === user.id);
      
      if (medico) {
        setIdMedico(medico.id);
        const responseCitas = await api.get(`/citas/medico/${medico.id}`);
        setCitas(responseCitas.data);
      }
    } catch (error) {
      console.error('Error al cargar citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarCitas = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let resultado = [...citas];

    switch (filtro) {
      case 'hoy':
        const hoyStr = hoy.toISOString().split('T')[0];
        resultado = resultado.filter(cita => cita.fecha === hoyStr);
        break;
      case 'proximas':
        resultado = resultado.filter(cita => {
          const fechaCita = new Date(cita.fecha);
          return fechaCita >= hoy && cita.estado !== 'Cancelada' && cita.estado !== 'Completada';
        });
        break;
      case 'completadas':
        resultado = resultado.filter(cita => cita.estado === 'Completada');
        break;
      case 'canceladas':
        resultado = resultado.filter(cita => cita.estado === 'Cancelada');
        break;
      default:
        break;
    }

    resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    setCitasFiltradas(resultado);
  };

  const completarCita = async (idCita) => {
    if (!window.confirm('¿Marcar esta cita como completada?')) return;

    try {
      await api.put(`/citas/${idCita}/completar`);
      alert('Cita completada exitosamente');
      cargarCitas();
    } catch (error) {
      console.error('Error al completar cita:', error);
      alert('Error al completar la cita');
    }
  };

  const verDetalle = (cita) => {
    setCitaSeleccionada(cita);
    setMostrarModal(true);
  };

  const getEstadoBadge = (estado) => {
    const estilos = {
      Agendada: 'bg-blue-100 text-blue-800',
      Completada: 'bg-green-100 text-green-800',
      Cancelada: 'bg-red-100 text-red-800',
    };
    return estilos[estado] || 'bg-gray-100 text-gray-800';
  };

  const contarPorEstado = () => ({
    todas: citas.length,
    hoy: citas.filter(c => c.fecha === new Date().toISOString().split('T')[0]).length,
    proximas: citas.filter(c => new Date(c.fecha) >= new Date() && c.estado !== 'Cancelada' && c.estado !== 'Completada').length,
    completadas: citas.filter(c => c.estado === 'Completada').length,
    canceladas: citas.filter(c => c.estado === 'Cancelada').length,
  });

  const contadores = contarPorEstado();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
              <Link to="/medico/dashboard" className="text-gray-600 hover:text-gray-900">
                Inicio
              </Link>
              <Link to="/medico/citas" className="text-primary font-medium">
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
                <button onClick={logout} className="text-gray-600 hover:text-red-600">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Citas</h1>
          <p className="text-gray-600">Gestiona tus consultas médicas</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Filtrar por:</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
              onClick={() => setFiltro('hoy')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                filtro === 'hoy'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <p className="text-2xl font-bold">{contadores.hoy}</p>
              <p className="text-sm">Hoy</p>
            </button>

            <button
              onClick={() => setFiltro('proximas')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                filtro === 'proximas'
                  ? 'border-warning bg-warning/5 text-warning'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <p className="text-2xl font-bold">{contadores.proximas}</p>
              <p className="text-sm">Próximas</p>
            </button>

            <button
              onClick={() => setFiltro('completadas')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                filtro === 'completadas'
                  ? 'border-success bg-success/5 text-success'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <p className="text-2xl font-bold">{contadores.completadas}</p>
              <p className="text-sm">Completadas</p>
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
            <p className="text-gray-500 text-lg">No hay citas {filtro !== 'todas' && filtro}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {citasFiltradas.map((cita) => (
              <div key={cita.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          {cita.nombrePaciente}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-1" />
                            {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-GT', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="flex items-center">
                            <Clock size={16} className="mr-1" />
                            {cita.horaInicio} - {cita.horaFin}
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoBadge(cita.estado)}`}>
                        {cita.estado}
                      </span>
                    </div>

                    {cita.motivoConsulta && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1 font-medium">Motivo de Consulta:</p>
                        <p className="text-gray-700">{cita.motivoConsulta}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => verDetalle(cita)}
                      className="btn-outline text-sm py-2"
                    >
                      Ver Detalle
                    </button>
                    {cita.estado === 'Agendada' && (
                      <button
                        onClick={() => completarCita(cita.id)}
                        className="btn-success text-sm py-2"
                      >
                        <CheckCircle size={16} className="inline mr-1" />
                        Completar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      {mostrarModal && citaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Detalle de Cita</h2>
                <button
                  onClick={() => setMostrarModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Paciente</p>
                    <p className="font-semibold text-gray-800">{citaSeleccionada.nombrePaciente}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Estado</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEstadoBadge(citaSeleccionada.estado)}`}>
                      {citaSeleccionada.estado}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-1">Fecha y Hora</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(citaSeleccionada.fecha + 'T00:00:00').toLocaleDateString('es-GT', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-gray-600">
                    {citaSeleccionada.horaInicio} - {citaSeleccionada.horaFin}
                  </p>
                </div>

                {citaSeleccionada.motivoConsulta && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-1">Motivo de Consulta</p>
                    <p className="text-gray-800">{citaSeleccionada.motivoConsulta}</p>
                  </div>
                )}

                <div className="border-t pt-4 flex space-x-4">
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="flex-1 btn-outline"
                  >
                    Cerrar
                  </button>
                  {citaSeleccionada.estado === 'Agendada' && (
                    <button
                      onClick={() => {
                        completarCita(citaSeleccionada.id);
                        setMostrarModal(false);
                      }}
                      className="flex-1 btn-success"
                    >
                      Completar Cita
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicoCitas;
