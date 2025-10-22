/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package miumg.edu.gt.CITAS_MEDICAS.service.impl;

import java.time.LocalDateTime;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Cita;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Notificacion;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.TipoNotificacion;
import miumg.edu.gt.CITAS_MEDICAS.repository.NotificacionRepository;
import miumg.edu.gt.CITAS_MEDICAS.service.NotificacionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author danyt
 */
@Service
@Transactional
public class NotificacionServiceImpl implements NotificacionService {

    private final NotificacionRepository repo;
    public NotificacionServiceImpl(NotificacionRepository repo){ this.repo = repo; }
    
    
    @Override
    public Notificacion enviar(Cita cita, TipoNotificacion tipo, String mensaje) {
        Notificacion n = new Notificacion();
        n.setCita(cita);
        n.setTipo(tipo);
        n.setMensaje(mensaje);
        n.setFechaEnvio(LocalDateTime.now());
        return repo.save(n);
    }
}
