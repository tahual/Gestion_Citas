// src/main/java/miumg/edu/gt/CITAS_MEDICAS/web/controller/HorarioController.java
// VERSIÓN CORREGIDA - Sin error de lambda
package miumg.edu.gt.CITAS_MEDICAS.web.controller;

import jakarta.validation.Valid;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Cita;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Horario;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Medico;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.DiaSemana;
import miumg.edu.gt.CITAS_MEDICAS.repository.CitaRepository;
import miumg.edu.gt.CITAS_MEDICAS.repository.HorarioRepository;
import miumg.edu.gt.CITAS_MEDICAS.repository.MedicoRepository;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.request.HorarioRequest;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.response.HorarioResponse;
import miumg.edu.gt.CITAS_MEDICAS.web.dto.response.SlotDisponibleResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "*")
public class HorarioController {

    private final HorarioRepository horarioRepository;
    private final MedicoRepository medicoRepository;
    private final CitaRepository citaRepository;

    public HorarioController(
            HorarioRepository horarioRepository, 
            MedicoRepository medicoRepository,
            CitaRepository citaRepository) {
        this.horarioRepository = horarioRepository;
        this.medicoRepository = medicoRepository;
        this.citaRepository = citaRepository;
    }

    // CREATE
    @PostMapping
    @PreAuthorize("hasRole('Recepcionista')")
    public ResponseEntity<HorarioResponse> crear(@Valid @RequestBody HorarioRequest request) {
        Medico medico = medicoRepository.findById(request.getIdMedico())
                .orElseThrow(() -> new IllegalArgumentException("Médico no encontrado"));

        Horario horario = new Horario();
        horario.setMedico(medico);
        horario.setDiaSemana(DiaSemana.valueOf(request.getDiaSemana()));
        horario.setHoraInicio(request.getHoraInicio());
        horario.setHoraFin(request.getHoraFin());

        Horario guardado = horarioRepository.save(horario);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertirAHorarioResponse(guardado));
    }

    // READ - Todos
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<HorarioResponse>> listarTodos() {
        List<Horario> horarios = horarioRepository.findAll();
        horarios.forEach(h -> h.getMedico().getUsuario().getNombre());
        
        List<HorarioResponse> response = horarios.stream()
                .map(this::convertirAHorarioResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    // READ - Por médico
    @GetMapping("/medico/{idMedico}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<HorarioResponse>> listarPorMedico(@PathVariable Integer idMedico) {
        List<Horario> horarios = horarioRepository.findAll().stream()
                .filter(h -> h.getMedico().getId().equals(idMedico))
                .collect(Collectors.toList());
        
        horarios.forEach(h -> h.getMedico().getUsuario().getNombre());
        
        List<HorarioResponse> response = horarios.stream()
                .map(this::convertirAHorarioResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    // READ - Por ID
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<HorarioResponse> obtenerPorId(@PathVariable Integer id) {
        Horario horario = horarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Horario no encontrado"));
        
        horario.getMedico().getUsuario().getNombre();
        return ResponseEntity.ok(convertirAHorarioResponse(horario));
    }

    // NUEVO: Obtener slots disponibles (1 HORA POR CITA)
    @GetMapping("/slots-disponibles")
    @Transactional(readOnly = true)
    public ResponseEntity<List<SlotDisponibleResponse>> obtenerSlotsDisponibles(
            @RequestParam Integer idMedico,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        
        // 1. Obtener día de la semana de la fecha
        DayOfWeek dayOfWeek = fecha.getDayOfWeek();
        String diaSemanaEsp = convertirDiaSemana(dayOfWeek);
        
        // 2. Buscar horarios del médico para ese día
        List<Horario> horarios = horarioRepository.findAll().stream()
                .filter(h -> h.getMedico().getId().equals(idMedico) && 
                           h.getDiaSemana().toString().equals(diaSemanaEsp))
                .collect(Collectors.toList());
        
        if (horarios.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>()); // No hay horarios configurados
        }
        
        // 3. Obtener TODAS las citas del médico en esa fecha
        List<Cita> citasDelDia = citaRepository.findAll().stream()
                .filter(c -> c.getMedico().getId().equals(idMedico) &&
                           c.getFecha().equals(fecha))
                .collect(Collectors.toList());
        
        List<SlotDisponibleResponse> todosLosSlots = new ArrayList<>();
        
        // 4. Para cada horario, generar slots de 1 HORA
        for (Horario horario : horarios) {
            LocalTime horaActual = horario.getHoraInicio();
            
            while (horaActual.isBefore(horario.getHoraFin())) {
                LocalTime horaFinSlot = horaActual.plusHours(1); // 1 HORA
                
                // 5. Verificar si YA HAY una cita en este horario
                final LocalTime horaSlot = horaActual; // Variable final para lambda
                boolean hayOtraCita = citasDelDia.stream()
                        .anyMatch(c -> c.getHoraInicio().equals(horaSlot));
                
                // 6. Crear respuesta del slot (disponible si NO hay cita)
                SlotDisponibleResponse slot = new SlotDisponibleResponse(
                    horaActual.toString(),
                    horaActual,
                    horaFinSlot,
                    hayOtraCita // ocupado = true si ya hay cita
                );
                
                todosLosSlots.add(slot);
                horaActual = horaFinSlot; // Siguiente hora
            }
        }
        
        return ResponseEntity.ok(todosLosSlots);
    }

    // UPDATE
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('Recepcionista')")
    @Transactional
    public ResponseEntity<HorarioResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody HorarioRequest request) {
        
        Horario horario = horarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Horario no encontrado"));
        
        horario.getMedico().getUsuario().getNombre();
        
        horario.setDiaSemana(DiaSemana.valueOf(request.getDiaSemana()));
        horario.setHoraInicio(request.getHoraInicio());
        horario.setHoraFin(request.getHoraFin());

        Horario actualizado = horarioRepository.save(horario);
        return ResponseEntity.ok(convertirAHorarioResponse(actualizado));
    }

    // DELETE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Recepcionista')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        Horario horario = horarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Horario no encontrado"));
        
        horarioRepository.delete(horario);
        return ResponseEntity.noContent().build();
    }

    // Método auxiliar para convertir día de la semana
    private String convertirDiaSemana(DayOfWeek dayOfWeek) {
        switch (dayOfWeek) {
            case MONDAY: return "Lunes";
            case TUESDAY: return "Martes";
            case WEDNESDAY: return "Miercoles";
            case THURSDAY: return "Jueves";
            case FRIDAY: return "Viernes";
            case SATURDAY: return "Sabado";
            case SUNDAY: return "Domingo";
            default: return "";
        }
    }

    // Método auxiliar para convertir a DTO
    private HorarioResponse convertirAHorarioResponse(Horario horario) {
        HorarioResponse response = new HorarioResponse();
        response.setId(horario.getId());
        response.setIdMedico(horario.getMedico().getId());
        response.setNombreMedico("Dr. " + horario.getMedico().getUsuario().getNombre() + " " + 
                                 horario.getMedico().getUsuario().getApellido());
        response.setEspecialidad(horario.getMedico().getEspecialidad());
        response.setDiaSemana(horario.getDiaSemana().toString());
        response.setHoraInicio(horario.getHoraInicio());
        response.setHoraFin(horario.getHoraFin());
        return response;
    }
}