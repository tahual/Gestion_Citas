// src/pages/recepcionista/Pacientes.jsx - CRUD COMPLETO
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Search, Users, Stethoscope, LogOut, Phone, Mail, 
  MapPin, Calendar, FileText, Plus, Edit, Trash2, X,
  Eye, EyeOff, AlertCircle
} from 'lucide-react';

const RecepcionistaPacientes = () => {
  const { user, logout } = useAuth();
  const [pacientes, setPacientes] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    // Información personal
    nombre: '',
    apellido: '',
    documentoIdentidad: '',
    fechaNacimiento: '',
    telefono: '',
    correo: '',
    direccion: '',
    // Información médica
    tipoSangre: '',
    alergias: '',
    // Contacto de emergencia
    contactoEmergenciaNombre: '',
    contactoEmergenciaTelefono: '',
    // Credenciales (solo crear)
    correoLogin: '',
    password: ''
  });

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
    
    const busquedaLower = busqueda.toLowerCase();
    
    const resultado = pacientes.filter(p => {
      const nombre = (p.nombre || '').toLowerCase();
      const apellido = (p.apellido || '').toLowerCase();
      const dpi = (p.dpi || p.documentoIdentidad || '').toString();
      const correo = (p.correo || '').toLowerCase();
      
      return nombre.includes(busquedaLower) ||
             apellido.includes(busquedaLower) ||
             dpi.includes(busqueda) ||
             correo.includes(busquedaLower);
    });
    
    setPacientesFiltrados(resultado);
  };

  const obtenerDPI = (paciente) => {
    return paciente.dpi || paciente.documentoIdentidad || 'No registrado';
  };

  // Abrir modal para crear
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setPacienteEditando(null);
    setFormData({
      nombre: '',
      apellido: '',
      documentoIdentidad: '',
      fechaNacimiento: '',
      telefono: '',
      correo: '',
      direccion: '',
      tipoSangre: '',
      alergias: '',
      contactoEmergenciaNombre: '',
      contactoEmergenciaTelefono: '',
      correoLogin: '',
      password: ''
    });
    setShowModal(true);
  };

  // Abrir modal para editar
  const abrirModalEditar = (paciente) => {
    setModoEdicion(true);
    setPacienteEditando(paciente);
    setFormData({
      nombre: paciente.nombre || '',
      apellido: paciente.apellido || '',
      documentoIdentidad: paciente.documentoIdentidad || paciente.dpi || '',
      fechaNacimiento: paciente.fechaNacimiento || '',
      telefono: paciente.telefono || '',
      correo: paciente.correo || '',
      direccion: paciente.direccion || '',
      tipoSangre: paciente.tipoSangre || '',
      alergias: paciente.alergias || '',
      contactoEmergenciaNombre: paciente.contactoEmergenciaNombre || '',
      contactoEmergenciaTelefono: paciente.contactoEmergenciaTelefono || '',
      correoLogin: '',
      password: ''
    });
    setShowModal(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setShowModal(false);
    setModoEdicion(false);
    setPacienteEditando(null);
    setShowPassword(false);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Crear paciente
  const crearPaciente = async (e) => {
    e.preventDefault();

    if (!formData.correoLogin || !formData.password) {
      alert('El correo y contraseña son obligatorios para crear un paciente');
      return;
    }

    try {
      // 1. Crear usuario
      const usuarioData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correoLogin,
        password: formData.password,
        rol: 'Paciente'
      };

      const responseUsuario = await api.post('/usuarios', usuarioData);
      const idUsuario = responseUsuario.data.id;

      // 2. Crear paciente
      const pacienteData = {
        idUsuario: idUsuario,
        documentoIdentidad: formData.documentoIdentidad,
        fechaNacimiento: formData.fechaNacimiento || null,
        telefono: formData.telefono,
        correo: formData.correo || formData.correoLogin,
        direccion: formData.direccion || null,
        tipoSangre: formData.tipoSangre || null,
        alergias: formData.alergias || null,
        contactoEmergenciaNombre: formData.contactoEmergenciaNombre || null,
        contactoEmergenciaTelefono: formData.contactoEmergenciaTelefono || null
      };

      await api.post('/pacientes', pacienteData);

      alert('✅ Paciente registrado exitosamente');
      cerrarModal();
      cargarPacientes();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al registrar paciente: ' + (error.response?.data?.message || error.message));
    }
  };

  // Actualizar paciente
  const actualizarPaciente = async (e) => {
    e.preventDefault();

    try {
      const pacienteData = {
        documentoIdentidad: formData.documentoIdentidad,
        fechaNacimiento: formData.fechaNacimiento || null,
        telefono: formData.telefono,
        correo: formData.correo,
        direccion: formData.direccion || null,
        tipoSangre: formData.tipoSangre || null,
        alergias: formData.alergias || null,
        contactoEmergenciaNombre: formData.contactoEmergenciaNombre || null,
        contactoEmergenciaTelefono: formData.contactoEmergenciaTelefono || null
      };

      await api.put(`/pacientes/${pacienteEditando.id}`, pacienteData);

      alert('✅ Paciente actualizado exitosamente');
      cerrarModal();
      cargarPacientes();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al actualizar paciente: ' + (error.response?.data?.message || error.message));
    }
  };

  // Eliminar paciente
  const eliminarPaciente = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar al paciente ${nombre}?`)) {
      return;
    }

    try {
      await api.delete(`/pacientes/${id}`);
      alert('✅ Paciente eliminado exitosamente');
      cargarPacientes();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al eliminar paciente: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
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
              <Link to="/recepcionista/citas" className="text-gray-600 hover:text-gray-900">Citas</Link>
              <Link to="/recepcionista/medicos" className="text-gray-600 hover:text-gray-900">Médicos</Link>
              <Link to="/recepcionista/horarios" className="text-gray-600 hover:text-gray-900">Horarios</Link>
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

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Pacientes</h1>
          <p className="text-gray-600">Administra los pacientes de la clínica</p>
        </div>

        {/* Búsqueda y botón crear */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, DPI o correo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button 
              onClick={abrirModalCrear}
              className="btn-primary flex items-center space-x-2 whitespace-nowrap"
            >
              <Plus size={20} />
              <span>Nuevo Paciente</span>
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {pacientesFiltrados.length} pacientes encontrados
          </div>
        </div>

        {/* Grid de pacientes */}
        {pacientesFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {busqueda ? 'No se encontraron pacientes' : 'No hay pacientes registrados'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pacientesFiltrados.map((paciente) => (
              <div key={paciente.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-purple/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-purple">
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
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total de citas:</span>
                    <span className="font-semibold text-gray-800">{paciente.totalCitas || 0}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => abrirModalEditar(paciente)}
                    className="flex-1 btn-outline flex items-center justify-center space-x-1"
                  >
                    <Edit size={16} />
                    <span>Editar</span>
                  </button>
                  <button 
                    onClick={() => eliminarPaciente(paciente.id, `${paciente.nombre} ${paciente.apellido}`)}
                    className="btn-outline text-red-600 border-red-200 hover:bg-red-50 px-3"
                  >
                    <Trash2 size={16} />
                  </button>
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
                {modoEdicion ? 'Editar Paciente' : 'Registrar Nuevo Paciente'}
              </h2>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={modoEdicion ? actualizarPaciente : crearPaciente} className="p-6 space-y-6">
              {/* Información Personal */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DPI / Documento de Identidad
                    </label>
                    <input
                      type="text"
                      name="documentoIdentidad"
                      value={formData.documentoIdentidad}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Información Médica */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Médica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Sangre
                    </label>
                    <select
                      name="tipoSangre"
                      value={formData.tipoSangre}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alergias
                    </label>
                    <textarea
                      name="alergias"
                      value={formData.alergias}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Ej: Penicilina, polen, maní..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Contacto de Emergencia */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contacto de Emergencia</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="contactoEmergenciaNombre"
                      value={formData.contactoEmergenciaNombre}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="contactoEmergenciaTelefono"
                      value={formData.contactoEmergenciaTelefono}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Credenciales (solo crear) */}
              {!modoEdicion && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Credenciales de Acceso
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start space-x-3">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-blue-800">
                      Estas credenciales permitirán al paciente acceder al sistema para agendar citas y ver su historial.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo (para login) *
                      </label>
                      <input
                        type="email"
                        name="correoLogin"
                        value={formData.correoLogin}
                        onChange={handleChange}
                        required={!modoEdicion}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required={!modoEdicion}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
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
                  className="flex-1 btn-primary"
                >
                  {modoEdicion ? 'Guardar Cambios' : 'Registrar Paciente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecepcionistaPacientes;