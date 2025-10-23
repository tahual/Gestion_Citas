package miumg.edu.gt.CITAS_MEDICAS.web.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class HistorialMedicoRequest {
    
    @NotNull(message = "El ID del paciente es obligatorio")
    private Integer idPaciente;
    
    @NotNull(message = "El ID del médico es obligatorio")
    private Integer idMedico;
    
    @NotBlank(message = "El diagnóstico es obligatorio")
    private String diagnostico;
    
    private String tratamiento;

    // Getters y Setters
    public Integer getIdPaciente() { return idPaciente; }
    public void setIdPaciente(Integer idPaciente) { this.idPaciente = idPaciente; }
    
    public Integer getIdMedico() { return idMedico; }
    public void setIdMedico(Integer idMedico) { this.idMedico = idMedico; }
    
    public String getDiagnostico() { return diagnostico; }
    public void setDiagnostico(String diagnostico) { this.diagnostico = diagnostico; }
    
    public String getTratamiento() { return tratamiento; }
    public void setTratamiento(String tratamiento) { this.tratamiento = tratamiento; }
}