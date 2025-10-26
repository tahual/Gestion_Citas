// src/main/java/miumg/edu/gt/CITAS_MEDICAS/web/dto/request/PacienteUpdateRequest.java
// ACTUALIZADO - Con todos los campos editables
package miumg.edu.gt.CITAS_MEDICAS.web.dto.request;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class PacienteUpdateRequest {
    
    @Size(max = 50)
    private String documentoIdentidad;
    
    private LocalDate fechaNacimiento;
    
    @Size(max = 20)
    private String telefono;
    
    @Size(max = 100)
    private String correo;
    
    @Size(max = 150)
    private String direccion;
    
    @Size(max = 10)
    private String tipoSangre;
    
    private String alergias;
    
    @Size(max = 100)
    private String contactoEmergenciaNombre;
    
    @Size(max = 20)
    private String contactoEmergenciaTelefono;
    
    // Getters y Setters
    public String getDocumentoIdentidad() {
        return documentoIdentidad;
    }
    
    public void setDocumentoIdentidad(String documentoIdentidad) {
        this.documentoIdentidad = documentoIdentidad;
    }
    
    public LocalDate getFechaNacimiento() { 
        return fechaNacimiento; 
    }
    
    public void setFechaNacimiento(LocalDate fechaNacimiento) { 
        this.fechaNacimiento = fechaNacimiento; 
    }
    
    public String getTelefono() {
        return telefono;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    
    public String getCorreo() {
        return correo;
    }
    
    public void setCorreo(String correo) {
        this.correo = correo;
    }
    
    public String getDireccion() { 
        return direccion; 
    }
    
    public void setDireccion(String direccion) { 
        this.direccion = direccion; 
    }
    
    public String getTipoSangre() {
        return tipoSangre;
    }
    
    public void setTipoSangre(String tipoSangre) {
        this.tipoSangre = tipoSangre;
    }
    
    public String getAlergias() {
        return alergias;
    }
    
    public void setAlergias(String alergias) {
        this.alergias = alergias;
    }
    
    public String getContactoEmergenciaNombre() {
        return contactoEmergenciaNombre;
    }
    
    public void setContactoEmergenciaNombre(String contactoEmergenciaNombre) {
        this.contactoEmergenciaNombre = contactoEmergenciaNombre;
    }
    
    public String getContactoEmergenciaTelefono() {
        return contactoEmergenciaTelefono;
    }
    
    public void setContactoEmergenciaTelefono(String contactoEmergenciaTelefono) {
        this.contactoEmergenciaTelefono = contactoEmergenciaTelefono;
    }
}