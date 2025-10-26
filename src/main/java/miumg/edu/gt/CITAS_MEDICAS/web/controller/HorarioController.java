// src/main/java/miumg/edu/gt/CITAS_MEDICAS/web/controller/HorarioController.java
// ACTUALIZADO CON VALIDACIÓN DE DUPLICADOS
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

    // CREATE - CON VALIDACIÓN DE DUPLICADOS
    @PostMapping
    @PreAuthorize("hasRole('Recepcionista')")
    @Transactional
    public ResponseEntity<?> crear(@Valid @RequestBody HorarioRequest request) {
        try {
            Medico medico = medicoRepository.findById(request.getIdMedico())
                    .orElseThrow(() -> new IllegalArgumentException("Médico no encontrado"));

            DiaSemana diaSemana = DiaSemana.valueOf(request.getDiaSemana());

            // NUEVA VALIDACIÓN: Verificar si ya existe un horario para este médico en este día
            boolean existeHorario = horarioRepository.findAll().stream()
                    .anyMatch(h -> h.getMedico().getId().equals(request.getIdMedico()) &&
                                 h.getDiaSemana().equals(diaSemana));

            if (existeHorario) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ErrorResponse(
                            "Ya existe un horario para este médico el día " + diaSemana + 
                            ". Por favor, edita el horario existente o elimínalo primero."
                        ));
            }

            // VALIDACIÓN: Verificar que hora_fin sea mayor que hora_inicio
            if (!request.getHoraFin().isAfter(request.getHoraInicio())) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("La hora de fin debe ser mayor que la hora de inicio"));
            }

            Horario horario = new Horario();
            horario.setMedico(medico);
            horario.setDiaSemana(diaSemana);
            horario.setHoraInicio(request.getHoraInicio());
            horario.setHoraFin(request.getHoraFin());

            Horario guardado = horarioRepository.save(horario);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertirAHorarioResponse(guardado));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error al crear horario: " + e.getMessage()));
        }
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

    // SLOTS DISPONIBLES
    @GetMapping("/slots-disponibles")
    @Transactional(readOnly = true)
    public ResponseEntity<List<SlotDisponibleResponse>> obtenerSlotsDisponibles(
            @RequestParam Integer idMedico,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        
        DayOfWeek dayOfWeek = fecha.getDayOfWeek();
        String diaSemanaEsp = convertirDiaSemana(dayOfWeek);
        
        List<Horario> horarios = horarioRepository.findAll().stream()
                .filter(h -> h.getMedico().getId().equals(idMedico) && 
                           h.getDiaSemana().toString().equals(diaSemanaEsp))
                .collect(Collectors.toList());
        
        if (horarios.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>());
        }
        
        List<Cita> citasDelDia = citaRepository.findAll().stream()
                .filter(c -> c.getMedico().getId().equals(idMedico) &&
                           c.getFecha().equals(fecha))
                .collect(Collectors.toList());
        
        List<SlotDisponibleResponse> todosLosSlots = new ArrayList<>();
        
        for (Horario horario : horarios) {
            LocalTime horaActual = horario.getHoraInicio();
            
            while (horaActual.isBefore(horario.getHoraFin())) {
                LocalTime horaFinSlot = horaActual.plusHours(1);
                
                final LocalTime horaSlot = horaActual;
                boolean hayOtraCita = citasDelDia.stream()
                        .anyMatch(c -> c.getHoraInicio().equals(horaSlot));
                
                SlotDisponibleResponse slot = new SlotDisponibleResponse(
                    horaActual.toString(),
                    horaActual,
                    horaFinSlot,
                    hayOtraCita
                );
                
                todosLosSlots.add(slot);
                horaActual = horaFinSlot;
            }
        }
        
        return ResponseEntity.ok(todosLosSlots);
    }

    // UPDATE - CON VALIDACIÓN
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('Recepcionista')")
    @Transactional
    public ResponseEntity<?> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody HorarioRequest request) {
        
        try {
            Horario horario = horarioRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Horario no encontrado"));
            
            horario.getMedico().getUsuario().getNombre();
            
            DiaSemana nuevoDiaSemana = DiaSemana.valueOf(request.getDiaSemana());
            
            // VALIDACIÓN: Si cambió el día, verificar que no exista otro horario para ese día
            if (!horario.getDiaSemana().equals(nuevoDiaSemana)) {
                boolean existeOtroHorario = horarioRepository.findAll().stream()
                        .anyMatch(h -> !h.getId().equals(id) && 
                                     h.getMedico().getId().equals(horario.getMedico().getId()) &&
                                     h.getDiaSemana().equals(nuevoDiaSemana));
                
                if (existeOtroHorario) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body(new ErrorResponse(
                                "Ya existe otro horario para este médico el día " + nuevoDiaSemana
                            ));
                }
            }
            
            // VALIDACIÓN: hora_fin > hora_inicio
            if (!request.getHoraFin().isAfter(request.getHoraInicio())) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("La hora de fin debe ser mayor que la hora de inicio"));
            }
            
            horario.setDiaSemana(nuevoDiaSemana);
            horario.setHoraInicio(request.getHoraInicio());
            horario.setHoraFin(request.getHoraFin());

            Horario actualizado = horarioRepository.save(horario);
            return ResponseEntity.ok(convertirAHorarioResponse(actualizado));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error al actualizar horario: " + e.getMessage()));
        }
    }

    // DELETE - ACTUALIZADO: Permitir a Recepcionista
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Recepcionista')")
    @Transactional
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            Horario horario = horarioRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Horario no encontrado"));
            
            // VALIDACIÓN: Verificar si hay citas futuras con este horario
            long citasFuturas = citaRepository.findAll().stream()
                    .filter(c -> c.getHorario().getId().equals(id) &&
                               c.getFecha().isAfter(LocalDate.now()))
                    .count();
            
            if (citasFuturas > 0) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ErrorResponse(
                            "No se puede eliminar este horario porque tiene " + citasFuturas + 
                            " cita(s) programada(s). Por favor, cancela o reprograma las citas primero."
                        ));
            }
            
            horarioRepository.delete(horario);
            return ResponseEntity.noContent().build();
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error al eliminar horario: " + e.getMessage()));
        }
    }

    // Método auxiliar
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

    // Método auxiliar
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
    
    // Clase interna para respuestas de error
    public static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
}