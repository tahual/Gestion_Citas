// src/main/java/miumg/edu/gt/CITAS_MEDICAS/web/dto/response/SlotDisponibleResponse.java
// VERSIÓN SIMPLIFICADA: 1 CITA = 1 HORA
package miumg.edu.gt.CITAS_MEDICAS.web.dto.response;

import java.time.LocalTime;

public class SlotDisponibleResponse {
    
    private String hora; // "09:00"
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private boolean disponible; // true si NO hay cita, false si YA está ocupado
    private boolean ocupado;

    // Constructor vacío
    public SlotDisponibleResponse() {}

    // Constructor simplificado
    public SlotDisponibleResponse(String hora, LocalTime horaInicio, LocalTime horaFin, boolean ocupado) {
        this.hora = hora;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.ocupado = ocupado;
        this.disponible = !ocupado;
    }

    // Getters y Setters
    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
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

    public boolean isDisponible() {
        return disponible;
    }

    public void setDisponible(boolean disponible) {
        this.disponible = disponible;
    }

    public boolean isOcupado() {
        return ocupado;
    }

    public void setOcupado(boolean ocupado) {
        this.ocupado = ocupado;
    }
}