// src/pages/paciente/AgendarCita.jsx - CON SISTEMA DE SLOTS
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Calendar, Clock, User, Stethoscope, LogOut, 
  ChevronLeft, Check, X, AlertCircle
} from 'lucide-react';

const AgendarCita = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pacienteId, setPacienteId] = useState(null);
  
  // Estados del formulario
  const [medicoSeleccionado, setMedicoSeleccionado] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);
  const [motivoConsulta, setMotivoConsulta] = useState('');
  
  // Estados de slots
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (medicoSeleccionado && fechaSeleccionada) {
      cargarSlots();
    } else {
      setSlots([]);
      setSlotSeleccionado(null);
    }
  }, [medicoSeleccionado, fechaSeleccionada]);

  const cargarDatos = async () => {
    try {
      // Obtener ID del paciente
      const responsePacientes = await api.get('/pacientes');
      const paciente = responsePacientes.data.find(p => p.idUsuario === user.id);
      
      if (paciente) {
        setPacienteId(paciente.id);
      }

      // Obtener médicos
      const responseMedicos = await api.get('/medicos');
      setMedicos(responseMedicos.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarSlots = async () => {
    setLoadingSlots(true);
    setErrorSlots('');
    setSlots([]);
    setSlotSeleccionado(null);

    try {
      const response = await api.get('/horarios/slots-disponibles', {
        params: {
          idMedico: medicoSeleccionado,
          fecha: fechaSeleccionada
        }
      });

      if (response.data.length === 0) {
        setErrorSlots('El médico no tiene horarios configurados para este día');
      } else {
        setSlots(response.data);
      }
    } catch (error) {
      console.error('Error al cargar slots:', error);
      setErrorSlots('Error al cargar horarios disponibles');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slotSeleccionado) {
      alert('Por favor selecciona un horario');
      return;
    }

    try {
      // Buscar el horario del médico para el día seleccionado
      const responseHorarios = await api.get(`/horarios/medico/${medicoSeleccionado}`);
      const fecha = new Date(fechaSeleccionada + 'T00:00:00');
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
      const diaSemana = diasSemana[fecha.getDay()];
      
      const horario = responseHorarios.data.find(h => h.diaSemana === diaSemana);
      
      if (!horario) {
        alert('No se encontró el horario del médico para este día');
        return;
      }

      // Crear la cita con el slot seleccionado
      await api.post('/citas', {
        idPaciente: pacienteId,
        idMedico: parseInt(medicoSeleccionado),
        idHorario: horario.id,
        fecha: fechaSeleccionada,
        horaInicio: slotSeleccionado.horaInicio,
        horaFin: slotSeleccionado.horaFin,
        motivoConsulta: motivoConsulta
      });

      alert('¡Cita agendada exitosamente!');
      navigate('/paciente/mis-citas');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agendar la cita: ' + (error.response?.data?.message || error.message));
    }
  };

  const formatearHora = (hora) => {
    if (!hora) return '';
    const [hours, minutes] = hora.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getMedicoInfo = () => {
    if (!medicoSeleccionado) return null;
    return medicos.find(m => m.id === parseInt(medicoSeleccionado));
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const medicoInfo = getMedicoInfo();

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
              <Link to="/paciente/agendar" className="text-primary font-medium">
                Agendar Cita
              </Link>
              <Link to="/paciente/mis-citas" className="text-gray-600 hover:text-gray-900">
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
                <button onClick={logout} className="text-gray-600 hover:text-red-600">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con botón volver */}
        <div className="mb-8">
          <Link 
            to="/paciente/dashboard" 
            className="inline-flex items-center text-primary hover:underline mb-4"
          >
            <ChevronLeft size={20} />
            <span>Volver al inicio</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Agendar Nueva Cita</h1>
          <p className="text-gray-600">Selecciona médico, fecha y horario disponible</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de médico */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="text-primary" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Seleccionar Médico</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Médico *
              </label>
              <select
                value={medicoSeleccionado}
                onChange={(e) => {
                  setMedicoSeleccionado(e.target.value);
                  setSlotSeleccionado(null);
                }}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecciona un médico</option>
                {medicos.map((medico) => (
                  <option key={medico.id} value={medico.id}>
                    Dr. {medico.nombre} {medico.apellido} - {medico.especialidad}
                  </option>
                ))}
              </select>
            </div>

            {medicoInfo && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Especialidad:</strong> {medicoInfo.especialidad}
                </p>
                {medicoInfo.consultorio && (
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Consultorio:</strong> {medicoInfo.consultorio}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Selección de fecha */}
          {medicoSeleccionado && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="text-primary" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">Seleccionar Fecha</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de la cita *
                </label>
                <input
                  type="date"
                  value={fechaSeleccionada}
                  onChange={(e) => {
                    setFechaSeleccionada(e.target.value);
                    setSlotSeleccionado(null);
                  }}
                  min={getMinDate()}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {/* Slots disponibles */}
          {fechaSeleccionada && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="text-primary" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">Horarios Disponibles</h2>
              </div>

              {loadingSlots ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-gray-600 mt-4">Cargando horarios...</p>
                </div>
              ) : errorSlots ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-yellow-800">{errorSlots}</p>
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Selecciona una fecha para ver horarios disponibles</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {slots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => slot.disponible && setSlotSeleccionado(slot)}
                      disabled={!slot.disponible}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        slot.disponible
                          ? slotSeleccionado?.hora === slot.hora
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                          : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Clock size={18} className={slot.disponible ? '' : 'text-gray-400'} />
                        {slot.disponible ? (
                          slotSeleccionado?.hora === slot.hora ? (
                            <Check size={18} />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-current"></div>
                          )
                        ) : (
                          <X size={18} className="text-red-500" />
                        )}
                      </div>
                      <p className="font-semibold text-left">
                        {formatearHora(slot.horaInicio)}
                      </p>
                      <p className="text-sm text-left opacity-80">
                        {formatearHora(slot.horaFin)}
                      </p>
                      <p className="text-xs mt-2 text-left">
                        {slot.disponible ? 'Disponible' : 'Ocupado'}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {slotSeleccionado && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Horario seleccionado:</strong> {formatearHora(slotSeleccionado.horaInicio)} - {formatearHora(slotSeleccionado.horaFin)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Motivo de consulta */}
          {slotSeleccionado && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="text-primary" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">Motivo de Consulta</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe brevemente el motivo de tu consulta (opcional)
                </label>
                <textarea
                  value={motivoConsulta}
                  onChange={(e) => setMotivoConsulta(e.target.value)}
                  rows="4"
                  placeholder="Ejemplo: Control de presión arterial, dolor de cabeza, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex space-x-4">
            <Link
              to="/paciente/dashboard"
              className="flex-1 btn-outline"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={!slotSeleccionado}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgendarCita;