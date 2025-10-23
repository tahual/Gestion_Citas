package miumg.edu.gt.CITAS_MEDICAS.web.dto.request;

import java.time.LocalTime;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.DiaSemana;

public class HorarioUpdateRequest {
    
    private DiaSemana diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;

    // Getters y Setters
    public DiaSemana getDiaSemana() { return diaSemana; }
    public void setDiaSemana(DiaSemana diaSemana) { this.diaSemana = diaSemana; }
    
    public LocalTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }
    
    public LocalTime getHoraFin() { return horaFin; }
    public void setHoraFin(LocalTime horaFin) { this.horaFin = horaFin; }
}