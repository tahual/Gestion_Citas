// src/main/java/miumg/edu/gt/CITAS_MEDICAS/web/dto/response/EstadisticasResponse.java
package miumg.edu.gt.CITAS_MEDICAS.web.dto.response;

public class EstadisticasResponse {
    private Integer citasProgramadas;
    private Integer diasProximaCita;
    private Integer medicosDisponibles;
    private Integer citasEsteMes;
    private Integer citasProximas;
    private Integer citasConfirmadas;
    private Integer citasPendientes;
    private Integer citasPasadas;
    private Integer citasTotales;

    // Getters y Setters
    public Integer getCitasProgramadas() { return citasProgramadas; }
    public void setCitasProgramadas(Integer citasProgramadas) { this.citasProgramadas = citasProgramadas; }
    
    public Integer getDiasProximaCita() { return diasProximaCita; }
    public void setDiasProximaCita(Integer diasProximaCita) { this.diasProximaCita = diasProximaCita; }
    
    public Integer getMedicosDisponibles() { return medicosDisponibles; }
    public void setMedicosDisponibles(Integer medicosDisponibles) { this.medicosDisponibles = medicosDisponibles; }
    
    public Integer getCitasEsteMes() { return citasEsteMes; }
    public void setCitasEsteMes(Integer citasEsteMes) { this.citasEsteMes = citasEsteMes; }
    
    public Integer getCitasProximas() { return citasProximas; }
    public void setCitasProximas(Integer citasProximas) { this.citasProximas = citasProximas; }
    
    public Integer getCitasConfirmadas() { return citasConfirmadas; }
    public void setCitasConfirmadas(Integer citasConfirmadas) { this.citasConfirmadas = citasConfirmadas; }
    
    public Integer getCitasPendientes() { return citasPendientes; }
    public void setCitasPendientes(Integer citasPendientes) { this.citasPendientes = citasPendientes; }
    
    public Integer getCitasPasadas() { return citasPasadas; }
    public void setCitasPasadas(Integer citasPasadas) { this.citasPasadas = citasPasadas; }
    
    public Integer getCitasTotales() { return citasTotales; }
    public void setCitasTotales(Integer citasTotales) { this.citasTotales = citasTotales; }
}