package miumg.edu.gt.CITAS_MEDICAS.web.controller;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Cita;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.EstadoCita;
import miumg.edu.gt.CITAS_MEDICAS.repository.CitaRepository;
import miumg.edu.gt.CITAS_MEDICAS.service.CitaService;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.request.CitaRequest;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.response.CitaResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "*")
public class CitaController {

    private final CitaService citaService;
    private final CitaRepository citaRepository;

    public CitaController(CitaService citaService, CitaRepository citaRepository) {
        this.citaService = citaService;
        this.citaRepository = citaRepository;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<CitaResponse> agendarCita(@Valid @RequestBody CitaRequest request) {
        Cita cita = citaService.agendar(
                request.getIdPaciente(),
                request.getIdMedico(),
                request.getIdHorario(),
                request.getFecha()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(convertirACitaResponse(cita));
    }

    // READ - Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<CitaResponse> obtenerPorId(@PathVariable Integer id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada"));
        return ResponseEntity.ok(convertirACitaResponse(cita));
    }

    // READ - Listar todas
    @GetMapping
    public ResponseEntity<List<CitaResponse>> listarTodas() {
        List<Cita> citas = citaRepository.findAll();
        List<CitaResponse> response = citas.stream()
                .map(this::convertirACitaResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // READ - Listar por médico y fecha
    @GetMapping("/medico/{idMedico}")
    public ResponseEntity<List<CitaResponse>> listarPorMedico(
            @PathVariable Integer idMedico,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        List<Cita> citas = citaService.listarPorMedicoYFecha(idMedico, fecha);
        List<CitaResponse> response = citas.stream()
                .map(this::convertirACitaResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // READ - Listar por paciente
    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<CitaResponse>> listarPorPaciente(@PathVariable Integer idPaciente) {
        List<Cita> citas = citaService.listarPorPaciente(idPaciente);
        List<CitaResponse> response = citas.stream()
                .map(this::convertirACitaResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // UPDATE - Cancelar cita
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<CitaResponse> cancelarCita(@PathVariable Integer id) {
        Cita cita = citaService.cambiarEstado(id, EstadoCita.Cancelada, "Cancelada por el usuario");
        return ResponseEntity.ok(convertirACitaResponse(cita));
    }

    // UPDATE - Reprogramar cita
    @PutMapping("/{id}/reprogramar")
    public ResponseEntity<CitaResponse> reprogramarCita(
            @PathVariable Integer id,
            @RequestParam Integer nuevoIdHorario,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate nuevaFecha) {
        Cita cita = citaService.reprogramar(id, nuevoIdHorario, nuevaFecha);
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
        response.setFecha(cita.getFecha());
        response.setEstado(cita.getEstado());
        return response;
    }
}