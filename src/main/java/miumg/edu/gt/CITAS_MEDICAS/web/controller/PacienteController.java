// src/main/java/miumg/edu/gt/CITAS_MEDICAS/web/controller/PacienteController.java
// ACTUALIZADO - Maneja telefono y correo correctamente
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
import org.springframework.transaction.annotation.Transactional;
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
    @Transactional
    public ResponseEntity<PacienteResponse> crear(@Valid @RequestBody PacienteRequest request) {
        Usuario usuario = usuarioService.obtener(request.getIdUsuario());

        Paciente paciente = new Paciente();
        paciente.setUsuario(usuario);
        paciente.setDocumentoIdentidad(request.getDocumentoIdentidad());
        paciente.setFechaNacimiento(request.getFechaNacimiento());
        paciente.setTelefono(request.getTelefono()); // NUEVO
        paciente.setCorreo(request.getCorreo());     // NUEVO
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
    @Transactional(readOnly = true)
    public ResponseEntity<PacienteResponse> obtenerPorId(@PathVariable Integer id) {
        Paciente paciente = pacienteService.obtener(id);
        // Forzar carga lazy
        paciente.getUsuario().getNombre();
        return ResponseEntity.ok(convertirAPacienteResponse(paciente));
    }

    // READ - Listar todos
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<PacienteResponse>> listarTodos() {
        List<Paciente> pacientes = pacienteRepository.findAll();
        // Forzar carga lazy
        pacientes.forEach(p -> p.getUsuario().getNombre());
        
        List<PacienteResponse> response = pacientes.stream()
                .map(this::convertirAPacienteResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // UPDATE - ACTUALIZADO
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<PacienteResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody PacienteUpdateRequest request) {
        
        Paciente paciente = pacienteService.obtener(id);
        // Forzar carga lazy
        paciente.getUsuario().getNombre();

        // Actualizar todos los campos que vengan
        if (request.getDocumentoIdentidad() != null) {
            paciente.setDocumentoIdentidad(request.getDocumentoIdentidad());
        }
        if (request.getFechaNacimiento() != null) {
            paciente.setFechaNacimiento(request.getFechaNacimiento());
        }
        if (request.getTelefono() != null) {
            paciente.setTelefono(request.getTelefono());
        }
        if (request.getCorreo() != null) {
            paciente.setCorreo(request.getCorreo());
        }
        if (request.getDireccion() != null) {
            paciente.setDireccion(request.getDireccion());
        }
        if (request.getTipoSangre() != null) {
            paciente.setTipoSangre(request.getTipoSangre());
        }
        if (request.getAlergias() != null) {
            paciente.setAlergias(request.getAlergias());
        }
        if (request.getContactoEmergenciaNombre() != null) {
            paciente.setContactoEmergenciaNombre(request.getContactoEmergenciaNombre());
        }
        if (request.getContactoEmergenciaTelefono() != null) {
            paciente.setContactoEmergenciaTelefono(request.getContactoEmergenciaTelefono());
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

    // Método auxiliar - ACTUALIZADO
    private PacienteResponse convertirAPacienteResponse(Paciente paciente) {
        PacienteResponse response = new PacienteResponse();
        response.setId(paciente.getId());
        response.setIdUsuario(paciente.getUsuario().getId());
        response.setNombre(paciente.getUsuario().getNombre());
        response.setApellido(paciente.getUsuario().getApellido());
        
        // Usar telefono y correo del Paciente (no del Usuario)
        response.setTelefono(paciente.getTelefono());
        response.setCorreo(paciente.getCorreo());
        
        response.setDocumentoIdentidad(paciente.getDocumentoIdentidad());
        response.setFechaNacimiento(paciente.getFechaNacimiento());
        response.setDireccion(paciente.getDireccion());
        response.setTipoSangre(paciente.getTipoSangre());
        response.setAlergias(paciente.getAlergias());
        response.setContactoEmergenciaNombre(paciente.getContactoEmergenciaNombre());
        response.setContactoEmergenciaTelefono(paciente.getContactoEmergenciaTelefono());
        return response;
    }
}