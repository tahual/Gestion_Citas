package miumg.edu.gt.CITAS_MEDICAS.web.dto.response;

import miumg.edu.gt.CITAS_MEDICAS.domain.enums.TipoUsuario;

public class LoginResponse {
    private String token;
    private String tipo = "Bearer";
    private Integer idUsuario;
    private String nombre;
    private String apellido;
    private String correo;
    private TipoUsuario rol;
    private Integer idPerfil; // ID de Medico, Paciente o null si es Recepcionista

    // Getters y Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    
    public TipoUsuario getRol() { return rol; }
    public void setRol(TipoUsuario rol) { this.rol = rol; }
    
    public Integer getIdPerfil() { return idPerfil; }
    public void setIdPerfil(Integer idPerfil) { this.idPerfil = idPerfil; }
}