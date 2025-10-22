/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package miumg.edu.gt.CITAS_MEDICAS.service;

import java.time.LocalTime;
import java.util.List;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Horario;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Medico;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.DiaSemana;

/**
 *
 * @author danyt
 */
public interface HorarioService {
    Horario crear(Horario h);
    List<Horario> listarPorMedicoYDia(Medico m, DiaSemana d);
    boolean haySolape(Medico m, DiaSemana d, LocalTime inicio, LocalTime fin);
}