// src/main/java/miumg/edu/gt/CITAS_MEDICAS/web/controller/PacienteController.java
package miumg.edu.gt.CITAS_MEDICAS.web.controller;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Paciente;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Usuario;
import miumg.edu.gt.CITAS_MEDICAS.repository.PacienteRepository;
import miumg.edu.gt.CITAS_MEDICAS.service.PacienteService;
import miumg.edu.gt.CITAS_MEDICAS.service.UsuarioService;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.request.PacienteRequest;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.request.PacienteUpdateRequest;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.response.PacienteResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*")
public class PacienteController {

    private final PacienteService pacienteService;
    private final PacienteRepository pacienteRepository;
    private final UsuarioService usuarioService;

    public PacienteController(PacienteService pacienteService, PacienteRepository pacienteRepository, UsuarioService usuarioService) {
        this.pacienteService = pacienteService;
        this.pacienteRepository = pacienteRepository;
        this.usuarioService = usuarioService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<PacienteResponse> crear(@Valid @RequestBody PacienteRequest request) {
        Usuario usuario = usuarioService.obtener(request.getIdUsuario());

        Paciente paciente = new Paciente();
        paciente.setUsuario(usuario);
        paciente.setDocumentoIdentidad(request.getDocumentoIdentidad());
        paciente.setFecha_nacimiento(request.getFechaNacimiento());
        paciente.setDireccion(request.getDireccion());
        paciente.setTipoSangre(request.getTipoSangre());
        paciente.setAlergias(request.getAlergias());
        paciente.setContactoEmergenciaNombre(request.getContactoEmergenciaNombre());
        paciente.setContactoEmergenciaTelefono(request.getContactoEmergenciaTelefono());

        Paciente guardado = pacienteService.crear(paciente);

        return ResponseEntity.status(HttpStatus.CREATED).body(convertirAPacienteResponse(guardado));
    }

    // READ - Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<PacienteResponse> obtenerPorId(@PathVariable Integer id) {
        Paciente paciente = pacienteService.obtener(id);
        return ResponseEntity.ok(convertirAPacienteResponse(paciente));
    }

    // READ - Listar todos
    @GetMapping
    public ResponseEntity<List<PacienteResponse>> listarTodos() {
        List<Paciente> pacientes = pacienteRepository.findAll();
        List<PacienteResponse> response = pacientes.stream()
                .map(this::convertirAPacienteResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<PacienteResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody PacienteUpdateRequest request) {
        
        Paciente paciente = pacienteService.obtener(id);

        if (request.getFechaNacimiento() != null) {
            paciente.setFecha_nacimiento(request.getFechaNacimiento());
        }
        if (request.getDireccion() != null) {
            paciente.setDireccion(request.getDireccion());
        }

        Paciente actualizado = pacienteRepository.save(paciente);
        return ResponseEntity.ok(convertirAPacienteResponse(actualizado));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        Paciente paciente = pacienteService.obtener(id);
        pacienteRepository.delete(paciente);
        return ResponseEntity.noContent().build();
    }

    // Método auxiliar
    private PacienteResponse convertirAPacienteResponse(Paciente paciente) {
        PacienteResponse response = new PacienteResponse();
        response.setId(paciente.getId());
        response.setIdUsuario(paciente.getUsuario().getId());
        response.setNombre(paciente.getUsuario().getNombre());
        response.setApellido(paciente.getUsuario().getApellido());
        response.setCorreo(paciente.getUsuario().getCorreo());
        response.setTelefono(paciente.getUsuario().getTelefono());
        response.setDocumentoIdentidad(paciente.getDocumentoIdentidad());
        response.setFechaNacimiento(paciente.getFecha_nacimiento());
        response.setDireccion(paciente.getDireccion());
        response.setTipoSangre(paciente.getTipoSangre());
        response.setAlergias(paciente.getAlergias());
        response.setContactoEmergenciaNombre(paciente.getContactoEmergenciaNombre());
        response.setContactoEmergenciaTelefono(paciente.getContactoEmergenciaTelefono());
        return response;
    }
}