// src/main/java/miumg/edu/gt/CITAS_MEDICAS/web/dto/request/CitaRequest.java
// ACTUALIZADO CON horaInicio y horaFin
package miumg.edu.gt.CITAS_MEDICAS.web.dto.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class CitaRequest {
    
    @NotNull(message = "El ID del paciente es obligatorio")
    private Integer idPaciente;
    
    @NotNull(message = "El ID del médico es obligatorio")
    private Integer idMedico;
    
    @NotNull(message = "El ID del horario es obligatorio")
    private Integer idHorario;
    
    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;
    
    // NUEVO: Hora específica de la cita (slot)
    @NotNull(message = "La hora de inicio es obligatoria")
    private LocalTime horaInicio;
    
    @NotNull(message = "La hora de fin es obligatoria")
    private LocalTime horaFin;
    
    private String motivoConsulta;
    
    // Getters y Setters
    public Integer getIdPaciente() { 
        return idPaciente; 
    }
    
    public void setIdPaciente(Integer idPaciente) { 
        this.idPaciente = idPaciente; 
    }
    
    public Integer getIdMedico() { 
        return idMedico; 
    }
    
    public void setIdMedico(Integer idMedico) { 
        this.idMedico = idMedico; 
    }
    
    public Integer getIdHorario() { 
        return idHorario; 
    }
    
    public void setIdHorario(Integer idHorario) { 
        this.idHorario = idHorario; 
    }
    
    public LocalDate getFecha() { 
        return fecha; 
    }
    
    public void setFecha(LocalDate fecha) { 
        this.fecha = fecha; 
    }
    
    // NUEVO
    public LocalTime getHoraInicio() {
        return horaInicio;
    }
    
    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }
    
    public LocalTime getHoraFin() {
        return horaFin;
    }
    
    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }
    
    public String getMotivoConsulta() { 
        return motivoConsulta; 
    }
    
    public void setMotivoConsulta(String motivoConsulta) { 
        this.motivoConsulta = motivoConsulta; 
    }
}