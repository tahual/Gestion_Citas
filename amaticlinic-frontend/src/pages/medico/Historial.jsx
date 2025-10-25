// src/pages/medico/Historial.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText,
  Stethoscope,
  LogOut,
  Search,
  Plus
} from 'lucide-react';

const MedicoHistorial = () => {
  const { user, logout } = useAuth();

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
              <Link to="/medico/dashboard" className="text-gray-600 hover:text-gray-900">
                Inicio
              </Link>
              <Link to="/medico/citas" className="text-gray-600 hover:text-gray-900">
                Mis Citas
              </Link>
              <Link to="/medico/pacientes" className="text-gray-600 hover:text-gray-900">
                Pacientes
              </Link>
              <Link to="/medico/historial" className="text-primary font-medium">
                Historial
              </Link>
              
              <div className="border-l pl-6 flex items-center space-x-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-800">Dr. {user.nombre}</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Historial Médico</h1>
          <p className="text-gray-600">Gestiona los historiales médicos de tus pacientes</p>
        </div>

        {/* Búsqueda y acciones */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar paciente..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button className="btn-primary flex items-center justify-center space-x-2">
              <Plus size={20} />
              <span>Crear Historial</span>
            </button>
          </div>
        </div>

        {/* Placeholder */}
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Historial Médico
          </h3>
          <p className="text-gray-500 mb-6">
            Aquí podrás crear y consultar los historiales médicos de tus pacientes.<br />
            Esta funcionalidad estará disponible próximamente.
          </p>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg text-left">
              <h4 className="font-semibold text-blue-900 mb-1">✨ Próximamente</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Crear historiales médicos después de cada consulta</li>
                <li>• Ver historial completo de cada paciente</li>
                <li>• Agregar diagnósticos y tratamientos</li>
                <li>• Registrar recetas y medicamentos</li>
                <li>• Adjuntar exámenes y estudios</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicoHistorial;
