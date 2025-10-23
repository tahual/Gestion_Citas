package miumg.edu.gt.CITAS_MEDICAS.web.dto.request;

public class HistorialMedicoUpdateRequest {
    
    private String diagnostico;
    private String tratamiento;

    // Getters y Setters
    public String getDiagnostico() { return diagnostico; }
    public void setDiagnostico(String diagnostico) { this.diagnostico = diagnostico; }
    
    public String getTratamiento() { return tratamiento; }
    public void setTratamiento(String tratamiento) { this.tratamiento = tratamiento; }
}