// src/pages/paciente/AgendarCita.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  Stethoscope,
  LogOut
} from 'lucide-react';

const AgendarCita = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [paso, setPaso] = useState(1);
  const [medicos, setMedicos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [idPaciente, setIdPaciente] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    idMedico: location.state?.medicoId || '',
    idHorario: '',
    fecha: '',
    motivoConsulta: '',
  });

  const [medicoSeleccionado, setMedicoSeleccionado] = useState(null);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (formData.idMedico) {
      cargarHorarios(formData.idMedico);
      const medico = medicos.find(m => m.id === parseInt(formData.idMedico));
      setMedicoSeleccionado(medico);
    }
  }, [formData.idMedico, medicos]);

  const cargarDatos = async () => {
    try {
      // Cargar médicos
      const responseMedicos = await api.get('/medicos');
      setMedicos(responseMedicos.data);

      // Cargar ID del paciente
      const responsePacientes = await api.get('/pacientes');
      const paciente = responsePacientes.data.find(p => p.idUsuario === user.id);
      if (paciente) {
        setIdPaciente(paciente.id);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const cargarHorarios = async (idMedico) => {
    try {
      const response = await api.get(`/horarios/medico/${idMedico}`);
      setHorarios(response.data);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSiguiente = () => {
    if (paso === 1 && !formData.idMedico) {
      alert('Por favor selecciona un médico');
      return;
    }
    if (paso === 2 && (!formData.fecha || !formData.idHorario)) {
      alert('Por favor selecciona fecha y horario');
      return;
    }
    if (paso === 3 && !formData.motivoConsulta) {
      alert('Por favor describe el motivo de tu consulta');
      return;
    }
    setPaso(paso + 1);
  };

  const handleAnterior = () => {
    setPaso(paso - 1);
  };

  const handleSubmit = async () => {
    if (!idPaciente) {
      alert('Error: No se pudo obtener tu información de paciente');
      return;
    }

    setLoading(true);
    try {
      const citaData = {
        idPaciente: idPaciente,
        idMedico: parseInt(formData.idMedico),
        idHorario: parseInt(formData.idHorario),
        fecha: formData.fecha,
        motivoConsulta: formData.motivoConsulta,
      };

      await api.post('/citas', citaData);
      alert('¡Cita agendada exitosamente!');
      navigate('/paciente/mis-citas');
    } catch (error) {
      console.error('Error al agendar cita:', error);
      alert('Error al agendar la cita. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Obtener fecha mínima (hoy)
  const fechaMinima = new Date().toISOString().split('T')[0];

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
                <button onClick={logout} className="text-gray-600 hover:text-red-600" title="Cerrar sesión">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Link
          to="/paciente/dashboard"
          className="inline-flex items-center text-primary mb-6 hover:underline"
        >
          <ArrowLeft className="mr-2" size={20} />
          Volver al Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Agendar Nueva Cita
        </h1>

        {/* Indicador de Pasos */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    paso >= num
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      paso > num ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Médico</span>
            <span>Fecha/Hora</span>
            <span>Motivo</span>
            <span>Confirmar</span>
          </div>
        </div>

        {/* Contenido por Paso */}
        <div className="card">
          {/* PASO 1: Seleccionar Médico */}
          {paso === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <User className="mr-2 text-primary" />
                Selecciona un Médico
              </h2>
              
              <div className="space-y-4">
                {medicos.map((medico) => (
                  <label
                    key={medico.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.idMedico === medico.id.toString()
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="idMedico"
                      value={medico.id}
                      checked={formData.idMedico === medico.id.toString()}
                      onChange={handleChange}
                      className="mr-4"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        Dr. {medico.nombre} {medico.apellido}
                      </p>
                      <p className="text-sm text-primary">{medico.especialidad}</p>
                      {medico.consultorio && (
                        <p className="text-sm text-gray-500">
                          Consultorio {medico.consultorio}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* PASO 2: Seleccionar Fecha y Horario */}
          {paso === 2 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 text-primary" />
                Selecciona Fecha y Horario
              </h2>

              <div className="space-y-6">
                {/* Fecha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de la Cita
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    min={fechaMinima}
                    className="input-field"
                    required
                  />
                </div>

                {/* Horarios Disponibles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horario Disponible
                  </label>
                  {horarios.length === 0 ? (
                    <p className="text-gray-500">
                      No hay horarios disponibles para este médico
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {horarios.map((horario) => (
                        <label
                          key={horario.id}
                          className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            formData.idHorario === horario.id.toString()
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="idHorario"
                            value={horario.id}
                            checked={formData.idHorario === horario.id.toString()}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <Clock size={20} className="mb-2 text-gray-600" />
                          <span className="font-medium text-sm">
                            {horario.diaSemana}
                          </span>
                          <span className="text-xs text-gray-500">
                            {horario.horaInicio} - {horario.horaFin}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: Motivo de Consulta */}
          {paso === 3 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 text-primary" />
                Motivo de Consulta
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe el motivo de tu consulta
                </label>
                <textarea
                  name="motivoConsulta"
                  value={formData.motivoConsulta}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe brevemente el motivo de tu visita, síntomas que presentas, o cualquier información que consideres relevante..."
                  className="input-field"
                  required
                />
              </div>
            </div>
          )}

          {/* PASO 4: Confirmación */}
          {paso === 4 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <CheckCircle className="mr-2 text-success" />
                Confirmar Cita
              </h2>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Médico</p>
                  <p className="font-semibold text-gray-800">
                    Dr. {medicoSeleccionado?.nombre} {medicoSeleccionado?.apellido}
                  </p>
                  <p className="text-sm text-primary">
                    {medicoSeleccionado?.especialidad}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-1">Fecha y Hora</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(formData.fecha + 'T00:00:00').toLocaleDateString('es-GT', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {horarios.find(h => h.id === parseInt(formData.idHorario))?.horaInicio} - 
                    {horarios.find(h => h.id === parseInt(formData.idHorario))?.horaFin}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-1">Motivo de Consulta</p>
                  <p className="text-gray-800">{formData.motivoConsulta}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Recibirás una confirmación de tu cita. 
                  Por favor, llega 10 minutos antes de tu hora programada.
                </p>
              </div>
            </div>
          )}

          {/* Botones de Navegación */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {paso > 1 && (
              <button
                onClick={handleAnterior}
                className="btn-outline"
                disabled={loading}
              >
                Anterior
              </button>
            )}

            {paso < 4 ? (
              <button
                onClick={handleSiguiente}
                className="btn-primary ml-auto"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn-success ml-auto"
                disabled={loading}
              >
                {loading ? 'Agendando...' : 'Confirmar Cita'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendarCita;