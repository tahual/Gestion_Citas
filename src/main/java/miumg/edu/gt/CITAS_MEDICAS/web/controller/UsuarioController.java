package miumg.edu.gt.CITAS_MEDICAS.web.controller;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Usuario;
import miumg.edu.gt.CITAS_MEDICAS.repository.UsuarioRepository;
import miumg.edu.gt.CITAS_MEDICAS.service.UsuarioService;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.request.UsuarioRegistroRequest;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.request.UsuarioUpdateRequest;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.response.UsuarioResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioService usuarioService, UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // CREATE
    @PostMapping("/registro")
    public ResponseEntity<UsuarioResponse> registrar(@Valid @RequestBody UsuarioRegistroRequest request) {
        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setCorreo(request.getCorreo());
        usuario.setTelefono(request.getTelefono());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setTipoUsuario(request.getTipoUsuario());

        Usuario guardado = usuarioService.crear(usuario);

        return ResponseEntity.status(HttpStatus.CREATED).body(convertirAUsuarioResponse(guardado));
    }

    // READ - Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> obtenerPorId(@PathVariable Integer id) {
        Usuario usuario = usuarioService.obtener(id);
        return ResponseEntity.ok(convertirAUsuarioResponse(usuario));
    }

    // READ - Obtener por correo
    @GetMapping("/correo/{correo}")
    public ResponseEntity<UsuarioResponse> obtenerPorCorreo(@PathVariable String correo) {
        return usuarioService.buscarPorCorreo(correo)
                .map(usuario -> ResponseEntity.ok(convertirAUsuarioResponse(usuario)))
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Listar todos
    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listarTodos() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<UsuarioResponse> response = usuarios.stream()
                .map(this::convertirAUsuarioResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody UsuarioUpdateRequest request) {
        
        Usuario usuario = usuarioService.obtener(id);

        if (request.getNombre() != null) usuario.setNombre(request.getNombre());
        if (request.getApellido() != null) usuario.setApellido(request.getApellido());
        if (request.getCorreo() != null) usuario.setCorreo(request.getCorreo());
        if (request.getTelefono() != null) usuario.setTelefono(request.getTelefono());
        if (request.getPassword() != null) {
            usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        Usuario actualizado = usuarioRepository.save(usuario);
        return ResponseEntity.ok(convertirAUsuarioResponse(actualizado));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        Usuario usuario = usuarioService.obtener(id);
        usuarioRepository.delete(usuario);
        return ResponseEntity.noContent().build();
    }

    // Método auxiliar
    private UsuarioResponse convertirAUsuarioResponse(Usuario usuario) {
        UsuarioResponse response = new UsuarioResponse();
        response.setId(usuario.getId());
        response.setNombre(usuario.getNombre());
        response.setApellido(usuario.getApellido());
        response.setCorreo(usuario.getCorreo());
        response.setTelefono(usuario.getTelefono());
        response.setTipoUsuario(usuario.getTipoUsuario());
        return response;
    }
}