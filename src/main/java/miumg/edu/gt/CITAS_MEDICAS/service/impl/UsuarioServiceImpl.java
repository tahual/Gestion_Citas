/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package miumg.edu.gt.CITAS_MEDICAS.service.impl;

import java.util.Optional;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Usuario;
import miumg.edu.gt.CITAS_MEDICAS.repository.UsuarioRepository;
import miumg.edu.gt.CITAS_MEDICAS.service.UsuarioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author danyt
 */
@Service
@Transactional
public class UsuarioServiceImpl implements UsuarioService {
    private final UsuarioRepository repo;
    public UsuarioServiceImpl(UsuarioRepository repo){ this.repo = repo; }

    @Override public Usuario crear(Usuario u){ return repo.save(u); }
    @Override public Optional<Usuario> buscarPorCorreo(String correo){ return repo.findByCorreo(correo); }
    @Override @Transactional(readOnly = true) public Usuario obtener(Integer id){
        return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    }
}
