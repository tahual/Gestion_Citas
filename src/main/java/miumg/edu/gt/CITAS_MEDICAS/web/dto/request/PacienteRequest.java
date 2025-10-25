// src/main/java/miumg/edu/gt/CITAS_MEDICAS/web/dto/request/PacienteRequest.java
package miumg.edu.gt.CITAS_MEDICAS.web.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class PacienteRequest {
    
    @NotNull(message = "El ID de usuario es obligatorio")
    private Integer idUsuario;
    
    @Size(max = 50)
    private String documentoIdentidad;
    
    private LocalDate fechaNacimiento;
    
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
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    
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