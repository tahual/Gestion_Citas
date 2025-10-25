// src/main/java/miumg/edu/gt/CITAS_MEDICAS/web/dto/request/MedicoRequest.java
package miumg.edu.gt.CITAS_MEDICAS.web.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class MedicoRequest {
    
    @NotNull(message = "El ID de usuario es obligatorio")
    private Integer idUsuario;
    
    @NotBlank(message = "La especialidad es obligatoria")
    @Size(max = 50)
    private String especialidad;
    
    private Integer anosExperiencia;
    
    private String descripcion;
    
    @Size(max = 50)
    private String consultorio;

    // Getters y Setters
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    
    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }
    
    public Integer getAnosExperiencia() { return anosExperiencia; }
    public void setAnosExperiencia(Integer anosExperiencia) { this.anosExperiencia = anosExperiencia; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public String getConsultorio() { return consultorio; }
    public void setConsultorio(String consultorio) { this.consultorio = consultorio; }
}