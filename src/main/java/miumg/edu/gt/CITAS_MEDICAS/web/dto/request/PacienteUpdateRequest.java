package miumg.edu.gt.CITAS_MEDICAS.web.dto.request;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class PacienteUpdateRequest {
    
    private LocalDate fechaNacimiento;
    
    @Size(max = 150)
    private String direccion;

    // Getters y Setters
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
}