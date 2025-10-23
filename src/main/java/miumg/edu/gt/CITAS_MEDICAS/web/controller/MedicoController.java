package miumg.edu.gt.CITAS_MEDICAS.web.controller;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Medico;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Usuario;
import miumg.edu.gt.CITAS_MEDICAS.repository.MedicoRepository;
import miumg.edu.gt.CITAS_MEDICAS.service.MedicoService;
import miumg.edu.gt.CITAS_MEDICAS.service.UsuarioService;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.request.MedicoRequest;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.request.MedicoUpdateRequest;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.response.MedicoResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/medicos")
@CrossOrigin(origins = "*")
public class MedicoController {

    private final MedicoService medicoService;
    private final MedicoRepository medicoRepository;
    private final UsuarioService usuarioService;

    public MedicoController(MedicoService medicoService, MedicoRepository medicoRepository, UsuarioService usuarioService) {
        this.medicoService = medicoService;
        this.medicoRepository = medicoRepository;
        this.usuarioService = usuarioService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<MedicoResponse> crear(@Valid @RequestBody MedicoRequest request) {
        Usuario usuario = usuarioService.obtener(request.getIdUsuario());

        Medico medico = new Medico();
        medico.setUsuario(usuario);
        medico.setEspecialidad(request.getEspecialidad());

        Medico guardado = medicoService.crear(medico);

        return ResponseEntity.status(HttpStatus.CREATED).body(convertirAMedicoResponse(guardado));
    }

    // READ - Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<MedicoResponse> obtenerPorId(@PathVariable Integer id) {
        Medico medico = medicoService.obtener(id);
        return ResponseEntity.ok(convertirAMedicoResponse(medico));
    }

    // READ - Listar todos
    @GetMapping
    public ResponseEntity<List<MedicoResponse>> listarTodos() {
        List<Medico> medicos = medicoRepository.findAll();
        List<MedicoResponse> response = medicos.stream()
                .map(this::convertirAMedicoResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // READ - Buscar por especialidad
    @GetMapping("/especialidad/{especialidad}")
    public ResponseEntity<List<MedicoResponse>> buscarPorEspecialidad(@PathVariable String especialidad) {
        List<Medico> medicos = medicoRepository.findAll().stream()
                .filter(m -> m.getEspecialidad().equalsIgnoreCase(especialidad))
                .collect(Collectors.toList());
        
        List<MedicoResponse> response = medicos.stream()
                .map(this::convertirAMedicoResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<MedicoResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody MedicoUpdateRequest request) {
        
        Medico medico = medicoService.obtener(id);

        if (request.getEspecialidad() != null) {
            medico.setEspecialidad(request.getEspecialidad());
        }

        Medico actualizado = medicoRepository.save(medico);
        return ResponseEntity.ok(convertirAMedicoResponse(actualizado));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        Medico medico = medicoService.obtener(id);
        medicoRepository.delete(medico);
        return ResponseEntity.noContent().build();
    }

    // Método auxiliar
    private MedicoResponse convertirAMedicoResponse(Medico medico) {
        MedicoResponse response = new MedicoResponse();
        response.setId(medico.getId());
        response.setIdUsuario(medico.getUsuario().getId());
        response.setNombre(medico.getUsuario().getNombre());
        response.setApellido(medico.getUsuario().getApellido());
        response.setCorreo(medico.getUsuario().getCorreo());
        response.setTelefono(medico.getUsuario().getTelefono());
        response.setEspecialidad(medico.getEspecialidad());
        return response;
    }
}