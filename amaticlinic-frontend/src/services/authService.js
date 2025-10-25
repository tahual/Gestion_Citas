// src/services/authService.js - CORREGIDO PARA LoginResponse
import api from './api';

const authService = {
  // Login
  async login(correo, password) {
    const response = await api.post('/auth/login', { correo, password });
    console.log('🔐 Respuesta del login:', response.data);
    
    const { token, idUsuario, nombre, apellido, correo: email, rol, idPerfil } = response.data;
    
    // Mapear los campos del backend al formato que espera el frontend
    const userData = {
      id: idUsuario,        // ← Mapear idUsuario a id
      nombre,
      apellido,
      correo: email,
      rol: rol,             // Ya es string en el backend
      idPerfil              // Extra: ID del perfil (Medico/Paciente)
    };
    
    // Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log('💾 Token guardado:', token);
    console.log('💾 Usuario guardado:', userData);
    
    // Devolver en el formato original para compatibilidad
    return {
      token,
      ...userData
    };
  },

  // Registro
  async registro(data) {
    const response = await api.post('/auth/registro', data);
    console.log('🔐 Respuesta del registro:', response.data);
    
    const { token, idUsuario, nombre, apellido, correo: email, rol, idPerfil } = response.data;
    
    // Mapear los campos del backend al formato que espera el frontend
    const userData = {
      id: idUsuario,        // ← Mapear idUsuario a id
      nombre,
      apellido,
      correo: email,
      rol: rol,
      idPerfil
    };
    
    // Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log('💾 Token guardado:', token);
    console.log('💾 Usuario guardado:', userData);
    
    return {
      token,
      ...userData
    };
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      console.log('👤 Usuario desde localStorage:', user);
      return user;
    }
    return null;
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Obtener token
  getToken() {
    return localStorage.getItem('token');
  },
};

export default authService;