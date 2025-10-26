// src/main/java/miumg/edu/gt/CITAS_MEDICAS/domain/entity/Paciente.java
// ACTUALIZADO CON telefono y correo
package miumg.edu.gt.CITAS_MEDICAS.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Paciente", schema = "CitasMedicas")
public class Paciente {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_paciente")
    private Integer id;
    
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;
    
    @Column(name = "documento_identidad", length = 50)
    private String documentoIdentidad;
    
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;
    
    // NUEVO: Teléfono y correo propios del paciente
    @Column(name = "telefono", length = 20)
    private String telefono;
    
    @Column(name = "correo", length = 100)
    private String correo;
    
    @Column(length = 150)
    private String direccion;
    
    @Column(name = "tipo_sangre", length = 10)
    private String tipoSangre;
    
    @Column(name = "alergias", columnDefinition = "TEXT")
    private String alergias;
    
    @Column(name = "contacto_emergencia_nombre", length = 100)
    private String contactoEmergenciaNombre;
    
    @Column(name = "contacto_emergencia_telefono", length = 20)
    private String contactoEmergenciaTelefono;
    
    @OneToMany(mappedBy = "paciente")
    private List<Cita> citas = new ArrayList<>();
    
    @OneToMany(mappedBy = "paciente")
    private List<HistorialMedico> historial = new ArrayList<>();

    // Getters y Setters
    public Integer getId() { 
        return id; 
    }
    
    public void setId(Integer id) { 
        this.id = id; 
    }
    
    public Usuario getUsuario() { 
        return usuario; 
    }
    
    public void setUsuario(Usuario usuario) { 
        this.usuario = usuario; 
    }
    
    public String getDocumentoIdentidad() { 
        return documentoIdentidad; 
    }
    
    public void setDocumentoIdentidad(String documentoIdentidad) { 
        this.documentoIdentidad = documentoIdentidad; 
    }
    
    public LocalDate getFechaNacimiento() {
        return fechaNacimiento; 
    }
    
    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento; 
    }
    
    // NUEVO
    public String getTelefono() {
        return telefono;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    
    public String getCorreo() {
        return correo;
    }
    
    public void setCorreo(String correo) {
        this.correo = correo;
    }
    
    public String getDireccion() { 
        return direccion; 
    }
    
    public void setDireccion(String direccion) { 
        this.direccion = direccion; 
    }
    
    public String getTipoSangre() { 
        return tipoSangre; 
    }
    
    public void setTipoSangre(String tipoSangre) { 
        this.tipoSangre = tipoSangre; 
    }
    
    public String getAlergias() { 
        return alergias; 
    }
    
    public void setAlergias(String alergias) { 
        this.alergias = alergias; 
    }
    
    public String getContactoEmergenciaNombre() { 
        return contactoEmergenciaNombre; 
    }
    
    public void setContactoEmergenciaNombre(String contactoEmergenciaNombre) { 
        this.contactoEmergenciaNombre = contactoEmergenciaNombre; 
    }
    
    public String getContactoEmergenciaTelefono() { 
        return contactoEmergenciaTelefono; 
    }
    
    public void setContactoEmergenciaTelefono(String contactoEmergenciaTelefono) { 
        this.contactoEmergenciaTelefono = contactoEmergenciaTelefono; 
    }
    
    public List<Cita> getCitas() { 
        return citas; 
    }
    
    public void setCitas(List<Cita> citas) { 
        this.citas = citas; 
    }
    
    public List<HistorialMedico> getHistorial() { 
        return historial; 
    }
    
    public void setHistorial(List<HistorialMedico> historial) { 
        this.historial = historial; 
    }
}