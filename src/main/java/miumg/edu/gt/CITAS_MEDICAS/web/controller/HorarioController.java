package miumg.edu.gt.CITAS_MEDICAS.web.controller;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Horario;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Medico;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.DiaSemana;
import miumg.edu.gt.CITAS_MEDICAS.repository.HorarioRepository;
import miumg.edu.gt.CITAS_MEDICAS.service.HorarioService;
import miumg.edu.gt.CITAS_MEDICAS.service.MedicoService;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.request.HorarioRequest;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.request.HorarioUpdateRequest;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.response.HorarioResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "*")
public class HorarioController {

    private final HorarioService horarioService;
    private final HorarioRepository horarioRepository;
    private final MedicoService medicoService;

    public HorarioController(HorarioService horarioService, HorarioRepository horarioRepository, MedicoService medicoService) {
        this.horarioService = horarioService;
        this.horarioRepository = horarioRepository;
        this.medicoService = medicoService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<HorarioResponse> crearHorario(@Valid @RequestBody HorarioRequest request) {
        Medico medico = medicoService.obtener(request.getIdMedico());

        Horario horario = new Horario();
        horario.setMedico(medico);
        horario.setDiaSemana(request.getDiaSemana());
        horario.setHoraInicio(request.getHoraInicio());
        horario.setHoraFin(request.getHoraFin());

        Horario guardado = horarioService.crear(horario);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(convertirAHorarioResponse(guardado));
    }

    // READ - Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<HorarioResponse> obtenerPorId(@PathVariable Integer id) {
        Horario horario = horarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Horario no encontrado"));
        return ResponseEntity.ok(convertirAHorarioResponse(horario));
    }

    // READ - Listar todos
    @GetMapping
    public ResponseEntity<List<HorarioResponse>> listarTodos() {
        List<Horario> horarios = horarioRepository.findAll();
        List<HorarioResponse> response = horarios.stream()
                .map(this::convertirAHorarioResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // READ - Listar por médico
    @GetMapping("/medico/{idMedico}")
    public ResponseEntity<List<HorarioResponse>> listarPorMedico(@PathVariable Integer idMedico) {
        Medico medico = medicoService.obtener(idMedico);
        List<Horario> horarios = horarioRepository.findAll().stream()
                .filter(h -> h.getMedico().getId().equals(medico.getId()))
                .collect(Collectors.toList());
        
        List<HorarioResponse> response = horarios.stream()
                .map(this::convertirAHorarioResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    // READ - Listar por médico y día
    @GetMapping("/medico/{idMedico}/dia/{dia}")
    public ResponseEntity<List<HorarioResponse>> listarPorMedicoYDia(
            @PathVariable Integer idMedico,
            @PathVariable DiaSemana dia) {
        Medico medico = medicoService.obtener(idMedico);
        List<Horario> horarios = horarioService.listarPorMedicoYDia(medico, dia);
        
        List<HorarioResponse> response = horarios.stream()
                .map(this::convertirAHorarioResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<HorarioResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody HorarioUpdateRequest request) {
        
        Horario horario = horarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Horario no encontrado"));

        if (request.getDiaSemana() != null) {
            horario.setDiaSemana(request.getDiaSemana());
        }
        if (request.getHoraInicio() != null) {
            horario.setHoraInicio(request.getHoraInicio());
        }
        if (request.getHoraFin() != null) {
            horario.setHoraFin(request.getHoraFin());
        }

        Horario actualizado = horarioRepository.save(horario);
        return ResponseEntity.ok(convertirAHorarioResponse(actualizado));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        Horario horario = horarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Horario no encontrado"));
        horarioRepository.delete(horario);
        return ResponseEntity.noContent().build();
    }

    // Método auxiliar
    private HorarioResponse convertirAHorarioResponse(Horario horario) {
        HorarioResponse response = new HorarioResponse();
        response.setId(horario.getId());
        response.setIdMedico(horario.getMedico().getId());
        response.setNombreMedico(horario.getMedico().getUsuario().getNombre() + " " + 
                                  horario.getMedico().getUsuario().getApellido());
        response.setEspecialidad(horario.getMedico().getEspecialidad());
        response.setDiaSemana(horario.getDiaSemana());
        response.setHoraInicio(horario.getHoraInicio());
        response.setHoraFin(horario.getHoraFin());
        return response;
    }
}