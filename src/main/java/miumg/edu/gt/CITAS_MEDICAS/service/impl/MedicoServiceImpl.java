/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package miumg.edu.gt.CITAS_MEDICAS.service.impl;

import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Medico;
import miumg.edu.gt.CITAS_MEDICAS.repository.MedicoRepository;
import miumg.edu.gt.CITAS_MEDICAS.service.MedicoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author danyt
 */
@Service
@Transactional
public class MedicoServiceImpl implements MedicoService {
    private final MedicoRepository repo;
    public MedicoServiceImpl(MedicoRepository repo){ this.repo = repo; }

    @Override public Medico crear(Medico m){ return repo.save(m); }
    @Override @Transactional(readOnly = true) public Medico obtener(Integer id){
        return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Medico no encontrado"));
    }
}