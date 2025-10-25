// src/pages/recepcionista/Medicos.jsx - CON CAMPOS COMPLETOS
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Search, UserCog, Stethoscope, LogOut, Plus, Edit, Trash2, 
  Briefcase, MapPin, Phone, Mail, X, Award, FileText
} from 'lucide-react';

const RecepcionistaMedicos = () => {
  const { user, logout } = useAuth();
  const [medicos, setMedicos] = useState([]);
  const [medicosFiltrados, setMedicosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  
  // Estados del modal
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [medicoSeleccionado, setMedicoSeleccionado] = useState(null);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    especialidad: '',
    consultorio: '',
    anosExperiencia: '',
    descripcion: '',
    password: ''
  });

  useEffect(() => {
    cargarMedicos();
  }, []);

  useEffect(() => {
    filtrarMedicos();
  }, [busqueda, medicos]);

  const cargarMedicos = async () => {
    try {
      const response = await api.get('/medicos');
      setMedicos(response.data);
      setMedicosFiltrados(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarMedicos = () => {
    if (!busqueda) {
      setMedicosFiltrados(medicos);
      return;
    }
    const resultado = medicos.filter(m =>
      m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.especialidad.toLowerCase().includes(busqueda.toLowerCase())
    );
    setMedicosFiltrados(resultado);
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setMedicoSeleccionado(null);
    setFormData({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      especialidad: '',
      consultorio: '',
      anosExperiencia: '',
      descripcion: '',
      password: ''
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (medico) => {
    setModoEdicion(true);
    setMedicoSeleccionado(medico);
    setFormData({
      nombre: medico.nombre,
      apellido: medico.apellido,
      correo: medico.correo,
      telefono: medico.telefono || '',
      especialidad: medico.especialidad,
      consultorio: medico.consultorio || '',
      anosExperiencia: medico.anosExperiencia || '',
      descripcion: medico.descripcion || '',
      password: ''
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setMedicoSeleccionado(null);
    setFormData({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      especialidad: '',
      consultorio: '',
      anosExperiencia: '',
      descripcion: '',
      password: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modoEdicion) {
        // Editar médico existente
        await api.put(`/medicos/${medicoSeleccionado.id}`, formData);
        alert('Médico actualizado exitosamente');
      } else {
        // Crear nuevo médico
        await api.post('/medicos', formData);
        alert('Médico creado exitosamente');
      }
      
      cerrarModal();
      cargarMedicos();
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al ${modoEdicion ? 'actualizar' : 'crear'} médico: ${error.response?.data?.message || error.message}`);
    }
  };

  const eliminarMedico = async (id) => {
    if (window.confirm('¿Eliminar este médico? Esta acción no se puede deshacer.')) {
      try {
        await api.delete(`/medicos/${id}`);
        alert('Médico eliminado');
        cargarMedicos();
      } catch (error) {
        alert('Error al eliminar');
      }
    }
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
              <Link to="/recepcionista/medicos" className="text-primary font-medium">Médicos</Link>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Médicos</h1>
          <p className="text-gray-600">Administra el personal médico de la clínica</p>
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar médico..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button 
              onClick={abrirModalCrear}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Nuevo Médico</span>
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {medicosFiltrados.length} médicos encontrados
          </div>
        </div>

        {/* Grid de médicos */}
        {medicosFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <UserCog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay médicos registrados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicosFiltrados.map((medico) => (
              <div key={medico.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-success">
                        {medico.nombre.charAt(0)}{medico.apellido.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        Dr. {medico.nombre} {medico.apellido}
                      </h3>
                      <p className="text-primary font-medium">{medico.especialidad}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {medico.anosExperiencia > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Award size={16} className="mr-2 text-gray-400" />
                      <span>{medico.anosExperiencia} años de experiencia</span>
                    </div>
                  )}
                  {medico.consultorio && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-2 text-gray-400" />
                      <span>Consultorio {medico.consultorio}</span>
                    </div>
                  )}
                  {medico.telefono && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone size={16} className="mr-2 text-gray-400" />
                      <span>{medico.telefono}</span>
                    </div>
                  )}
                  {medico.correo && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail size={16} className="mr-2 text-gray-400" />
                      <span className="truncate">{medico.correo}</span>
                    </div>
                  )}
                </div>

                {medico.descripcion && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{medico.descripcion}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button 
                    onClick={() => abrirModalEditar(medico)}
                    className="flex-1 btn-outline text-sm py-2"
                  >
                    <Edit size={16} className="inline mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarMedico(medico.id)}
                    className="px-3 py-2 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {modoEdicion ? 'Editar Médico' : 'Nuevo Médico'}
                </h2>
                <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Apellido */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Correo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo *
                    </label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Especialidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialidad *
                    </label>
                    <input
                      type="text"
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Consultorio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultorio
                    </label>
                    <input
                      type="text"
                      name="consultorio"
                      value={formData.consultorio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Años de Experiencia - NUEVO */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Años de Experiencia
                    </label>
                    <input
                      type="number"
                      name="anosExperiencia"
                      value={formData.anosExperiencia}
                      onChange={handleInputChange}
                      min="0"
                      max="50"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Password (solo al crear) */}
                  {!modoEdicion && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={!modoEdicion}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}
                </div>

                {/* Descripción - NUEVO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción / Biografía
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Especialista en medicina interna con amplia experiencia..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

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
                    {modoEdicion ? 'Actualizar' : 'Crear'} Médico
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

export default RecepcionistaMedicos;