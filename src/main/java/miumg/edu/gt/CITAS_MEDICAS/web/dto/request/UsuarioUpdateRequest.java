package miumg.edu.gt.CITAS_MEDICAS.web.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public class UsuarioUpdateRequest {
    
    @Size(max = 50)
    private String nombre;
    
    @Size(max = 50)
    private String apellido;
    
    @Email
    @Size(max = 100)
    private String correo;
    
    @Size(max = 20)
    private String telefono;
    
    @Size(min = 6, max = 100)
    private String password;

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}