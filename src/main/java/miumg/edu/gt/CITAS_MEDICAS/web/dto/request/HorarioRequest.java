// src/main/java/miumg/edu/gt/CITAS_MEDICAS/web/dto/request/HorarioRequest.java
package miumg.edu.gt.CITAS_MEDICAS.web.dto.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;

public class HorarioRequest {
    
    @NotNull(message = "El ID del médico es obligatorio")
    private Integer idMedico;
    
    @NotNull(message = "El día de la semana es obligatorio")
    private String diaSemana; // "Lunes", "Martes", etc.
    
    @NotNull(message = "La hora de inicio es obligatoria")
    private LocalTime horaInicio;
    
    @NotNull(message = "La hora de fin es obligatoria")
    private LocalTime horaFin;

    // Getters y Setters
    public Integer getIdMedico() {
        return idMedico;
    }

    public void setIdMedico(Integer idMedico) {
        this.idMedico = idMedico;
    }

    public String getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(String diaSemana) {
        this.diaSemana = diaSemana;
    }

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
}