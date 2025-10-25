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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

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
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS habilitado
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Rutas públicas (sin autenticación)
                .requestMatchers("/api/auth/**").permitAll()
                
                // Rutas de MÉDICOS - LECTURA para todos autenticados
                .requestMatchers(HttpMethod.GET, "/api/medicos/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/medicos").hasRole("Recepcionista")
                .requestMatchers(HttpMethod.PUT, "/api/medicos/**").hasAnyRole("Medico", "Recepcionista")
                .requestMatchers(HttpMethod.DELETE, "/api/medicos/**").hasRole("Recepcionista")
                
                // Rutas de PACIENTES
                .requestMatchers(HttpMethod.GET, "/api/pacientes/**").hasAnyRole("Medico", "Paciente", "Recepcionista")
                .requestMatchers(HttpMethod.POST, "/api/pacientes").hasRole("Recepcionista")
                .requestMatchers(HttpMethod.PUT, "/api/pacientes/**").hasAnyRole("Paciente", "Recepcionista")
                .requestMatchers(HttpMethod.DELETE, "/api/pacientes/**").hasRole("Recepcionista")
                
                // Rutas de HORARIOS - LECTURA para todos autenticados
                .requestMatchers(HttpMethod.GET, "/api/horarios/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/horarios").hasAnyRole("Medico", "Recepcionista")
                .requestMatchers(HttpMethod.PUT, "/api/horarios/**").hasAnyRole("Medico", "Recepcionista")
                .requestMatchers(HttpMethod.DELETE, "/api/horarios/**").hasAnyRole("Medico", "Recepcionista")
                
                // Rutas de CITAS
                .requestMatchers(HttpMethod.GET, "/api/citas/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/citas").hasAnyRole("Paciente", "Recepcionista")
                .requestMatchers(HttpMethod.PUT, "/api/citas/**").hasAnyRole("Paciente", "Medico", "Recepcionista")
                .requestMatchers(HttpMethod.DELETE, "/api/citas/**").hasRole("Recepcionista")
                
                // Rutas de HISTORIAL MÉDICO
                .requestMatchers(HttpMethod.GET, "/api/historial/**").hasAnyRole("Medico", "Paciente")
                .requestMatchers(HttpMethod.POST, "/api/historial").hasRole("Medico")
                .requestMatchers(HttpMethod.PUT, "/api/historial/**").hasRole("Medico")
                .requestMatchers(HttpMethod.DELETE, "/api/historial/**").hasRole("Medico")
                
                // Rutas de ESTADÍSTICAS
                .requestMatchers(HttpMethod.GET, "/api/estadisticas/**").authenticated()
                
                // Rutas de USUARIOS
                .requestMatchers("/api/usuarios/**").hasRole("Recepcionista")
                
                // Cualquier otra ruta requiere autenticación
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permitir estos orígenes
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173"
        ));
        
        // Permitir credenciales
        configuration.setAllowCredentials(true);
        
        // Permitir estos headers
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // Permitir estos métodos
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // Exponer estos headers
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        
        // Tiempo máximo de cache para la configuración CORS
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}