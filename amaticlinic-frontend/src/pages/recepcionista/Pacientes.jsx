// src/pages/recepcionista/Pacientes.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Search, Users, Stethoscope, LogOut, Phone, Mail, 
  MapPin, Calendar, FileText
} from 'lucide-react';

const RecepcionistaPacientes = () => {
  const { user, logout } = useAuth();
  const [pacientes, setPacientes] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarPacientes();
  }, []);

  useEffect(() => {
    filtrarPacientes();
  }, [busqueda, pacientes]);

  const cargarPacientes = async () => {
    try {
      const response = await api.get('/pacientes');
      // Agregar conteo de citas
      const responseCitas = await api.get('/citas');
      const pacientesConCitas = response.data.map(p => {
        const citasPaciente = responseCitas.data.filter(c => c.idPaciente === p.id);
        return {
          ...p,
          totalCitas: citasPaciente.length
        };
      });
      setPacientes(pacientesConCitas);
      setPacientesFiltrados(pacientesConCitas);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarPacientes = () => {
    if (!busqueda) {
      setPacientesFiltrados(pacientes);
      return;
    }
    const resultado = pacientes.filter(p =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.dpi.includes(busqueda)
    );
    setPacientesFiltrados(resultado);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-gray-800">AmatiClinic</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/recepcionista/dashboard" className="text-gray-600 hover:text-gray-900">Inicio</Link>
              <Link to="/recepcionista/citas" className="text-gray-600 hover:text-gray-900">Citas</Link>
              <Link to="/recepcionista/medicos" className="text-gray-600 hover:text-gray-900">Médicos</Link>
              <Link to="/recepcionista/pacientes" className="text-primary font-medium">Pacientes</Link>
              <div className="border-l pl-6 flex items-center space-x-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-800">{user.nombre}</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Pacientes</h1>
          <p className="text-gray-600">Administra los pacientes de la clínica</p>
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre o DPI..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {pacientesFiltrados.length} pacientes encontrados
          </div>
        </div>

        {/* Grid de pacientes */}
        {pacientesFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay pacientes registrados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pacientesFiltrados.map((paciente) => (
              <div key={paciente.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-purple/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-purple">
                      {paciente.nombre.charAt(0)}{paciente.apellido.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {paciente.nombre} {paciente.apellido}
                    </h3>
                    <p className="text-sm text-gray-500">DPI: {paciente.dpi}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {paciente.fechaNacimiento && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      <span>
                        {new Date(paciente.fechaNacimiento + 'T00:00:00').toLocaleDateString('es-GT')}
                      </span>
                    </div>
                  )}
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

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total de citas:</span>
                    <span className="font-semibold text-gray-800">{paciente.totalCitas || 0}</span>
                  </div>
                </div>

                <button className="w-full btn-outline flex items-center justify-center space-x-2">
                  <FileText size={18} />
                  <span>Ver Historial</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecepcionistaPacientes;
