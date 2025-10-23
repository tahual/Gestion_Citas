package miumg.edu.gt.CITAS_MEDICAS.web.dto.request;

import jakarta.validation.constraints.Size;

public class MedicoUpdateRequest {
    
    @Size(max = 50)
    private String especialidad;

    // Getter y Setter
    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }
}