/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package miumg.edu.gt.CITAS_MEDICAS.service;

import java.time.LocalDate;
import java.util.List;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Cita;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.EstadoCita;

/**
 *
 * @author danyt
 */
public interface CitaService {
    Cita agendar(Integer idPaciente, Integer idMedico, Integer idHorario, LocalDate fecha);
    Cita cambiarEstado(Integer idCita, EstadoCita nuevoEstado, String motivoOpcional);
    Cita reprogramar(Integer idCita, Integer nuevoIdHorario, LocalDate nuevaFecha);
    List<Cita> listarPorMedicoYFecha(Integer idMedico, LocalDate fecha);
    List<Cita> listarPorPaciente(Integer idPaciente);
}