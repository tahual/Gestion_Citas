// src/pages/medico/Citas.jsx - CORREGIDO
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Calendar, Filter, Clock, User, Stethoscope, LogOut,
  CheckCircle, XCircle
} from 'lucide-react';

const MedicoCitas = () => {
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [citasFiltradas, setCitasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas');

  useEffect(() => {
    if (user.idPerfil) {
      cargarCitas();
    }
  }, [user.idPerfil]);

  useEffect(() => {
    filtrarCitas();
  }, [filtro, citas]);

  const cargarCitas = async () => {
    try {
      const response = await api.get(`/citas/medico/${user.idPerfil}`);
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
    hoy.setHours(0, 0, 0, 0);

    switch (filtro) {
      case 'hoy':
        const hoyStr = new Date().toISOString().split('T')[0];
        resultado = resultado.filter(c => c.fecha === hoyStr);
        break;
      case 'proximas':
        resultado = resultado.filter(c => 
          new Date(c.fecha) >= hoy && c.estado === 'Agendada'
        );
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

  const completarCita = async (id) => {
    if (window.confirm('¿Marcar esta cita como completada?')) {
      try {
        await api.put(`/citas/${id}/completar`);
        alert('Cita completada exitosamente');
        cargarCitas();
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
                <button className="text-gray-600 hover:text-red-600">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Citas</h1>
          <p className="text-gray-600">Gestiona tus consultas médicas</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Filtrar por:</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['todas', 'hoy', 'proximas', 'completadas', 'canceladas'].map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                  filtro === f
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {f === 'proximas' ? 'Próximas' : f}
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {citasFiltradas.length} citas encontradas
          </div>
        </div>

        {/* Lista de citas */}
        <div className="space-y-4">
          {citasFiltradas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay citas en esta categoría</p>
            </div>
          ) : (
            citasFiltradas.map((cita) => (
              <div key={cita.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {cita.nombrePaciente}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(cita.estado)}`}>
                        {cita.estado}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        <span>
                          {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-GT', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span>{cita.horaInicio} - {cita.horaFin}</span>
                      </div>
                      {cita.consultorio && (
                        <div className="flex items-center text-gray-600">
                          <User size={16} className="mr-2" />
                          <span>Consultorio {cita.consultorio}</span>
                        </div>
                      )}
                    </div>

                    {cita.motivoConsulta && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Motivo de Consulta:</p>
                        <p className="text-sm text-gray-600 mt-1">{cita.motivoConsulta}</p>
                      </div>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/medico/citas/${cita.id}`}
                      className="btn-outline text-sm py-2 px-4 text-center"
                    >
                      Ver Detalle
                    </Link>
                    {cita.estado === 'Agendada' && (
                      <button
                        onClick={() => completarCita(cita.id)}
                        className="btn-primary text-sm py-2 px-4 flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} />
                        Completar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicoCitas;