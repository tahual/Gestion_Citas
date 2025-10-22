/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package miumg.edu.gt.CITAS_MEDICAS.service.impl;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Cita;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Horario;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Medico;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Paciente;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.DiaSemana;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.EstadoCita;
import miumg.edu.gt.CITAS_MEDICAS.repository.CitaRepository;
import miumg.edu.gt.CITAS_MEDICAS.repository.HorarioRepository;
import miumg.edu.gt.CITAS_MEDICAS.repository.MedicoRepository;
import miumg.edu.gt.CITAS_MEDICAS.repository.PacienteRepository;
import miumg.edu.gt.CITAS_MEDICAS.service.CitaService;
import miumg.edu.gt.CITAS_MEDICAS.service.NotificacionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author danyt
 */
@Service
@Transactional
public class CitaServiceImpl implements CitaService {

    private final CitaRepository citaRepo;
    private final PacienteRepository pacienteRepo;
    private final MedicoRepository medicoRepo;
    private final HorarioRepository horarioRepo;
    private final NotificacionService notificacionService;

    public CitaServiceImpl(
            CitaRepository citaRepo,
            PacienteRepository pacienteRepo,
            MedicoRepository medicoRepo,
            HorarioRepository horarioRepo,
            NotificacionService notificacionService
    ) {
        this.citaRepo = citaRepo;
        this.pacienteRepo = pacienteRepo;
        this.medicoRepo = medicoRepo;
        this.horarioRepo = horarioRepo;
        this.notificacionService = notificacionService;
    }

    @Override
    public Cita agendar(Integer idPaciente, Integer idMedico, Integer idHorario, LocalDate fecha) {
        Paciente paciente = pacienteRepo.findById(idPaciente)
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));
        Medico medico = medicoRepo.findById(idMedico)
                .orElseThrow(() -> new IllegalArgumentException("Medico no encontrado"));
        Horario horario = horarioRepo.findById(idHorario)
                .orElseThrow(() -> new IllegalArgumentException("Horario no encontrado"));

        // Validar que el horario pertenece al mismo medico
        if (!horario.getMedico().getId().equals(medico.getId())) {
            throw new IllegalArgumentException("El horario no pertenece al médico indicado");
        }

        // Validar que el día de la fecha coincide con el dia_semana del horario
        DiaSemana diaHorario = horario.getDiaSemana();
        if (!diaSemanaDe(fecha).equals(diaHorario)) {
            throw new IllegalArgumentException("La fecha no coincide con el día del horario (" + diaHorario + ")");
        }

        // Validar que no hay cita previa en ese horario y fecha con estado Agendada/Modificada
        boolean ocupado = citaRepo.existsByHorarioAndFechaAndEstadoIn(
                horario,
                fecha,
                List.of(EstadoCita.Agendada, EstadoCita.Modificada)
        );
        if (ocupado) throw new IllegalStateException("El horario ya está ocupado para esa fecha");

        Cita c = new Cita();
        c.setPaciente(paciente);
        c.setMedico(medico);
        c.setHorario(horario);
        c.setFecha(fecha);
        c.setEstado(EstadoCita.Agendada);

        Cita guardada = citaRepo.save(c);

        // Side-effect: notificación (ejemplo simple)
        notificacionService.enviar(guardada, miumg.edu.gt.CITAS_MEDICAS.domain.enums.TipoNotificacion.correo,
                "Cita agendada para " + fecha);

        return guardada;
    }

    @Override
    public Cita cambiarEstado(Integer idCita, EstadoCita nuevoEstado, String motivo) {
        Cita c = citaRepo.findById(idCita)
                .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada"));
        c.setEstado(nuevoEstado);
        Cita guardada = citaRepo.save(c);

        if (nuevoEstado == EstadoCita.Cancelada) {
            notificacionService.enviar(guardada, miumg.edu.gt.CITAS_MEDICAS.domain.enums.TipoNotificacion.correo,
                    "Cita cancelada. " + (motivo != null ? motivo : ""));
        }
        return guardada;
    }

    @Override
    public Cita reprogramar(Integer idCita, Integer nuevoIdHorario, LocalDate nuevaFecha) {
        Cita c = citaRepo.findById(idCita)
                .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada"));

        Horario nuevo = horarioRepo.findById(nuevoIdHorario)
                .orElseThrow(() -> new IllegalArgumentException("Horario no encontrado"));

        if (!nuevo.getMedico().getId().equals(c.getMedico().getId())) {
            throw new IllegalArgumentException("El nuevo horario no pertenece al mismo médico");
        }
        if (!diaSemanaDe(nuevaFecha).equals(nuevo.getDiaSemana())) {
            throw new IllegalArgumentException("La nueva fecha no coincide con el día del nuevo horario");
        }
        boolean ocupado = citaRepo.existsByHorarioAndFechaAndEstadoIn(
                nuevo,
                nuevaFecha,
                List.of(EstadoCita.Agendada, EstadoCita.Modificada)
        );
        if (ocupado) throw new IllegalStateException("El nuevo horario está ocupado para esa fecha");

        c.setHorario(nuevo);
        c.setFecha(nuevaFecha);
        c.setEstado(EstadoCita.Modificada);

        Cita guardada = citaRepo.save(c);

        notificacionService.enviar(guardada, miumg.edu.gt.CITAS_MEDICAS.domain.enums.TipoNotificacion.correo,
                "Cita reprogramada para " + nuevaFecha);

        return guardada;
    }

    @Override @Transactional(readOnly = true)
    public List<Cita> listarPorMedicoYFecha(Integer idMedico, LocalDate fecha) {
        Medico medico = medicoRepo.findById(idMedico)
                .orElseThrow(() -> new IllegalArgumentException("Medico no encontrado"));
        return citaRepo.findByMedicoAndFecha(medico, fecha);
    }

    @Override @Transactional(readOnly = true)
    public List<Cita> listarPorPaciente(Integer idPaciente) {
        Paciente p = pacienteRepo.findById(idPaciente)
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));
        return citaRepo.findByPacienteOrderByFechaDesc(p);
    }

    private static DiaSemana diaSemanaDe(LocalDate fecha) {
        Map<DayOfWeek, DiaSemana> map = Map.of(
                DayOfWeek.MONDAY, DiaSemana.Lunes,
                DayOfWeek.TUESDAY, DiaSemana.Martes,
                DayOfWeek.WEDNESDAY, DiaSemana.Miercoles,
                DayOfWeek.THURSDAY, DiaSemana.Jueves,
                DayOfWeek.FRIDAY, DiaSemana.Viernes,
                DayOfWeek.SATURDAY, DiaSemana.Sabado,
                DayOfWeek.SUNDAY, DiaSemana.Domingo
        );
        return map.get(fecha.getDayOfWeek());
    }
}