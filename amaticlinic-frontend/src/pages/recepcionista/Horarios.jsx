// src/pages/recepcionista/Horarios.jsx - VERSIÓN MEJORADA CON SELECCIÓN MÚLTIPLE
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Clock, Stethoscope, LogOut, Plus, Edit, Trash2, 
  Calendar, X, Filter, Copy, Zap
} from 'lucide-react';

const RecepcionistaHorarios = () => {
  const { user, logout } = useAuth();
  const [horarios, setHorarios] = useState([]);
  const [horariosFiltrados, setHorariosFiltrados] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [medicoFiltro, setMedicoFiltro] = useState('todos');
  const [diaFiltro, setDiaFiltro] = useState('todos');
  
  // Modal
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  
  // Formulario - ACTUALIZADO CON SELECCIÓN MÚLTIPLE
  const [formData, setFormData] = useState({
    idMedico: '',
    diasSeleccionados: [], // NUEVO: Array de días
    horaInicio: '',
    horaFin: ''
  });

  const diasSemana = [
    { value: 'Lunes', label: 'Lunes' },
    { value: 'Martes', label: 'Martes' },
    { value: 'Miercoles', label: 'Miércoles' },
    { value: 'Jueves', label: 'Jueves' },
    { value: 'Viernes', label: 'Viernes' },
    { value: 'Sabado', label: 'Sábado' },
    { value: 'Domingo', label: 'Domingo' }
  ];

  // NUEVO: Plantillas predefinidas
  const plantillas = [
    {
      nombre: 'Tiempo Completo (L-V)',
      dias: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'],
      horaInicio: '09:00',
      horaFin: '17:00'
    },
    {
      nombre: 'Medio Tiempo Mañana (L-V)',
      dias: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'],
      horaInicio: '09:00',
      horaFin: '13:00'
    },
    {
      nombre: 'Medio Tiempo Tarde (L-V)',
      dias: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'],
      horaInicio: '14:00',
      horaFin: '18:00'
    },
    {
      nombre: 'Fines de Semana',
      dias: ['Sabado', 'Domingo'],
      horaInicio: '09:00',
      horaFin: '13:00'
    }
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarHorarios();
  }, [medicoFiltro, diaFiltro, horarios]);

  const cargarDatos = async () => {
    try {
      const [responseMedicos, responseHorarios] = await Promise.all([
        api.get('/medicos'),
        api.get('/horarios')
      ]);
      
      setMedicos(responseMedicos.data);
      setHorarios(responseHorarios.data);
      setHorariosFiltrados(responseHorarios.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarHorarios = () => {
    let resultado = [...horarios];
    
    if (medicoFiltro !== 'todos') {
      resultado = resultado.filter(h => h.idMedico === parseInt(medicoFiltro));
    }
    
    if (diaFiltro !== 'todos') {
      resultado = resultado.filter(h => h.diaSemana === diaFiltro);
    }
    
    setHorariosFiltrados(resultado);
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setHorarioSeleccionado(null);
    setFormData({
      idMedico: '',
      diasSeleccionados: [],
      horaInicio: '',
      horaFin: ''
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (horario) => {
    setModoEdicion(true);
    setHorarioSeleccionado(horario);
    setFormData({
      idMedico: horario.idMedico,
      diasSeleccionados: [horario.diaSemana], // Solo el día actual
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setHorarioSeleccionado(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // NUEVO: Manejar selección de días (checkboxes)
  const toggleDia = (dia) => {
    setFormData(prev => ({
      ...prev,
      diasSeleccionados: prev.diasSeleccionados.includes(dia)
        ? prev.diasSeleccionados.filter(d => d !== dia)
        : [...prev.diasSeleccionados, dia]
    }));
  };

  // NUEVO: Seleccionar todos los días
  const seleccionarTodos = () => {
    setFormData(prev => ({
      ...prev,
      diasSeleccionados: diasSemana.map(d => d.value)
    }));
  };

  // NUEVO: Deseleccionar todos
  const deseleccionarTodos = () => {
    setFormData(prev => ({
      ...prev,
      diasSeleccionados: []
    }));
  };

  // NUEVO: Aplicar plantilla
  const aplicarPlantilla = (plantilla) => {
    setFormData(prev => ({
      ...prev,
      diasSeleccionados: plantilla.dias,
      horaInicio: plantilla.horaInicio,
      horaFin: plantilla.horaFin
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.diasSeleccionados.length === 0) {
      alert('Debes seleccionar al menos un día');
      return;
    }

    try {
      if (modoEdicion) {
        // Editar horario existente (solo un día)
        await api.put(`/horarios/${horarioSeleccionado.id}`, {
          idMedico: formData.idMedico,
          diaSemana: formData.diasSeleccionados[0],
          horaInicio: formData.horaInicio,
          horaFin: formData.horaFin
        });
        alert('Horario actualizado exitosamente');
      } else {
        // Crear múltiples horarios (uno por cada día seleccionado)
        const promesas = formData.diasSeleccionados.map(dia =>
          api.post('/horarios', {
            idMedico: formData.idMedico,
            diaSemana: dia,
            horaInicio: formData.horaInicio,
            horaFin: formData.horaFin
          })
        );
        
        await Promise.all(promesas);
        alert(`${formData.diasSeleccionados.length} horarios creados exitosamente`);
      }
      
      cerrarModal();
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const eliminarHorario = async (id) => {
    if (window.confirm('¿Eliminar este horario?')) {
      try {
        await api.delete(`/horarios/${id}`);
        alert('Horario eliminado');
        cargarDatos();
      } catch (error) {
        alert('Error al eliminar');
      }
    }
  };

  // NUEVO: Eliminar todos los horarios de un médico
  const eliminarTodosHorariosMedico = async (idMedico, nombreMedico) => {
    const horariosDelMedico = horarios.filter(h => h.idMedico === idMedico);
    
    if (window.confirm(`¿Eliminar TODOS los horarios de ${nombreMedico}? (${horariosDelMedico.length} horarios)`)) {
      try {
        const promesas = horariosDelMedico.map(h => api.delete(`/horarios/${h.id}`));
        await Promise.all(promesas);
        alert('Todos los horarios eliminados');
        cargarDatos();
      } catch (error) {
        alert('Error al eliminar horarios');
      }
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

  const horariosPorMedico = horariosFiltrados.reduce((acc, horario) => {
    const key = horario.idMedico;
    if (!acc[key]) {
      acc[key] = {
        idMedico: horario.idMedico,
        medico: horario.nombreMedico,
        especialidad: horario.especialidad,
        horarios: []
      };
    }
    acc[key].horarios.push(horario);
    return acc;
  }, {});

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
              <Link to="/recepcionista/horarios" className="text-primary font-medium">Horarios</Link>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Horarios</h1>
          <p className="text-gray-600">Administra los horarios de atención de los médicos</p>
        </div>

        {/* Filtros y crear */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-600" />
              <h3 className="font-semibold text-gray-800">Filtros:</h3>
            </div>
            <button 
              onClick={abrirModalCrear}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Nuevo Horario</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Médico</label>
              <select
                value={medicoFiltro}
                onChange={(e) => setMedicoFiltro(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="todos">Todos los médicos</option>
                {medicos.map(m => (
                  <option key={m.id} value={m.id}>
                    Dr. {m.nombre} {m.apellido} - {m.especialidad}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Día de la semana</label>
              <select
                value={diaFiltro}
                onChange={(e) => setDiaFiltro(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="todos">Todos los días</option>
                {diasSemana.map(dia => (
                  <option key={dia.value} value={dia.value}>{dia.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {horariosFiltrados.length} horarios encontrados
          </div>
        </div>

        {/* Lista de horarios */}
        {Object.keys(horariosPorMedico).length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay horarios registrados</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.values(horariosPorMedico).map((grupo, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-4 pb-4 border-b flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{grupo.medico}</h3>
                    <p className="text-primary">{grupo.especialidad}</p>
                  </div>
                  <button
                    onClick={() => eliminarTodosHorariosMedico(grupo.idMedico, grupo.medico)}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center space-x-1"
                  >
                    <Trash2 size={16} />
                    <span>Eliminar todos</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grupo.horarios.map((horario) => (
                    <div key={horario.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar size={18} className="text-primary" />
                          <span className="font-semibold text-gray-800">{horario.diaSemana}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600 mb-4">
                        <Clock size={16} />
                        <span>{formatearHora(horario.horaInicio)} - {formatearHora(horario.horaFin)}</span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => abrirModalEditar(horario)}
                          className="flex-1 btn-outline text-sm py-1"
                        >
                          <Edit size={14} className="inline mr-1" />
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarHorario(horario.id)}
                          className="px-2 py-1 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal MEJORADO */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {modoEdicion ? 'Editar Horario' : 'Nuevo Horario'}
                </h2>
                <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Médico */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Médico *
                  </label>
                  <select
                    name="idMedico"
                    value={formData.idMedico}
                    onChange={handleInputChange}
                    required
                    disabled={modoEdicion}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                  >
                    <option value="">Seleccionar médico</option>
                    {medicos.map(m => (
                      <option key={m.id} value={m.id}>
                        Dr. {m.nombre} {m.apellido} - {m.especialidad}
                      </option>
                    ))}
                  </select>
                </div>

                {/* NUEVO: Plantillas rápidas */}
                {!modoEdicion && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Zap size={16} className="inline mr-1" />
                      Plantillas Rápidas
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {plantillas.map((plantilla, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => aplicarPlantilla(plantilla)}
                          className="text-sm px-3 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                        >
                          {plantilla.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* NUEVO: Selección múltiple de días */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Días * {!modoEdicion && `(${formData.diasSeleccionados.length} seleccionados)`}
                    </label>
                    {!modoEdicion && (
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={seleccionarTodos}
                          className="text-xs text-primary hover:underline"
                        >
                          Seleccionar todos
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={deseleccionarTodos}
                          className="text-xs text-gray-600 hover:underline"
                        >
                          Limpiar
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {diasSemana.map(dia => (
                      <label
                        key={dia.value}
                        className={`flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          formData.diasSeleccionados.includes(dia.value)
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${modoEdicion ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.diasSeleccionados.includes(dia.value)}
                          onChange={() => !modoEdicion && toggleDia(dia.value)}
                          disabled={modoEdicion}
                          className="w-4 h-4 text-primary rounded focus:ring-primary"
                        />
                        <span className="text-sm font-medium">{dia.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Horarios */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de inicio *
                    </label>
                    <input
                      type="time"
                      name="horaInicio"
                      value={formData.horaInicio}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de fin *
                    </label>
                    <input
                      type="time"
                      name="horaFin"
                      value={formData.horaFin}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Resumen */}
                {!modoEdicion && formData.diasSeleccionados.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Se crearán {formData.diasSeleccionados.length} horarios:</strong>
                      <br />
                      {formData.diasSeleccionados.join(', ')}
                      {formData.horaInicio && formData.horaFin && (
                        <> de {formatearHora(formData.horaInicio)} a {formatearHora(formData.horaFin)}</>
                      )}
                    </p>
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="flex-1 btn-outline"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    {modoEdicion ? 'Actualizar' : `Crear ${formData.diasSeleccionados.length || ''} Horario${formData.diasSeleccionados.length !== 1 ? 's' : ''}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecepcionistaHorarios;