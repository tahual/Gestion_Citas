/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package miumg.edu.gt.CITAS_MEDICAS.repository;

import java.util.Optional;
import miumg.edu.gt.CITAS_MEDICAS.domain.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author danyt
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByCorreo(String correo);
}
