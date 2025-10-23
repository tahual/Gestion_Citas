package miumg.edu.gt.CITAS_MEDICAS.web.controller;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.HistorialMedico;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Medico;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Paciente;
import miumg.edu.gt.CITAS_MEDICAS.repository.HistorialMedicoRepository;
import miumg.edu.gt.CITAS_MEDICAS.service.HistorialMedicoService;
import miumg.edu.gt.CITAS_MEDICAS.service.MedicoService;
import miumg.edu.gt.CITAS_MEDICAS.service.PacienteService;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.request.HistorialMedicoRequest;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.request.HistorialMedicoUpdateRequest;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.response.HistorialMedicoResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/historial")
@CrossOrigin(origins = "*")
public class HistorialMedicoController {

    private final HistorialMedicoService historialService;
    private final HistorialMedicoRepository historialRepository;
    private final PacienteService pacienteService;
    private final MedicoService medicoService;

    public HistorialMedicoController(
            HistorialMedicoService historialService,
            HistorialMedicoRepository historialRepository,
            PacienteService pacienteService,
            MedicoService medicoService) {
        this.historialService = historialService;
        this.historialRepository = historialRepository;
        this.pacienteService = pacienteService;
        this.medicoService = medicoService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<HistorialMedicoResponse> crear(@Valid @RequestBody HistorialMedicoRequest request) {
        Paciente paciente = pacienteService.obtener(request.getIdPaciente());
        Medico medico = medicoService.obtener(request.getIdMedico());

        HistorialMedico historial = new HistorialMedico();
        historial.setPaciente(paciente);
        historial.setMedico(medico);
        historial.setDiagnostico(request.getDiagnostico());
        historial.setTratamiento(request.getTratamiento());

        HistorialMedico guardado = historialService.registrar(historial);

        return ResponseEntity.status(HttpStatus.CREATED).body(convertirAHistorialResponse(guardado));
    }

    // READ - Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<HistorialMedicoResponse> obtenerPorId(@PathVariable Integer id) {
        HistorialMedico historial = historialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Historial no encontrado"));
        return ResponseEntity.ok(convertirAHistorialResponse(historial));
    }

    // READ - Listar todos
    @GetMapping
    public ResponseEntity<List<HistorialMedicoResponse>> listarTodos() {
        List<HistorialMedico> historiales = historialRepository.findAll();
        List<HistorialMedicoResponse> response = historiales.stream()
                .map(this::convertirAHistorialResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // READ - Listar por paciente
    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<HistorialMedicoResponse>> listarPorPaciente(@PathVariable Integer idPaciente) {
        List<HistorialMedico> historiales = historialService.listarPorPaciente(idPaciente);
        List<HistorialMedicoResponse> response = historiales.stream()
                .map(this::convertirAHistorialResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // UPDATE - CORREGIDO: Usa HistorialMedicoUpdateRequest en lugar de HistorialMedicoRequest
    @PutMapping("/{id}")
    public ResponseEntity<HistorialMedicoResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody HistorialMedicoUpdateRequest request) {
        
        HistorialMedico historial = historialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Historial no encontrado"));

        if (request.getDiagnostico() != null) {
            historial.setDiagnostico(request.getDiagnostico());
        }
        if (request.getTratamiento() != null) {
            historial.setTratamiento(request.getTratamiento());
        }

        HistorialMedico actualizado = historialRepository.save(historial);
        return ResponseEntity.ok(convertirAHistorialResponse(actualizado));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        HistorialMedico historial = historialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Historial no encontrado"));
        historialRepository.delete(historial);
        return ResponseEntity.noContent().build();
    }

    // Método auxiliar
    private HistorialMedicoResponse convertirAHistorialResponse(HistorialMedico historial) {
        HistorialMedicoResponse response = new HistorialMedicoResponse();
        response.setId(historial.getId());
        response.setIdPaciente(historial.getPaciente().getId());
        response.setNombrePaciente(historial.getPaciente().getUsuario().getNombre() + " " +
                                   historial.getPaciente().getUsuario().getApellido());
        response.setIdMedico(historial.getMedico().getId());
        response.setNombreMedico(historial.getMedico().getUsuario().getNombre() + " " +
                                 historial.getMedico().getUsuario().getApellido());
        response.setEspecialidad(historial.getMedico().getEspecialidad());
        response.setDiagnostico(historial.getDiagnostico());
        response.setTratamiento(historial.getTratamiento());
        response.setFechaRegistro(historial.getFechaRegistro());
        return response;
    }
}