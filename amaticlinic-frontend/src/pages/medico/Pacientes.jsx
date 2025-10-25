// src/pages/medico/Pacientes.jsx - CORREGIDO
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Search,
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  Stethoscope,
  LogOut,
  MapPin
} from 'lucide-react';

const MedicoPacientes = () => {
  const { user, logout } = useAuth();
  
  const [pacientes, setPacientes] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [idMedico, setIdMedico] = useState(null);

  useEffect(() => {
    cargarPacientes();
  }, []);

  useEffect(() => {
    filtrarPacientes();
  }, [busqueda, pacientes]);

  const cargarPacientes = async () => {
    try {
      // Obtener ID del médico
      const responseMedicos = await api.get('/medicos');
      const medico = responseMedicos.data.find(m => m.idUsuario === user.id);
      
      if (medico) {
        setIdMedico(medico.id);
        
        // Obtener citas del médico
        const responseCitas = await api.get(`/citas/medico/${medico.id}`);
        
        // Extraer pacientes únicos de las citas
        const idsUnicos = [...new Set(responseCitas.data.map(c => c.idPaciente))];
        
        // Obtener info completa de cada paciente
        const todosPacientes = await api.get('/pacientes');
        const misPacientes = todosPacientes.data.filter(p => idsUnicos.includes(p.id));
        
        // Agregar conteo de citas
        const pacientesConCitas = misPacientes.map(paciente => {
          const citasPaciente = responseCitas.data.filter(c => c.idPaciente === paciente.id);
          return {
            ...paciente,
            totalCitas: citasPaciente.length,
            ultimaCita: citasPaciente.length > 0 
              ? citasPaciente.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0].fecha 
              : null
          };
        });
        
        setPacientes(pacientesConCitas);
        setPacientesFiltrados(pacientesConCitas);
      }
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarPacientes = () => {
    if (!busqueda) {
      setPacientesFiltrados(pacientes);
      return;
    }

    const busquedaLower = busqueda.toLowerCase();

    const resultado = pacientes.filter(paciente => {
      // Búsqueda segura que soporta ambos nombres de campo
      const nombre = (paciente.nombre || '').toLowerCase();
      const apellido = (paciente.apellido || '').toLowerCase();
      const dpi = (paciente.dpi || paciente.documentoIdentidad || '').toString();
      const correo = (paciente.correo || '').toLowerCase();
      
      return nombre.includes(busquedaLower) ||
             apellido.includes(busquedaLower) ||
             dpi.includes(busqueda) ||
             correo.includes(busquedaLower);
    });

    setPacientesFiltrados(resultado);
  };

  // Función para obtener el DPI (soporta ambos nombres)
  const obtenerDPI = (paciente) => {
    return paciente.dpi || paciente.documentoIdentidad || 'No registrado';
  };

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
              <Link to="/medico/citas" className="text-gray-600 hover:text-gray-900">
                Mis Citas
              </Link>
              <Link to="/medico/pacientes" className="text-primary font-medium">
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Pacientes</h1>
          <p className="text-gray-600">Pacientes que has atendido</p>
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre o DPI..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Mostrando {pacientesFiltrados.length} de {pacientes.length} pacientes
          </div>
        </div>

        {/* Grid de Pacientes */}
        {pacientesFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {pacientes.length === 0 
                ? 'Aún no has atendido pacientes'
                : 'No se encontraron pacientes con ese criterio'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pacientesFiltrados.map((paciente) => (
              <div key={paciente.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                {/* Avatar y nombre */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-success">
                      {paciente.nombre?.charAt(0) || '?'}{paciente.apellido?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {paciente.nombre} {paciente.apellido}
                    </h3>
                    <p className="text-sm text-gray-500">
                      DPI: {obtenerDPI(paciente)}
                    </p>
                  </div>
                </div>

                {/* Información */}
                <div className="space-y-2 mb-4">
                  {paciente.telefono && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone size={16} className="mr-2 text-gray-400" />
                      <span>{paciente.telefono}</span>
                    </div>
                  )}

                  {paciente.correo && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail size={16} className="mr-2 text-gray-400" />
                      <span className="truncate">{paciente.correo}</span>
                    </div>
                  )}

                  {paciente.direccion && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-2 text-gray-400" />
                      <span className="truncate">{paciente.direccion}</span>
                    </div>
                  )}
                </div>

                {/* Estadísticas */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total de citas:</span>
                    <span className="font-semibold text-gray-800">{paciente.totalCitas}</span>
                  </div>
                  {paciente.ultimaCita && (
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500">Última cita:</span>
                      <span className="font-semibold text-gray-800">
                        {new Date(paciente.ultimaCita + 'T00:00:00').toLocaleDateString('es-GT', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Acciones - CORREGIDO: ahora va a /medico/pacientes/:id */}
                <Link
                  to={`/medico/pacientes/${paciente.id}`}
                  className="w-full btn-outline flex items-center justify-center space-x-2"
                >
                  <FileText size={18} />
                  <span>Ver Historial</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicoPacientes;