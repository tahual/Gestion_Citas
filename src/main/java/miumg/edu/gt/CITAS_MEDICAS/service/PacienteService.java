/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package miumg.edu.gt.CITAS_MEDICAS.service;

import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Paciente;

/**
 *
 * @author danyt
 */

public interface PacienteService {
    Paciente crear(Paciente p);
    Paciente obtener(Integer id);
}
