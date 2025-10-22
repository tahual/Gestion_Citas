/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package miumg.edu.gt.CITAS_MEDICAS.service;

import java.util.Optional;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Usuario;

/**
 *
 * @author danyt
 */
public interface UsuarioService {
    Usuario crear(Usuario u);
    Optional<Usuario> buscarPorCorreo(String correo);
    Usuario obtener(Integer id);
}
