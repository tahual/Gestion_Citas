/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package miumg.edu.gt.CITAS_MEDICAS.repository;

import java.time.LocalDate;
import java.util.List;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Cita;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Horario;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Medico;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Paciente;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.EstadoCita;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author danyt
 */
public interface CitaRepository extends JpaRepository<Cita, Integer> {
    List<Cita> findByMedicoAndFecha(Medico medico, LocalDate fecha);
    List<Cita> findByPacienteOrderByFechaDesc(Paciente paciente);
    boolean existsByHorarioAndFechaAndEstadoIn(Horario horario, LocalDate fecha, List<EstadoCita> estados);
}
