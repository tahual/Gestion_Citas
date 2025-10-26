// src/main/java/miumg/edu/gt/CITAS_MEDICAS/domain/entity/Cita.java
// ACTUALIZADO CON hora_inicio y hora_fin
package miumg.edu.gt.CITAS_MEDICAS.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.EstadoCita;

/**
 *
 * @author danyt
 */
@Entity
@Table(name = "Cita", schema = "CitasMedicas")
public class Cita {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cita")
    private Integer id;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_medico", nullable = false)
    private Medico medico;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_horario", nullable = false)
    private Horario horario;
    
    @Column(nullable = false)
    private LocalDate fecha;
    
    // NUEVO: Hora específica de la cita
    @NotNull
    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;
    
    @NotNull
    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EstadoCita estado = EstadoCita.Agendada;
    
    @Column(name = "motivo_consulta", columnDefinition = "TEXT")
    private String motivoConsulta;
    
    @OneToMany(mappedBy = "cita")
    private List<Notificacion> notificaciones = new ArrayList<>();
    
    // Getters y Setters
    public Integer getId() { 
        return id; 
    }
    
    public void setId(Integer id) { 
        this.id = id; 
    }
    
    public Paciente getPaciente() { 
        return paciente; 
    }
    
    public void setPaciente(Paciente paciente) { 
        this.paciente = paciente; 
    }
    
    public Medico getMedico() { 
        return medico; 
    }
    
    public void setMedico(Medico medico) { 
        this.medico = medico; 
    }
    
    public Horario getHorario() { 
        return horario; 
    }
    
    public void setHorario(Horario horario) { 
        this.horario = horario; 
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
    
    public EstadoCita getEstado() { 
        return estado; 
    }
    
    public void setEstado(EstadoCita estado) { 
        this.estado = estado; 
    }
    
    public String getMotivoConsulta() { 
        return motivoConsulta; 
    }
    
    public void setMotivoConsulta(String motivoConsulta) { 
        this.motivoConsulta = motivoConsulta; 
    }
    
    public List<Notificacion> getNotificaciones() { 
        return notificaciones; 
    }
    
    public void setNotificaciones(List<Notificacion> notificaciones) { 
        this.notificaciones = notificaciones; 
    }
}