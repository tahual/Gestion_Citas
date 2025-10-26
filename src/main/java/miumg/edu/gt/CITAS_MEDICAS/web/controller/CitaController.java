// src/main/java/miumg/edu/gt/CITAS_MEDICAS/web/controller/CitaController.java
// VERSIÓN CON POST REESCRITO (sin depender de CitaService.agendar)
package miumg.edu.gt.CITAS_MEDICAS.web.controller;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Cita;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Horario;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Medico;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Paciente;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.EstadoCita;
import miumg.edu.gt.CITAS_MEDICAS.repository.CitaRepository;
import miumg.edu.gt.CITAS_MEDICAS.repository.HorarioRepository;
import miumg.edu.gt.CITAS_MEDICAS.repository.MedicoRepository;
import miumg.edu.gt.CITAS_MEDICAS.repository.PacienteRepository;
import miumg.edu.gt.CITAS_MEDICAS.service.CitaService;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.request.CitaRequest;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.response.CitaResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "*")
public class CitaController {

    private final CitaService citaService;
    private final CitaRepository citaRepository;
    private final PacienteRepository pacienteRepository;
    private final MedicoRepository medicoRepository;
    private final HorarioRepository horarioRepository;

    public CitaController(
            CitaService citaService, 
            CitaRepository citaRepository,
            PacienteRepository pacienteRepository,
            MedicoRepository medicoRepository,
            HorarioRepository horarioRepository) {
        this.citaService = citaService;
        this.citaRepository = citaRepository;
        this.pacienteRepository = pacienteRepository;
        this.medicoRepository = medicoRepository;
        this.horarioRepository = horarioRepository;
    }

    // CREATE - REESCRITO COMPLETAMENTE
    @PostMapping
    @Transactional
    public ResponseEntity<CitaResponse> agendarCita(@Valid @RequestBody CitaRequest request) {
        try {
            // 1. Buscar paciente
            Paciente paciente = pacienteRepository.findById(request.getIdPaciente())
                    .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));

            // 2. Buscar médico
            Medico medico = medicoRepository.findById(request.getIdMedico())
                    .orElseThrow(() -> new IllegalArgumentException("Médico no encontrado"));

            // 3. Buscar horario
            Horario horario = horarioRepository.findById(request.getIdHorario())
                    .orElseThrow(() -> new IllegalArgumentException("Horario no encontrado"));

            // 4. Verificar que no haya otra cita en ese slot
            boolean existeCita = citaRepository.findAll().stream()
                    .anyMatch(c -> c.getMedico().getId().equals(request.getIdMedico()) &&
                                 c.getFecha().equals(request.getFecha()) &&
                                 c.getHoraInicio().equals(request.getHoraInicio()) &&
                                 !c.getEstado().equals(EstadoCita.Cancelada));

            if (existeCita) {
                throw new IllegalArgumentException("Ya existe una cita en ese horario");
            }

            // 5. Crear la cita
            Cita cita = new Cita();
            cita.setPaciente(paciente);
            cita.setMedico(medico);
            cita.setHorario(horario);
            cita.setFecha(request.getFecha());
            cita.setHoraInicio(request.getHoraInicio());
            cita.setHoraFin(request.getHoraFin());
            cita.setEstado(EstadoCita.Agendada);
            cita.setMotivoConsulta(request.getMotivoConsulta());

            // 6. Guardar
            Cita citaGuardada = citaRepository.save(cita);

            // 7. Cargar relaciones lazy para la respuesta
            citaGuardada.getPaciente().getUsuario().getNombre();
            citaGuardada.getMedico().getUsuario().getNombre();

            return ResponseEntity.status(HttpStatus.CREATED).body(convertirACitaResponse(citaGuardada));

        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Error al agendar cita: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Error inesperado al agendar cita: " + e.getMessage(), e);
        }
    }

    // READ - Obtener por ID
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<CitaResponse> obtenerPorId(@PathVariable Integer id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada"));
        
        // Forzar carga de relaciones lazy
        cita.getPaciente().getUsuario().getNombre();
        cita.getMedico().getUsuario().getNombre();
        cita.getHorario().getHoraInicio();
        
        return ResponseEntity.ok(convertirACitaResponse(cita));
    }

    // READ - Listar todas
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<CitaResponse>> listarTodas() {
        List<Cita> citas = citaRepository.findAll();
        
        // Forzar carga de relaciones lazy
        citas.forEach(c -> {
            c.getPaciente().getUsuario().getNombre();
            c.getMedico().getUsuario().getNombre();
            c.getHorario().getHoraInicio();
        });
        
        List<CitaResponse> response = citas.stream()
                .map(this::convertirACitaResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // READ - Listar por médico
    @GetMapping("/medico/{idMedico}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<CitaResponse>> listarPorMedico(@PathVariable Integer idMedico) {
        List<Cita> citas = citaRepository.findAll().stream()
                .filter(c -> c.getMedico().getId().equals(idMedico))
                .collect(Collectors.toList());
        
        // Forzar carga de relaciones lazy
        citas.forEach(c -> {
            c.getPaciente().getUsuario().getNombre();
            c.getMedico().getUsuario().getNombre();
            c.getHorario().getHoraInicio();
        });
        
        List<CitaResponse> response = citas.stream()
                .map(this::convertirACitaResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // READ - Listar por médico y fecha
    @GetMapping("/medico/{idMedico}/fecha")
    @Transactional(readOnly = true)
    public ResponseEntity<List<CitaResponse>> listarPorMedicoYFecha(
            @PathVariable Integer idMedico,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        List<Cita> citas = citaService.listarPorMedicoYFecha(idMedico, fecha);
        
        // Forzar carga de relaciones lazy
        citas.forEach(c -> {
            c.getPaciente().getUsuario().getNombre();
            c.getMedico().getUsuario().getNombre();
            c.getHorario().getHoraInicio();
        });
        
        List<CitaResponse> response = citas.stream()
                .map(this::convertirACitaResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // READ - Listar por paciente
    @GetMapping("/paciente/{idPaciente}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<CitaResponse>> listarPorPaciente(@PathVariable Integer idPaciente) {
        List<Cita> citas = citaService.listarPorPaciente(idPaciente);
        
        // Forzar carga de relaciones lazy
        citas.forEach(c -> {
            c.getPaciente().getUsuario().getNombre();
            c.getMedico().getUsuario().getNombre();
            c.getHorario().getHoraInicio();
        });
        
        List<CitaResponse> response = citas.stream()
                .map(this::convertirACitaResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // UPDATE - Cancelar cita
    @PutMapping("/{id}/cancelar")
    @Transactional
    public ResponseEntity<CitaResponse> cancelarCita(@PathVariable Integer id) {
        Cita cita = citaService.cambiarEstado(id, EstadoCita.Cancelada, "Cancelada por el usuario");
        
        // Forzar carga de relaciones lazy
        cita.getPaciente().getUsuario().getNombre();
        cita.getMedico().getUsuario().getNombre();
        cita.getHorario().getHoraInicio();
        
        return ResponseEntity.ok(convertirACitaResponse(cita));
    }

    // UPDATE - Completar cita
    @PutMapping("/{id}/completar")
    @Transactional
    public ResponseEntity<CitaResponse> completarCita(@PathVariable Integer id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada"));
        
        // Forzar carga de relaciones lazy ANTES de modificar
        cita.getPaciente().getUsuario().getNombre();
        cita.getMedico().getUsuario().getNombre();
        cita.getHorario().getHoraInicio();
        
        // Cambiar estado a Completada
        cita.setEstado(EstadoCita.Completada);
        Cita actualizada = citaRepository.save(cita);
        
        return ResponseEntity.ok(convertirACitaResponse(actualizada));
    }

    // UPDATE - Reprogramar cita
    @PutMapping("/{id}/reprogramar")
    @Transactional
    public ResponseEntity<CitaResponse> reprogramarCita(
            @PathVariable Integer id,
            @RequestParam Integer nuevoIdHorario,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate nuevaFecha) {
        Cita cita = citaService.reprogramar(id, nuevoIdHorario, nuevaFecha);
        
        // Forzar carga de relaciones lazy
        cita.getPaciente().getUsuario().getNombre();
        cita.getMedico().getUsuario().getNombre();
        cita.getHorario().getHoraInicio();
        
        return ResponseEntity.ok(convertirACitaResponse(cita));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada"));
        citaRepository.delete(cita);
        return ResponseEntity.noContent().build();
    }

    // Método auxiliar
    private CitaResponse convertirACitaResponse(Cita cita) {
        CitaResponse response = new CitaResponse();
        response.setId(cita.getId());
        response.setIdPaciente(cita.getPaciente().getId());
        response.setNombrePaciente(cita.getPaciente().getUsuario().getNombre() + " " + 
                                   cita.getPaciente().getUsuario().getApellido());
        response.setIdMedico(cita.getMedico().getId());
        response.setNombreMedico(cita.getMedico().getUsuario().getNombre() + " " + 
                                cita.getMedico().getUsuario().getApellido());
        response.setEspecialidad(cita.getMedico().getEspecialidad());
        response.setConsultorio(cita.getMedico().getConsultorio());
        response.setFecha(cita.getFecha());
        response.setHoraInicio(cita.getHoraInicio());
        response.setHoraFin(cita.getHoraFin());
        response.setEstado(cita.getEstado());
        response.setMotivoConsulta(cita.getMotivoConsulta());
        return response;
    }
}