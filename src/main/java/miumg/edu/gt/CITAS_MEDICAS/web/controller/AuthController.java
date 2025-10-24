package miumg.edu.gt.CITAS_MEDICAS.web.controller;

import jakarta.validation.Valid;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Medico;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Paciente;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Usuario;
import miumg.edu.gt.CITAS_MEDICAS.repository.MedicoRepository;
import miumg.edu.gt.CITAS_MEDICAS.repository.PacienteRepository;
import miumg.edu.gt.CITAS_MEDICAS.security.JwtUtil;
import miumg.edu.gt.CITAS_MEDICAS.service.UsuarioService;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.request.LoginRequest;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.request.UsuarioRegistroRequest;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.response.LoginResponse;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.response.UsuarioResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioService usuarioService;
    private final MedicoRepository medicoRepository;
    private final PacienteRepository pacienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(
            UsuarioService usuarioService,
            MedicoRepository medicoRepository,
            PacienteRepository pacienteRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.usuarioService = usuarioService;
        this.medicoRepository = medicoRepository;
        this.pacienteRepository = pacienteRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        // Buscar usuario por correo
        Usuario usuario = usuarioService.buscarPorCorreo(request.getCorreo())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));

        // Verificar contraseña
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }

        // Generar token JWT
        String token = jwtUtil.generateToken(usuario.getCorreo(), usuario.getTipoUsuario().name());

        // Buscar ID de perfil (Medico o Paciente)
        Integer idPerfil = null;
        switch (usuario.getTipoUsuario()) {
            case Medico:
                idPerfil = medicoRepository.findAll().stream()
                        .filter(m -> m.getUsuario().getId().equals(usuario.getId()))
                        .findFirst()
                        .map(Medico::getId)
                        .orElse(null);
                break;
            case Paciente:
                idPerfil = pacienteRepository.findAll().stream()
                        .filter(p -> p.getUsuario().getId().equals(usuario.getId()))
                        .findFirst()
                        .map(Paciente::getId)
                        .orElse(null);
                break;
            case Recepcionista:
                // Recepcionista no tiene perfil específico
                idPerfil = null;
                break;
        }

        // Construir respuesta
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setIdUsuario(usuario.getId());
        response.setNombre(usuario.getNombre());
        response.setApellido(usuario.getApellido());
        response.setCorreo(usuario.getCorreo());
        response.setRol(usuario.getTipoUsuario());
        response.setIdPerfil(idPerfil);

        return ResponseEntity.ok(response);
    }

    // REGISTRO (igual que antes pero ahora devuelve token automáticamente)
    @PostMapping("/registro")
    public ResponseEntity<LoginResponse> registrar(@Valid @RequestBody UsuarioRegistroRequest request) {
        // Verificar si el correo ya existe
        if (usuarioService.buscarPorCorreo(request.getCorreo()).isPresent()) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        // Crear usuario
        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setCorreo(request.getCorreo());
        usuario.setTelefono(request.getTelefono());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setTipoUsuario(request.getTipoUsuario());

        Usuario guardado = usuarioService.crear(usuario);

        // Generar token automáticamente
        String token = jwtUtil.generateToken(guardado.getCorreo(), guardado.getTipoUsuario().name());

        // Construir respuesta
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setIdUsuario(guardado.getId());
        response.setNombre(guardado.getNombre());
        response.setApellido(guardado.getApellido());
        response.setCorreo(guardado.getCorreo());
        response.setRol(guardado.getTipoUsuario());
        response.setIdPerfil(null); // Al registrarse aún no tiene perfil de Medico/Paciente

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}