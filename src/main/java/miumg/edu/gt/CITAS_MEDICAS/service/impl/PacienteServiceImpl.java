/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package miumg.edu.gt.CITAS_MEDICAS.service.impl;

import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Paciente;
import miumg.edu.gt.CITAS_MEDICAS.repository.PacienteRepository;
import miumg.edu.gt.CITAS_MEDICAS.service.PacienteService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author danyt
 */
@Service
@Transactional
public class PacienteServiceImpl implements PacienteService {
    private final PacienteRepository repo;
    public PacienteServiceImpl(PacienteRepository repo){ this.repo = repo; }

    @Override public Paciente crear(Paciente p){ return repo.save(p); }
    @Override @Transactional(readOnly = true) public Paciente obtener(Integer id){
        return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));
    }
}