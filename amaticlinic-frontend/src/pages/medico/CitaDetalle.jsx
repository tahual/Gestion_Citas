// src/pages/medico/CitaDetalle.jsx - NUEVO
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Calendar, Clock, User, Stethoscope, LogOut, ArrowLeft,
  Phone, Mail, MapPin, FileText, CheckCircle
} from 'lucide-react';

const CitaDetalle = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCita();
  }, [id]);

  const cargarCita = async () => {
    try {
      const response = await api.get(`/citas/${id}`);
      setCita(response.data);
    } catch (error) {
      console.error('Error al cargar cita:', error);
      alert('Error al cargar el detalle de la cita');
    } finally {
      setLoading(false);
    }
  };

  const completarCita = async () => {
    if (window.confirm('¿Marcar esta cita como completada?')) {
      try {
        await api.put(`/citas/${id}/completar`);
        alert('Cita completada exitosamente');
        navigate('/medico/citas');
      } catch (error) {
        console.error('Error al completar cita:', error);
        alert('Error al completar la cita');
      }
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cita) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Cita no encontrada</p>
          <Link to="/medico/citas" className="btn-primary">
            Volver a Mis Citas
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
          <Link to="/medico/citas" className="text-primary hover:underline flex items-center mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Volver a Mis Citas
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">Detalle de la Cita</h1>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getEstadoBadge(cita.estado)}`}>
              {cita.estado}
            </span>
          </div>
        </div>

        {/* Información de la Cita */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Información de la Cita</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-gray-600">
              <Calendar size={20} className="mr-3 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-medium">
                  {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-GT', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <Clock size={20} className="mr-3 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Horario</p>
                <p className="font-medium">{cita.horaInicio} - {cita.horaFin}</p>
              </div>
            </div>

            {cita.consultorio && (
              <div className="flex items-center text-gray-600">
                <MapPin size={20} className="mr-3 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Consultorio</p>
                  <p className="font-medium">Consultorio {cita.consultorio}</p>
                </div>
              </div>
            )}
          </div>

          {cita.motivoConsulta && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start">
                <FileText size={20} className="mr-3 text-primary mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-2">Motivo de Consulta</p>
                  <p className="text-gray-600">{cita.motivoConsulta}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Información del Paciente */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <User size={24} className="mr-2 text-primary" />
            Información del Paciente
          </h2>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Nombre Completo</p>
              <p className="font-medium text-gray-800">{cita.nombrePaciente}</p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to={`/medico/pacientes/${cita.idPaciente}`}
              className="btn-outline text-sm py-2 px-4 inline-block"
            >
              Ver Historial del Paciente
            </Link>
          </div>
        </div>

        {/* Acciones */}
        {cita.estado === 'Agendada' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Acciones</h2>
            <div className="flex space-x-4">
              <button
                onClick={completarCita}
                className="btn-primary flex items-center space-x-2"
              >
                <CheckCircle size={20} />
                <span>Marcar como Completada</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitaDetalle;
