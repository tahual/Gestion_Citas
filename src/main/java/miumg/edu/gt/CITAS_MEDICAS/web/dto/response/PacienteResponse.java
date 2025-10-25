// src/main/java/miumg/edu/gt/CITAS_MEDICAS/web/dto/response/PacienteResponse.java
package miumg.edu.gt.CITAS_MEDICAS.web.dto.response;

import java.time.LocalDate;

public class PacienteResponse {
    private Integer id;
    private Integer idUsuario;
    private String nombre;
    private String apellido;
    private String correo;
    private String telefono;
    private String documentoIdentidad;
    private LocalDate fechaNacimiento;
    private String direccion;
    private String tipoSangre;
    private String alergias;
    private String contactoEmergenciaNombre;
    private String contactoEmergenciaTelefono;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    
    public String getDocumentoIdentidad() { return documentoIdentidad; }
    public void setDocumentoIdentidad(String documentoIdentidad) { this.documentoIdentidad = documentoIdentidad; }
    
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    
    public String getTipoSangre() { return tipoSangre; }
    public void setTipoSangre(String tipoSangre) { this.tipoSangre = tipoSangre; }
    
    public String getAlergias() { return alergias; }
    public void setAlergias(String alergias) { this.alergias = alergias; }
    
    public String getContactoEmergenciaNombre() { return contactoEmergenciaNombre; }
    public void setContactoEmergenciaNombre(String contactoEmergenciaNombre) { 
        this.contactoEmergenciaNombre = contactoEmergenciaNombre; 
    }
    
    public String getContactoEmergenciaTelefono() { return contactoEmergenciaTelefono; }
    public void setContactoEmergenciaTelefono(String contactoEmergenciaTelefono) { 
        this.contactoEmergenciaTelefono = contactoEmergenciaTelefono; 
    }
}