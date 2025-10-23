package miumg.edu.gt.CITAS_MEDICAS.web.dto.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.DiaSemana;

public class HorarioRequest {
    
    @NotNull
    private Integer idMedico;
    
    private DiaSemana diaSemana;
    
    @NotNull
    private LocalTime horaInicio;
    
    @NotNull
    private LocalTime horaFin;

    // Getters y Setters
    public Integer getIdMedico() { return idMedico; }
    public void setIdMedico(Integer idMedico) { this.idMedico = idMedico; }
    public DiaSemana getDiaSemana() { return diaSemana; }
    public void setDiaSemana(DiaSemana diaSemana) { this.diaSemana = diaSemana; }
    public LocalTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }
    public LocalTime getHoraFin() { return horaFin; }
    public void setHoraFin(LocalTime horaFin) { this.horaFin = horaFin; }
}