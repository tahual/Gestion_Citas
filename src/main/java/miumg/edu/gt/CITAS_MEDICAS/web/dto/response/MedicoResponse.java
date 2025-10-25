// src/main/java/miumg/edu/gt/CITAS_MEDICAS/web/dto/response/MedicoResponse.java
package miumg.edu.gt.CITAS_MEDICAS.web.dto.response;

import java.math.BigDecimal;

public class MedicoResponse {
    private Integer id;
    private Integer idUsuario;
    private String nombre;
    private String apellido;
    private String correo;
    private String telefono;
    private String especialidad;
    private Integer anosExperiencia;
    private String descripcion;
    private String consultorio;
    private BigDecimal rating;
    private String horarioAtencion; // Calculado dinámicamente

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    
    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }
    
    public Integer getAnosExperiencia() { return anosExperiencia; }
    public void setAnosExperiencia(Integer anosExperiencia) { this.anosExperiencia = anosExperiencia; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public String getConsultorio() { return consultorio; }
    public void setConsultorio(String consultorio) { this.consultorio = consultorio; }
    
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    
    public String getHorarioAtencion() { return horarioAtencion; }
    public void setHorarioAtencion(String horarioAtencion) { this.horarioAtencion = horarioAtencion; }
}