// src/main/java/miumg/edu/gt/CITAS_MEDICAS/web/controller/MedicoController.java
package miumg.edu.gt.CITAS_MEDICAS.web.controller;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Medico;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Usuario;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.TipoUsuario;
import miumg.edu.gt.CITAS_MEDICAS.repository.MedicoRepository;
import miumg.edu.gt.CITAS_MEDICAS.repository.UsuarioRepository;
import miumg.edu.gt.CITAS_MEDICAS.service.MedicoService;
import miumg.edu.gt.CITAS_MEDICAS.service.UsuarioService;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.request.MedicoCreateRequest;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.response.MedicoResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/medicos")
@CrossOrigin(origins = "*")
public class MedicoController {

    private final MedicoService medicoService;
    private final MedicoRepository medicoRepository;
    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public MedicoController(
            MedicoService medicoService, 
            MedicoRepository medicoRepository, 
            UsuarioService usuarioService,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {
        this.medicoService = medicoService;
        this.medicoRepository = medicoRepository;
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // CREATE - Solo Recepcionista - CREA USUARIO + MÉDICO
    @PostMapping
    @PreAuthorize("hasRole('Recepcionista')")
    public ResponseEntity<MedicoResponse> crear(@Valid @RequestBody MedicoCreateRequest request) {
        // Verificar si el correo ya existe
        if (usuarioService.buscarPorCorreo(request.getCorreo()).isPresent()) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        // 1. Crear el usuario
        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setCorreo(request.getCorreo());
        usuario.setTelefono(request.getTelefono());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setTipoUsuario(TipoUsuario.Medico);

        Usuario usuarioGuardado = usuarioService.crear(usuario);

        // 2. Crear el médico vinculado al usuario
        Medico medico = new Medico();
        medico.setUsuario(usuarioGuardado);
        medico.setEspecialidad(request.getEspecialidad());
        medico.setConsultorio(request.getConsultorio());
        // Valores por defecto
        medico.setAnosExperiencia(0);
        medico.setDescripcion("");

        Medico guardado = medicoRepository.save(medico);

        return ResponseEntity.status(HttpStatus.CREATED).body(convertirAMedicoResponse(guardado));
    }

    // READ - Obtener por ID - TODOS PUEDEN VER
    @GetMapping("/{id}")
    public ResponseEntity<MedicoResponse> obtenerPorId(@PathVariable Integer id) {
        Medico medico = medicoService.obtener(id);
        return ResponseEntity.ok(convertirAMedicoResponse(medico));
    }

    // READ - Listar todos - TODOS PUEDEN VER
    @GetMapping
    public ResponseEntity<List<MedicoResponse>> listarTodos() {
        List<Medico> medicos = medicoRepository.findAll();
        List<MedicoResponse> response = medicos.stream()
                .map(this::convertirAMedicoResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // READ - Buscar por especialidad o nombre - TODOS PUEDEN BUSCAR
    @GetMapping("/buscar")
    public ResponseEntity<List<MedicoResponse>> buscar(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String especialidad) {
        
        List<Medico> medicos = medicoRepository.findAll().stream()
                .filter(m -> {
                    boolean matches = true;
                    if (especialidad != null && !especialidad.isEmpty() && !especialidad.equals("Todas las especialidades")) {
                        matches = m.getEspecialidad().equalsIgnoreCase(especialidad);
                    }
                    if (query != null && !query.isEmpty() && matches) {
                        String queryLower = query.toLowerCase();
                        matches = m.getUsuario().getNombre().toLowerCase().contains(queryLower) ||
                                 m.getUsuario().getApellido().toLowerCase().contains(queryLower) ||
                                 m.getEspecialidad().toLowerCase().contains(queryLower);
                    }
                    return matches;
                })
                .collect(Collectors.toList());
        
        List<MedicoResponse> response = medicos.stream()
                .map(this::convertirAMedicoResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    // READ - Buscar por especialidad (compatibilidad) - TODOS PUEDEN VER
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

    // UPDATE - Solo Recepcionista - ACTUALIZA TODO
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('Recepcionista')")
    public ResponseEntity<MedicoResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody MedicoCreateRequest request) {
        
        Medico medico = medicoService.obtener(id);
        Usuario usuario = medico.getUsuario();

        // Actualizar datos del usuario
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setTelefono(request.getTelefono());
        
        // Solo actualizar correo si cambió y no está en uso
        if (!usuario.getCorreo().equals(request.getCorreo())) {
            if (usuarioService.buscarPorCorreo(request.getCorreo()).isPresent()) {
                throw new IllegalArgumentException("El correo ya está registrado");
            }
            usuario.setCorreo(request.getCorreo());
        }

        // Solo actualizar password si se proporciona uno nuevo
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // Guardar usuario usando el repositorio directamente
        usuarioRepository.save(usuario);

        // Actualizar datos del médico
        medico.setEspecialidad(request.getEspecialidad());
        medico.setConsultorio(request.getConsultorio());

        Medico actualizado = medicoRepository.save(medico);
        return ResponseEntity.ok(convertirAMedicoResponse(actualizado));
    }

    // DELETE - Solo Recepcionista
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Recepcionista')")
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
        response.setConsultorio(medico.getConsultorio());
        response.setAnosExperiencia(medico.getAnosExperiencia());
        response.setDescripcion(medico.getDescripcion());
        response.setRating(medico.getRating());
        
        // Calcular horario de atención
        if (medico.getHorarios() != null && !medico.getHorarios().isEmpty()) {
            String horarioTexto = medico.getHorarios().stream()
                    .map(h -> h.getDiaSemana() + ": " + h.getHoraInicio() + " - " + h.getHoraFin())
                    .collect(Collectors.joining(", "));
            response.setHorarioAtencion(horarioTexto);
        }
        
        return response;
    }
}