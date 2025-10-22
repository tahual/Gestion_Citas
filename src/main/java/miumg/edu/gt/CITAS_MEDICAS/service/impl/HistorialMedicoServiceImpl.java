/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package miumg.edu.gt.CITAS_MEDICAS.service.impl;

import java.util.List;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.HistorialMedico;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Paciente;
import miumg.edu.gt.CITAS_MEDICAS.repository.HistorialMedicoRepository;
import miumg.edu.gt.CITAS_MEDICAS.repository.PacienteRepository;
import miumg.edu.gt.CITAS_MEDICAS.service.HistorialMedicoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author danyt
 */
@Service
@Transactional
public class HistorialMedicoServiceImpl implements HistorialMedicoService {

    private final HistorialMedicoRepository repo;
    private final PacienteRepository pacienteRepo;

    public HistorialMedicoServiceImpl(HistorialMedicoRepository repo, PacienteRepository pacienteRepo) {
        this.repo = repo; this.pacienteRepo = pacienteRepo;
    }

    @Override public HistorialMedico registrar(HistorialMedico h){ return repo.save(h); }

    @Override @Transactional(readOnly = true)
    public List<HistorialMedico> listarPorPaciente(Integer idPaciente) {
        Paciente p = pacienteRepo.findById(idPaciente)
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));
        return repo.findByPacienteOrderByFechaRegistroDesc(p);
    }
}