// src/pages/recepcionista/Citas.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Calendar, Filter, Search, X, Stethoscope, LogOut, Clock
} from 'lucide-react';

const RecepcionistaCitas = () => {
  const { user, logout } = useAuth();
  const [citas, setCitas] = useState([]);
  const [citasFiltradas, setCitasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarCitas();
  }, []);

  useEffect(() => {
    filtrarCitas();
  }, [filtro, busqueda, citas]);

  const cargarCitas = async () => {
    try {
      const response = await api.get('/citas');
      setCitas(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarCitas = () => {
    let resultado = [...citas];
    const hoy = new Date();

    // Filtro por búsqueda
    if (busqueda) {
      resultado = resultado.filter(c =>
        c.nombrePaciente.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.nombreMedico.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtro por estado
    switch (filtro) {
      case 'hoy':
        const hoyStr = hoy.toISOString().split('T')[0];
        resultado = resultado.filter(c => c.fecha === hoyStr);
        break;
      case 'proximas':
        resultado = resultado.filter(c => new Date(c.fecha) >= hoy && c.estado === 'Agendada');
        break;
      case 'completadas':
        resultado = resultado.filter(c => c.estado === 'Completada');
        break;
      case 'canceladas':
        resultado = resultado.filter(c => c.estado === 'Cancelada');
        break;
    }

    resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    setCitasFiltradas(resultado);
  };

  const cancelarCita = async (id) => {
    if (window.confirm('¿Cancelar esta cita?')) {
      try {
        await api.put(`/citas/${id}/cancelar`);
        alert('Cita cancelada');
        cargarCitas();
      } catch (error) {
        alert('Error al cancelar');
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
              <Link to="/recepcionista/citas" className="text-primary font-medium">Citas</Link>
              <Link to="/recepcionista/medicos" className="text-gray-600 hover:text-gray-900">Médicos</Link>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Citas</h1>
          <p className="text-gray-600">Administra todas las citas de la clínica</p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar paciente o médico..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Filtrar:</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['todas', 'hoy', 'proximas', 'completadas', 'canceladas'].map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  filtro === f
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="text-sm font-medium capitalize">{f}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tabla de citas */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {citasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay citas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Hora</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Paciente</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Médico</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {citasFiltradas.map((cita) => (
                    <tr key={cita.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-GT')}
                      </td>
                      <td className="py-3 px-4">{cita.horaInicio}</td>
                      <td className="py-3 px-4">{cita.nombrePaciente}</td>
                      <td className="py-3 px-4">Dr. {cita.nombreMedico}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(cita.estado)}`}>
                          {cita.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {cita.estado === 'Agendada' && (
                          <button
                            onClick={() => cancelarCita(cita.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecepcionistaCitas;
