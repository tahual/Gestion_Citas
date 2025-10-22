/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package miumg.edu.gt.CITAS_MEDICAS.repository;

import java.util.List;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.HistorialMedico;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author danyt
 */
public interface HistorialMedicoRepository extends JpaRepository<HistorialMedico, Integer> {
    List<HistorialMedico> findByPacienteOrderByFechaRegistroDesc(Paciente paciente);
}