/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package miumg.edu.gt.CITAS_MEDICAS.service;

import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Cita;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Notificacion;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.TipoNotificacion;

/**
 *
 * @author danyt
 */
public interface NotificacionService {
    Notificacion enviar(Cita cita, TipoNotificacion tipo, String mensaje);
}