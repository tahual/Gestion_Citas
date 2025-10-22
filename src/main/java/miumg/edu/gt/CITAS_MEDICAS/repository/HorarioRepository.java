/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package miumg.edu.gt.CITAS_MEDICAS.repository;

import java.time.LocalTime;
import java.util.List;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Horario;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Medico;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.DiaSemana;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author danyt
 */
public interface HorarioRepository extends JpaRepository<Horario, Integer> {
    List<Horario> findByMedicoAndDiaSemana(Medico medico, DiaSemana diaSemana);
    boolean existsByMedicoAndDiaSemanaAndHoraInicioLessThanAndHoraFinGreaterThan(
            Medico medico, DiaSemana diaSemana, LocalTime fin, LocalTime inicio);
}