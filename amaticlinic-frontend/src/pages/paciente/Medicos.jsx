// src/pages/paciente/Medicos.jsx - VERSIÓN MEJORADA
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Search, 
  Star, 
  MapPin, 
  Calendar,
  Stethoscope,
  LogOut,
  Briefcase,
  AlertCircle
} from 'lucide-react';

const Medicos = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [medicos, setMedicos] = useState([]);
  const [medicosFiltrados, setMedicosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState('Todas');

  useEffect(() => {
    cargarMedicos();
  }, []);

  useEffect(() => {
    filtrarMedicos();
  }, [busqueda, especialidadSeleccionada, medicos]);

  const cargarMedicos = async () => {
    try {
      setError(null);
      console.log('Cargando médicos...');
      
      const response = await api.get('/medicos');
      console.log('Médicos recibidos:', response.data);
      
      setMedicos(response.data);
      setMedicosFiltrados(response.data);
    } catch (error) {
      console.error('Error al cargar médicos:', error);
      
      if (error.response?.status === 403) {
        setError('No tienes permisos para ver los médicos. Por favor contacta al administrador.');
      } else if (error.response?.status === 401) {
        setError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        setTimeout(() => logout(), 2000);
      } else {
        setError('No se pudieron cargar los médicos. Por favor intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const filtrarMedicos = () => {
    let resultado = [...medicos];

    // Filtrar por búsqueda
    if (busqueda) {
      resultado = resultado.filter(medico =>
        medico.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        medico.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
        medico.especialidad.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtrar por especialidad
    if (especialidadSeleccionada !== 'Todas') {
      resultado = resultado.filter(medico =>
        medico.especialidad === especialidadSeleccionada
      );
    }

    setMedicosFiltrados(resultado);
  };

  const especialidades = ['Todas', ...new Set(medicos.map(m => m.especialidad))];

  const handleAgendarCita = (medicoId) => {
    navigate('/paciente/agendar', { state: { medicoId } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando médicos...</p>
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
              <Link to="/paciente/mis-citas" className="text-gray-600 hover:text-gray-900">
                Mis Citas
              </Link>
              <Link to="/paciente/medicos" className="text-primary font-medium">
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
            Nuestros Médicos
          </h1>
          <p className="text-gray-600">
            Encuentra al especialista que necesitas
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">{error}</p>
              <button
                onClick={cargarMedicos}
                className="text-red-600 hover:text-red-700 underline text-sm mt-2"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Filtros */}
        {!error && medicos.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nombre o especialidad..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Filtro de Especialidad */}
              <select
                value={especialidadSeleccionada}
                onChange={(e) => setEspecialidadSeleccionada(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {especialidades.map((esp) => (
                  <option key={esp} value={esp}>
                    {esp === 'Todas' ? 'Todas las especialidades' : esp}
                  </option>
                ))}
              </select>
            </div>

            {/* Resultados */}
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {medicosFiltrados.length} de {medicos.length} médicos
            </div>
          </div>
        )}

        {/* Grid de Médicos */}
        {!error && (
          <>
            {medicosFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {medicos.length === 0 
                    ? 'No hay médicos disponibles en este momento'
                    : 'No se encontraron médicos con los filtros aplicados'}
                </p>
                {medicos.length > 0 && (
                  <button
                    onClick={() => {
                      setBusqueda('');
                      setEspecialidadSeleccionada('Todas');
                    }}
                    className="mt-4 text-primary hover:underline"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {medicosFiltrados.map((medico) => (
                  <div
                    key={medico.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    {/* Avatar */}
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-primary">
                          {medico.nombre.charAt(0)}{medico.apellido.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                          Dr. {medico.nombre} {medico.apellido}
                        </h3>
                        <p className="text-primary font-medium">
                          {medico.especialidad}
                        </p>
                      </div>
                    </div>

                    {/* Información */}
                    <div className="space-y-2 mb-4">
                      {/* Experiencia */}
                      {medico.anosExperiencia && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase size={16} className="mr-2 text-gray-400" />
                          <span>{medico.anosExperiencia} años de experiencia</span>
                        </div>
                      )}

                      {/* Consultorio */}
                      {medico.consultorio && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin size={16} className="mr-2 text-gray-400" />
                          <span>Consultorio {medico.consultorio}</span>
                        </div>
                      )}

                      {/* Rating */}
                      <div className="flex items-center text-sm">
                        <Star size={16} className="mr-2 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-gray-800">
                          {medico.rating || '5.0'}
                        </span>
                        <span className="text-gray-500 ml-1">/5.0</span>
                      </div>
                    </div>

                    {/* Descripción */}
                    {medico.descripcion && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {medico.descripcion}
                      </p>
                    )}

                    {/* Botón de Agendar */}
                    <button
                      onClick={() => handleAgendarCita(medico.id)}
                      className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                      <Calendar size={18} />
                      <span>Agendar Cita</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Medicos;