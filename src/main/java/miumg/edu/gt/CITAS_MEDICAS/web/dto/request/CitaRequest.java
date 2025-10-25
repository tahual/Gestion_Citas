// src/main/java/miumg/edu/gt/CITAS_MEDICAS/web/dto/request/CitaRequest.java
package miumg.edu.gt.CITAS_MEDICAS.web.dto.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CitaRequest {
    
    @NotNull(message = "El ID del paciente es obligatorio")
    private Integer idPaciente;
    
    @NotNull(message = "El ID del médico es obligatorio")
    private Integer idMedico;
    
    @NotNull(message = "El ID del horario es obligatorio")
    private Integer idHorario;
    
    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;
    
    private String motivoConsulta;

    // Getters y Setters
    public Integer getIdPaciente() { return idPaciente; }
    public void setIdPaciente(Integer idPaciente) { this.idPaciente = idPaciente; }
    
    public Integer getIdMedico() { return idMedico; }
    public void setIdMedico(Integer idMedico) { this.idMedico = idMedico; }
    
    public Integer getIdHorario() { return idHorario; }
    public void setIdHorario(Integer idHorario) { this.idHorario = idHorario; }
    
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    
    public String getMotivoConsulta() { return motivoConsulta; }
    public void setMotivoConsulta(String motivoConsulta) { this.motivoConsulta = motivoConsulta; }
}