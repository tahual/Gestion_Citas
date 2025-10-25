// src/pages/medico/PacienteDetalle.jsx - NUEVO
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  User, Calendar, Phone, Mail, MapPin, Stethoscope, 
  LogOut, ArrowLeft, FileText, AlertCircle, Heart
} from 'lucide-react';

const PacienteDetalle = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const [paciente, setPaciente] = useState(null);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      // Cargar información del paciente
      const responsePaciente = await api.get(`/pacientes/${id}`);
      setPaciente(responsePaciente.data);

      // Cargar citas del paciente
      const responseCitas = await api.get(`/citas/paciente/${id}`);
      setCitas(responseCitas.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Paciente no encontrado</p>
          <Link to="/medico/pacientes" className="btn-primary">
            Volver a Pacientes
          </Link>
        </div>
      </div>
    );
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/medico/pacientes" className="text-primary hover:underline flex items-center mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Volver a Pacientes
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Historial del Paciente</h1>
        </div>

        {/* Información Personal */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <User size={24} className="mr-2 text-primary" />
            Información Personal
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nombre Completo</p>
              <p className="font-medium text-gray-800">{paciente.nombre} {paciente.apellido}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Documento de Identidad</p>
              <p className="font-medium text-gray-800">
                {paciente.documentoIdentidad || 'No registrado'}
              </p>
            </div>

            {paciente.fechaNacimiento && (
              <div>
                <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                <p className="font-medium text-gray-800 flex items-center">
                  <Calendar size={16} className="mr-2" />
                  {new Date(paciente.fechaNacimiento + 'T00:00:00').toLocaleDateString('es-GT')}
                </p>
              </div>
            )}

            {paciente.telefono && (
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium text-gray-800 flex items-center">
                  <Phone size={16} className="mr-2" />
                  {paciente.telefono}
                </p>
              </div>
            )}

            {paciente.correo && (
              <div>
                <p className="text-sm text-gray-500">Correo Electrónico</p>
                <p className="font-medium text-gray-800 flex items-center">
                  <Mail size={16} className="mr-2" />
                  {paciente.correo}
                </p>
              </div>
            )}

            {paciente.direccion && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Dirección</p>
                <p className="font-medium text-gray-800 flex items-center">
                  <MapPin size={16} className="mr-2" />
                  {paciente.direccion}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Información Médica */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Heart size={24} className="mr-2 text-primary" />
            Información Médica
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paciente.tipoSangre && (
              <div>
                <p className="text-sm text-gray-500">Tipo de Sangre</p>
                <p className="font-medium text-gray-800">{paciente.tipoSangre}</p>
              </div>
            )}

            {paciente.alergias && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 flex items-center mb-2">
                  <AlertCircle size={16} className="mr-2 text-red-500" />
                  Alergias
                </p>
                <p className="font-medium text-gray-800 bg-red-50 p-3 rounded-lg">
                  {paciente.alergias}
                </p>
              </div>
            )}

            {paciente.contactoEmergenciaNombre && (
              <>
                <div>
                  <p className="text-sm text-gray-500">Contacto de Emergencia</p>
                  <p className="font-medium text-gray-800">{paciente.contactoEmergenciaNombre}</p>
                </div>
                {paciente.contactoEmergenciaTelefono && (
                  <div>
                    <p className="text-sm text-gray-500">Teléfono de Emergencia</p>
                    <p className="font-medium text-gray-800">{paciente.contactoEmergenciaTelefono}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Historial de Citas */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FileText size={24} className="mr-2 text-primary" />
            Historial de Citas
          </h2>

          {citas.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay citas registradas</p>
          ) : (
            <div className="space-y-3">
              {citas.map((cita) => (
                <div key={cita.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          cita.estado === 'Completada' 
                            ? 'bg-green-100 text-green-800' 
                            : cita.estado === 'Agendada'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {cita.estado}
                        </span>
                        <span className="text-sm text-gray-600">
                          {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-GT')}
                        </span>
                        <span className="text-sm text-gray-600">
                          {cita.horaInicio} - {cita.horaFin}
                        </span>
                      </div>
                      {cita.motivoConsulta && (
                        <p className="text-sm text-gray-600">{cita.motivoConsulta}</p>
                      )}
                    </div>
                    {cita.estado === 'Completada' && (
                      <Link
                        to={`/medico/citas/${cita.id}`}
                        className="text-primary hover:underline text-sm"
                      >
                        Ver detalle
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PacienteDetalle;
