package miumg.edu.gt.CITAS_MEDICAS.web.dto.response;

import miumg.edu.gt.CITAS_MEDICAS.domain.enums.TipoUsuario;

public class UsuarioResponse {
    private Integer id;
    private String nombre;
    private String apellido;
    private String correo;
    private String telefono;
    private TipoUsuario tipoUsuario;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public TipoUsuario getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(TipoUsuario tipoUsuario) { this.tipoUsuario = tipoUsuario; }
}