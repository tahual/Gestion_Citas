// src/pages/RegistroPaciente.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Eye, EyeOff } from 'lucide-react';

const RegistroPaciente = () => {
  const navigate = useNavigate();
  const { registro } = useAuth();
  
  const [formData, setFormData] = useState({
    // Información Personal
    nombre: '',
    apellido: '',
    documentoIdentidad: '',
    fechaNacimiento: '',
    tipoSangre: '',
    direccion: '',
    alergias: '',
    
    // Información de Contacto
    telefono: '',
    correo: '',
    
    // Contacto de Emergencia
    contactoEmergenciaNombre: '',
    contactoEmergenciaTelefono: '',
    
    // Credenciales
    password: '',
    confirmarPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Primero registrar usuario
      const usuarioData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        telefono: formData.telefono,
        password: formData.password,
        tipoUsuario: 'Paciente',
      };

      await registro(usuarioData);
      
      // Redirigir al dashboard
      navigate('/paciente/dashboard');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al registrar. Por favor intenta de nuevo.');
      }
      console.error('Error en registro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Registro de Paciente
          </h1>
          <p className="text-gray-600">
            Completa tus datos personales para crear tu cuenta
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Información Personal */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Información Personal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Tus apellidos"
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DPI o Documento *
                  </label>
                  <input
                    type="text"
                    name="documentoIdentidad"
                    value={formData.documentoIdentidad}
                    onChange={handleChange}
                    placeholder="1234567890123"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Sangre
                  </label>
                  <select
                    name="tipoSangre"
                    value={formData.tipoSangre}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Seleccionar tipo de sangre</option>
                    {tiposSangre.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Dirección completa"
                    required
                    className="input-field"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alergias e Información Médica Relevante
                  </label>
                  <textarea
                    name="alergias"
                    value={formData.alergias}
                    onChange={handleChange}
                    placeholder="Describe cualquier alergia o condición médica importante..."
                    rows={3}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Información de Contacto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="12345678"
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Contacto de Emergencia */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Contacto de Emergencia
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Contacto
                  </label>
                  <input
                    type="text"
                    name="contactoEmergenciaNombre"
                    value={formData.contactoEmergenciaNombre}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de Emergencia
                  </label>
                  <input
                    type="tel"
                    name="contactoEmergenciaTelefono"
                    value={formData.contactoEmergenciaTelefono}
                    onChange={handleChange}
                    placeholder="12345678"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Credenciales de Acceso */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Credenciales de Acceso
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      required
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmarPassword"
                      value={formData.confirmarPassword}
                      onChange={handleChange}
                      placeholder="Repetir contraseña"
                      required
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Link a login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroPaciente;
