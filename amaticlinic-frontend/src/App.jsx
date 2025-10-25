// src/App.jsx - ACTUALIZADO CON RUTA DE PACIENTE DETALLE
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Páginas públicas
import Login from './pages/Login';
import RegistroPaciente from './pages/RegistroPaciente';

// Páginas de Paciente
import PacienteDashboard from './pages/paciente/Dashboard';
import AgendarCita from './pages/paciente/AgendarCita';
import MisCitas from './pages/paciente/MisCitas';
import Medicos from './pages/paciente/Medicos';

// Páginas de Médico
import MedicoDashboard from './pages/medico/Dashboard';
import MedicoCitas from './pages/medico/Citas';
import CitaDetalle from './pages/medico/CitaDetalle';
import MedicoPacientes from './pages/medico/Pacientes';
import PacienteDetalle from './pages/medico/PacienteDetalle'; // ← NUEVO
import MedicoHistorial from './pages/medico/Historial';

// Páginas de Recepcionista
import RecepcionistaDashboard from './pages/recepcionista/Dashboard';
import RecepcionistaCitas from './pages/recepcionista/Citas';
import RecepcionistaMedicos from './pages/recepcionista/Medicos';
import RecepcionistaPacientes from './pages/recepcionista/Pacientes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistroPaciente />} />
          
          {/* Rutas de Paciente */}
          <Route
            path="/paciente/dashboard"
            element={
              <PrivateRoute allowedRoles={['Paciente']}>
                <PacienteDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/paciente/agendar"
            element={
              <PrivateRoute allowedRoles={['Paciente']}>
                <AgendarCita />
              </PrivateRoute>
            }
          />
          <Route
            path="/paciente/mis-citas"
            element={
              <PrivateRoute allowedRoles={['Paciente']}>
                <MisCitas />
              </PrivateRoute>
            }
          />
          <Route
            path="/paciente/medicos"
            element={
              <PrivateRoute allowedRoles={['Paciente']}>
                <Medicos />
              </PrivateRoute>
            }
          />
          
          {/* Rutas de Médico */}
          <Route
            path="/medico/dashboard"
            element={
              <PrivateRoute allowedRoles={['Medico']}>
                <MedicoDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/medico/citas"
            element={
              <PrivateRoute allowedRoles={['Medico']}>
                <MedicoCitas />
              </PrivateRoute>
            }
          />
          <Route
            path="/medico/citas/:id"
            element={
              <PrivateRoute allowedRoles={['Medico']}>
                <CitaDetalle />
              </PrivateRoute>
            }
          />
          <Route
            path="/medico/pacientes"
            element={
              <PrivateRoute allowedRoles={['Medico']}>
                <MedicoPacientes />
              </PrivateRoute>
            }
          />
          {/* NUEVA RUTA - Detalle del paciente */}
          <Route
            path="/medico/pacientes/:id"
            element={
              <PrivateRoute allowedRoles={['Medico']}>
                <PacienteDetalle />
              </PrivateRoute>
            }
          />
          <Route
            path="/medico/historial"
            element={
              <PrivateRoute allowedRoles={['Medico']}>
                <MedicoHistorial />
              </PrivateRoute>
            }
          />
          
          {/* Rutas de Recepcionista */}
          <Route
            path="/recepcionista/dashboard"
            element={
              <PrivateRoute allowedRoles={['Recepcionista']}>
                <RecepcionistaDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/recepcionista/citas"
            element={
              <PrivateRoute allowedRoles={['Recepcionista']}>
                <RecepcionistaCitas />
              </PrivateRoute>
            }
          />
          <Route
            path="/recepcionista/medicos"
            element={
              <PrivateRoute allowedRoles={['Recepcionista']}>
                <RecepcionistaMedicos />
              </PrivateRoute>
            }
          />
          <Route
            path="/recepcionista/pacientes"
            element={
              <PrivateRoute allowedRoles={['Recepcionista']}>
                <RecepcionistaPacientes />
              </PrivateRoute>
            }
          />
          
          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;