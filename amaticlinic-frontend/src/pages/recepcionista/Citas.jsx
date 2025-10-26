// src/pages/recepcionista/Citas.jsx - CRUD COMPLETO
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Calendar, Clock, Users, Stethoscope, LogOut, Search, 
  Plus, Edit, X, Check, Ban, Filter, ChevronDown, AlertCircle
} from 'lucide-react';

const RecepcionistaCitas = () => {
  const { user, logout } = useAuth();
  
  // Estados principales
  const [citas, setCitas] = useState([]);
  const [citasFiltradas, setCitasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de búsqueda y filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroMedico, setFiltroMedico] = useState('');
  
  // Datos para formularios
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [citaEditando, setCitaEditando] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    idPaciente: '',
    idMedico: '',
    fecha: '',
    slotSeleccionado: null,
    motivoConsulta: ''
  });
  
  // Slots disponibles
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarCitas();
  }, [busqueda, filtroEstado, filtroFecha, filtroMedico, citas]);

  useEffect(() => {
    if (formData.idMedico && formData.fecha) {
      cargarSlots();
    } else {
      setSlots([]);
      setFormData(prev => ({ ...prev, slotSeleccionado: null }));
    }
  }, [formData.idMedico, formData.fecha]);

  const cargarDatos = async () => {
    try {
      const [responseCitas, responsePacientes, responseMedicos] = await Promise.all([
        api.get('/citas'),
        api.get('/pacientes'),
        api.get('/medicos')
      ]);
      
      setCitas(responseCitas.data);
      setCitasFiltradas(responseCitas.data);
      setPacientes(responsePacientes.data);
      setMedicos(responseMedicos.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarSlots = async () => {
    setLoadingSlots(true);
    try {
      const response = await api.get('/horarios/slots-disponibles', {
        params: {
          idMedico: formData.idMedico,
          fecha: formData.fecha
        }
      });
      setSlots(response.data);
    } catch (error) {
      console.error('Error al cargar slots:', error);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const filtrarCitas = () => {
    let resultado = [...citas];
    
    // Filtro por búsqueda
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      resultado = resultado.filter(c => 
        c.nombrePaciente.toLowerCase().includes(busquedaLower) ||
        c.nombreMedico.toLowerCase().includes(busquedaLower) ||
        c.especialidad.toLowerCase().includes(busquedaLower)
      );
    }
    
    // Filtro por estado
    if (filtroEstado !== 'Todas') {
      resultado = resultado.filter(c => c.estado === filtroEstado);
    }
    
    // Filtro por fecha
    if (filtroFecha) {
      resultado = resultado.filter(c => c.fecha === filtroFecha);
    }
    
    // Filtro por médico
    if (filtroMedico) {
      resultado = resultado.filter(c => c.idMedico === parseInt(filtroMedico));
    }
    
    // Ordenar por fecha y hora
    resultado.sort((a, b) => {
      const fechaA = new Date(a.fecha + 'T' + a.horaInicio);
      const fechaB = new Date(b.fecha + 'T' + b.horaInicio);
      return fechaB - fechaA; // Más recientes primero
    });
    
    setCitasFiltradas(resultado);
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEstado('Todas');
    setFiltroFecha('');
    setFiltroMedico('');
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setCitaEditando(null);
    setFormData({
      idPaciente: '',
      idMedico: '',
      fecha: '',
      slotSeleccionado: null,
      motivoConsulta: ''
    });
    setSlots([]);
    setShowModal(true);
  };

  const abrirModalEditar = (cita) => {
    setModoEdicion(true);
    setCitaEditando(cita);
    setFormData({
      idPaciente: cita.idPaciente,
      idMedico: cita.idMedico,
      fecha: cita.fecha,
      slotSeleccionado: null,
      motivoConsulta: cita.motivoConsulta || ''
    });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setModoEdicion(false);
    setCitaEditando(null);
    setSlots([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'idMedico' || name === 'fecha' ? { slotSeleccionado: null } : {})
    }));
  };

  const crearCita = async (e) => {
    e.preventDefault();

    if (!formData.slotSeleccionado) {
      alert('Por favor selecciona un horario');
      return;
    }

    try {
      // Buscar horario del médico
      const responseHorarios = await api.get(`/horarios/medico/${formData.idMedico}`);
      const fecha = new Date(formData.fecha + 'T00:00:00');
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
      const diaSemana = diasSemana[fecha.getDay()];
      
      const horario = responseHorarios.data.find(h => h.diaSemana === diaSemana);
      
      if (!horario) {
        alert('No se encontró el horario del médico para este día');
        return;
      }

      // Crear cita
      await api.post('/citas', {
        idPaciente: parseInt(formData.idPaciente),
        idMedico: parseInt(formData.idMedico),
        idHorario: horario.id,
        fecha: formData.fecha,
        horaInicio: formData.slotSeleccionado.horaInicio,
        horaFin: formData.slotSeleccionado.horaFin,
        motivoConsulta: formData.motivoConsulta
      });

      alert('✅ Cita agendada exitosamente');
      cerrarModal();
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al agendar cita: ' + (error.response?.data?.message || error.message));
    }
  };

  const actualizarCita = async (e) => {
    e.preventDefault();

    if (!formData.slotSeleccionado) {
      alert('Por favor selecciona un nuevo horario');
      return;
    }

    try {
      // Buscar horario del médico
      const responseHorarios = await api.get(`/horarios/medico/${formData.idMedico}`);
      const fecha = new Date(formData.fecha + 'T00:00:00');
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
      const diaSemana = diasSemana[fecha.getDay()];
      
      const horario = responseHorarios.data.find(h => h.diaSemana === diaSemana);
      
      if (!horario) {
        alert('No se encontró el horario del médico para este día');
        return;
      }

      // Reprogramar cita
      await api.put(`/citas/${citaEditando.id}/reprogramar`, null, {
        params: {
          nuevoIdHorario: horario.id,
          nuevaFecha: formData.fecha
        }
      });

      alert('✅ Cita reprogramada exitosamente');
      cerrarModal();
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al reprogramar cita: ' + (error.response?.data?.message || error.message));
    }
  };

  const cancelarCita = async (id, nombrePaciente) => {
    if (!window.confirm(`¿Estás seguro de cancelar la cita de ${nombrePaciente}?`)) {
      return;
    }

    try {
      await api.put(`/citas/${id}/cancelar`);
      alert('✅ Cita cancelada exitosamente');
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al cancelar cita');
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

  const formatearFecha = (fecha) => {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-GT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstadoBadge = (estado) => {
    const estilos = {
      'Agendada': 'bg-blue-100 text-blue-800',
      'Confirmada': 'bg-green-100 text-green-800',
      'Completada': 'bg-gray-100 text-gray-800',
      'Cancelada': 'bg-red-100 text-red-800'
    };
    return estilos[estado] || 'bg-gray-100 text-gray-800';
  };

  const getPacienteNombre = (id) => {
    const paciente = pacientes.find(p => p.id === id);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : '';
  };

  const getMedicoNombre = (id) => {
    const medico = medicos.find(m => m.id === id);
    return medico ? `Dr. ${medico.nombre} ${medico.apellido}` : '';
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
              <Link to="/recepcionista/dashboard" className="text-gray-600 hover:text-gray-900">Inicio</Link>
              <Link to="/recepcionista/citas" className="text-primary font-medium">Citas</Link>
              <Link to="/recepcionista/medicos" className="text-gray-600 hover:text-gray-900">Médicos</Link>
              <Link to="/recepcionista/horarios" className="text-gray-600 hover:text-gray-900">Horarios</Link>
              <Link to="/recepcionista/pacientes" className="text-gray-600 hover:text-gray-900">Pacientes</Link>
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

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Citas</h1>
          <p className="text-gray-600">Administra las citas médicas de la clínica</p>
        </div>

        {/* Filtros y botón crear */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por paciente, médico o especialidad..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Filtro Estado */}
            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Todas">Todas</option>
                <option value="Agendada">Agendada</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>

            {/* Filtro Fecha */}
            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Filtro Médico */}
            <div className="w-full lg:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Médico
              </label>
              <select
                value={filtroMedico}
                onChange={(e) => setFiltroMedico(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todos</option>
                {medicos.map(m => (
                  <option key={m.id} value={m.id}>
                    Dr. {m.nombre} {m.apellido}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={limpiarFiltros}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Limpiar filtros
              </button>
              <span className="text-sm text-gray-600">
                {citasFiltradas.length} citas encontradas
              </span>
            </div>
            <button
              onClick={abrirModalCrear}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Nueva Cita</span>
            </button>
          </div>
        </div>

        {/* Lista de citas */}
        {citasFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {busqueda || filtroEstado !== 'Todas' || filtroFecha || filtroMedico
                ? 'No se encontraron citas con los filtros aplicados'
                : 'No hay citas registradas'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {citasFiltradas.map((cita) => (
              <div key={cita.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {cita.nombrePaciente}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(cita.estado)}`}>
                        {cita.estado}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Users size={16} className="text-gray-400" />
                        <span>{cita.nombreMedico}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Stethoscope size={16} className="text-gray-400" />
                        <span>{cita.especialidad}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{formatearFecha(cita.fecha)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-gray-400" />
                        <span>{formatearHora(cita.horaInicio)} - {formatearHora(cita.horaFin)}</span>
                      </div>
                      {cita.consultorio && (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">📍</span>
                          <span>{cita.consultorio}</span>
                        </div>
                      )}
                    </div>
                    {cita.motivoConsulta && (
                      <div className="mt-3 text-sm text-gray-600">
                        <strong>Motivo:</strong> {cita.motivoConsulta}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    {cita.estado === 'Agendada' && (
                      <>
                        <button
                          onClick={() => abrirModalEditar(cita)}
                          className="btn-outline flex items-center space-x-1 text-sm px-3 py-2"
                        >
                          <Edit size={16} />
                          <span>Reprogramar</span>
                        </button>
                        <button
                          onClick={() => cancelarCita(cita.id, cita.nombrePaciente)}
                          className="btn-outline text-red-600 border-red-200 hover:bg-red-50 flex items-center space-x-1 text-sm px-3 py-2"
                        >
                          <Ban size={16} />
                          <span>Cancelar</span>
                        </button>
                      </>
                    )}
                    {cita.estado === 'Cancelada' && (
                      <span className="text-xs text-gray-500 italic">Cita cancelada</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {modoEdicion ? 'Reprogramar Cita' : 'Agendar Nueva Cita'}
              </h2>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={modoEdicion ? actualizarCita : crearCita} className="p-6 space-y-6">
              {/* Selección de paciente */}
              {!modoEdicion && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paciente *
                  </label>
                  <select
                    name="idPaciente"
                    value={formData.idPaciente}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Seleccionar paciente...</option>
                    {pacientes.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} {p.apellido} - DPI: {p.documentoIdentidad || 'N/A'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {modoEdicion && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Paciente:</strong> {getPacienteNombre(formData.idPaciente)}
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    <strong>Cita actual:</strong> {formatearFecha(citaEditando.fecha)} - {formatearHora(citaEditando.horaInicio)}
                  </p>
                </div>
              )}

              {/* Selección de médico */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Médico *
                </label>
                <select
                  name="idMedico"
                  value={formData.idMedico}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Seleccionar médico...</option>
                  {medicos.map(m => (
                    <option key={m.id} value={m.id}>
                      Dr. {m.nombre} {m.apellido} - {m.especialidad}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selección de fecha */}
              {formData.idMedico && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    min={getMinDate()}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              {/* Slots disponibles */}
              {formData.fecha && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horario Disponible *
                  </label>
                  {loadingSlots ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-gray-600 mt-4">Cargando horarios...</p>
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <AlertCircle className="text-yellow-600 inline mr-2" size={20} />
                      <span className="text-sm text-yellow-800">
                        El médico no tiene horarios disponibles para este día
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                      {slots.map((slot, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => slot.disponible && setFormData(prev => ({ ...prev, slotSeleccionado: slot }))}
                          disabled={!slot.disponible}
                          className={`p-3 rounded-lg border-2 transition-all text-sm ${
                            slot.disponible
                              ? formData.slotSeleccionado?.hora === slot.hora
                                ? 'border-primary bg-primary text-white'
                                : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                              : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                          }`}
                        >
                          <div className="font-semibold">
                            {formatearHora(slot.horaInicio)}
                          </div>
                          <div className="text-xs mt-1 opacity-80">
                            {slot.disponible ? 'Disponible' : 'Ocupado'}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Motivo de consulta */}
              {formData.slotSeleccionado && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo de Consulta (opcional)
                  </label>
                  <textarea
                    name="motivoConsulta"
                    value={formData.motivoConsulta}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Ej: Control de presión arterial, dolor de cabeza..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              )}

              {/* Botones */}
              <div className="flex space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 btn-outline"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!formData.slotSeleccionado}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {modoEdicion ? 'Reprogramar Cita' : 'Agendar Cita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecepcionistaCitas;