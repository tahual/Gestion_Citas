/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package miumg.edu.gt.CITAS_MEDICAS.service;

import java.util.List;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.HistorialMedico;

/**
 *
 * @author danyt
 */
public interface HistorialMedicoService {
    HistorialMedico registrar(HistorialMedico h);
    List<HistorialMedico> listarPorPaciente(Integer idPaciente);
}
