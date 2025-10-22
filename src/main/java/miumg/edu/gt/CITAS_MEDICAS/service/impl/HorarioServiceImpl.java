/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package miumg.edu.gt.CITAS_MEDICAS.service.impl;

import java.time.LocalTime;
import java.util.List;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Horario;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Medico;
import miumg.edu.gt.CITAS_MEDICAS.domain.enums.DiaSemana;
import miumg.edu.gt.CITAS_MEDICAS.repository.HorarioRepository;
import miumg.edu.gt.CITAS_MEDICAS.service.HorarioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author danyt
 */
@Service
@Transactional
public class HorarioServiceImpl implements HorarioService {
    private final HorarioRepository repo;
    public HorarioServiceImpl(HorarioRepository repo){ this.repo = repo; }

    @Override public Horario crear(Horario h){
        // Chequeo de solape simple
        if (haySolape(h.getMedico(), h.getDiaSemana(), h.getHoraInicio(), h.getHoraFin())) {
            throw new IllegalArgumentException("Existe solape de horario para ese médico y día");
        }
        return repo.save(h);
    }

    @Override @Transactional(readOnly = true)
    public List<Horario> listarPorMedicoYDia(Medico m, DiaSemana d) {
        return repo.findByMedicoAndDiaSemana(m, d);
    }

    @Override @Transactional(readOnly = true)
    public boolean haySolape(Medico m, DiaSemana d, LocalTime inicio, LocalTime fin) {
        return repo.existsByMedicoAndDiaSemanaAndHoraInicioLessThanAndHoraFinGreaterThan(m, d, fin, inicio);
    }
}
