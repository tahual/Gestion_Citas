// src/main/java/miumg/edu/gt/CITAS_MEDICAS/web/controller/EstadisticasController.java
package miumg.edu.gt.CITAS_MEDICAS.web.controller;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Cita;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.EstadoCita;
import miumg.edu.gt.CITAS_MEDICAS.repository.CitaRepository;
import miumg.edu.gt.CITAS_MEDICAS.repository.MedicoRepository;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.response.EstadisticasResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estadisticas")
@CrossOrigin(origins = "*")
public class EstadisticasController {

    private final CitaRepository citaRepository;
    private final MedicoRepository medicoRepository;

    public EstadisticasController(CitaRepository citaRepository, MedicoRepository medicoRepository) {
        this.citaRepository = citaRepository;
        this.medicoRepository = medicoRepository;
    }

    // Estadísticas para Paciente
    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<EstadisticasResponse> obtenerEstadisticasPaciente(@PathVariable Integer idPaciente) {
        LocalDate hoy = LocalDate.now();
        LocalDate inicioMes = hoy.withDayOfMonth(1);
        LocalDate finMes = hoy.withDayOfMonth(hoy.lengthOfMonth());

        var citas = citaRepository.findAll().stream()
                .filter(c -> c.getPaciente().getId().equals(idPaciente))
                .toList();

        EstadisticasResponse stats = new EstadisticasResponse();

        // Citas programadas (Agendadas o Modificadas en el futuro)
        long citasProgramadas = citas.stream()
                .filter(c -> (c.getEstado() == EstadoCita.Agendada || c.getEstado() == EstadoCita.Modificada) 
                          && !c.getFecha().isBefore(hoy))
                .count();
        stats.setCitasProgramadas((int) citasProgramadas);

        // Días para próxima cita
        var proximaCita = citas.stream()
                .filter(c -> (c.getEstado() == EstadoCita.Agendada || c.getEstado() == EstadoCita.Modificada) 
                          && !c.getFecha().isBefore(hoy))
                .min((c1, c2) -> c1.getFecha().compareTo(c2.getFecha()));
        
        if (proximaCita.isPresent()) {
            long dias = ChronoUnit.DAYS.between(hoy, proximaCita.get().getFecha());
            stats.setDiasProximaCita((int) dias);
        } else {
            stats.setDiasProximaCita(0);
        }

        // Médicos disponibles (todos los médicos activos)
        long medicosDisponibles = medicoRepository.count();
        stats.setMedicosDisponibles((int) medicosDisponibles);

        // Citas este mes
        long citasEsteMes = citas.stream()
                .filter(c -> !c.getFecha().isBefore(inicioMes) && !c.getFecha().isAfter(finMes))
                .count();
        stats.setCitasEsteMes((int) citasEsteMes);

        // Citas próximas (futuras)
        long citasProximas = citas.stream()
                .filter(c -> c.getFecha().isAfter(hoy))
                .count();
        stats.setCitasProximas((int) citasProximas);

        // Citas confirmadas
        long citasConfirmadas = citas.stream()
                .filter(c -> c.getEstado() == EstadoCita.Agendada || c.getEstado() == EstadoCita.Modificada)
                .count();
        stats.setCitasConfirmadas((int) citasConfirmadas);

        // Citas pendientes (Agendadas que no han pasado)
        long citasPendientes = citas.stream()
                .filter(c -> c.getEstado() == EstadoCita.Agendada && !c.getFecha().isBefore(hoy))
                .count();
        stats.setCitasPendientes((int) citasPendientes);

        // Citas pasadas
        long citasPasadas = citas.stream()
                .filter(c -> c.getFecha().isBefore(hoy))
                .count();
        stats.setCitasPasadas((int) citasPasadas);

        // Total de citas
        stats.setCitasTotales(citas.size());

        return ResponseEntity.ok(stats);
    }

    // Estadísticas para Médico
    @GetMapping("/medico/{idMedico}")
    public ResponseEntity<EstadisticasResponse> obtenerEstadisticasMedico(@PathVariable Integer idMedico) {
        LocalDate hoy = LocalDate.now();
        LocalDate inicioMes = hoy.withDayOfMonth(1);
        LocalDate finMes = hoy.withDayOfMonth(hoy.lengthOfMonth());

        var citas = citaRepository.findAll().stream()
                .filter(c -> c.getMedico().getId().equals(idMedico))
                .toList();

        EstadisticasResponse stats = new EstadisticasResponse();

        // Citas programadas
        long citasProgramadas = citas.stream()
                .filter(c -> (c.getEstado() == EstadoCita.Agendada || c.getEstado() == EstadoCita.Modificada) 
                          && !c.getFecha().isBefore(hoy))
                .count();
        stats.setCitasProgramadas((int) citasProgramadas);

        // Próxima cita
        var proximaCita = citas.stream()
                .filter(c -> (c.getEstado() == EstadoCita.Agendada || c.getEstado() == EstadoCita.Modificada) 
                          && !c.getFecha().isBefore(hoy))
                .min((c1, c2) -> c1.getFecha().compareTo(c2.getFecha()));
        
        if (proximaCita.isPresent()) {
            long dias = ChronoUnit.DAYS.between(hoy, proximaCita.get().getFecha());
            stats.setDiasProximaCita((int) dias);
        } else {
            stats.setDiasProximaCita(0);
        }

        // Citas este mes
        long citasEsteMes = citas.stream()
                .filter(c -> !c.getFecha().isBefore(inicioMes) && !c.getFecha().isAfter(finMes))
                .count();
        stats.setCitasEsteMes((int) citasEsteMes);

        stats.setCitasTotales(citas.size());

        return ResponseEntity.ok(stats);
    }
}