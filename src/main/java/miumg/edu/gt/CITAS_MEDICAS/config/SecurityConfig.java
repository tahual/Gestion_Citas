package miumg.edu.gt.CITAS_MEDICAS.config;

import miumg.edu.gt.CITAS_MEDICAS.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Rutas públicas (sin autenticación)
                .requestMatchers("/api/auth/**").permitAll()
                
                // Rutas de MÉDICOS (solo médicos)
                .requestMatchers(HttpMethod.GET, "/api/medicos/**").hasAnyRole("Medico", "Recepcionista")
                .requestMatchers(HttpMethod.POST, "/api/medicos").hasRole("Recepcionista")
                .requestMatchers(HttpMethod.PUT, "/api/medicos/**").hasAnyRole("Medico", "Recepcionista")
                .requestMatchers(HttpMethod.DELETE, "/api/medicos/**").hasRole("Recepcionista")
                
                // Rutas de PACIENTES (todos pueden ver, solo recepcionista crea/modifica)
                .requestMatchers(HttpMethod.GET, "/api/pacientes/**").hasAnyRole("Medico", "Paciente", "Recepcionista")
                .requestMatchers(HttpMethod.POST, "/api/pacientes").hasRole("Recepcionista")
                .requestMatchers(HttpMethod.PUT, "/api/pacientes/**").hasAnyRole("Paciente", "Recepcionista")
                .requestMatchers(HttpMethod.DELETE, "/api/pacientes/**").hasRole("Recepcionista")
                
                // Rutas de HORARIOS (médicos y recepcionistas)
                .requestMatchers(HttpMethod.GET, "/api/horarios/**").hasAnyRole("Medico", "Paciente", "Recepcionista")
                .requestMatchers(HttpMethod.POST, "/api/horarios").hasAnyRole("Medico", "Recepcionista")
                .requestMatchers(HttpMethod.PUT, "/api/horarios/**").hasAnyRole("Medico", "Recepcionista")
                .requestMatchers(HttpMethod.DELETE, "/api/horarios/**").hasAnyRole("Medico", "Recepcionista")
                
                // Rutas de CITAS (todos pueden participar)
                .requestMatchers(HttpMethod.GET, "/api/citas/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/citas").hasAnyRole("Paciente", "Recepcionista")
                .requestMatchers(HttpMethod.PUT, "/api/citas/**").hasAnyRole("Paciente", "Medico", "Recepcionista")
                .requestMatchers(HttpMethod.DELETE, "/api/citas/**").hasRole("Recepcionista")
                
                // Rutas de HISTORIAL MÉDICO (solo médicos pueden crear/ver/editar)
                .requestMatchers(HttpMethod.GET, "/api/historial/**").hasAnyRole("Medico", "Paciente")
                .requestMatchers(HttpMethod.POST, "/api/historial").hasRole("Medico")
                .requestMatchers(HttpMethod.PUT, "/api/historial/**").hasRole("Medico")
                .requestMatchers(HttpMethod.DELETE, "/api/historial/**").hasRole("Medico")
                
                // Rutas de USUARIOS (admin/recepcionista)
                .requestMatchers("/api/usuarios/**").hasRole("Recepcionista")
                
                // Cualquier otra ruta requiere autenticación
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}