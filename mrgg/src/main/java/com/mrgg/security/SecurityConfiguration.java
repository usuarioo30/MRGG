package com.mrgg.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
	@Autowired
	private JWTAuthenticationFilter JWTAuthenticationFilter;

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.cors().and()
				.csrf().disable()
				.authorizeHttpRequests()
				// LOGIN
				.requestMatchers("/login").permitAll()
				.requestMatchers("/actorLogueado").permitAll()
				.requestMatchers("/actorExiste/**").permitAll()

				// ADMIN
				.requestMatchers(HttpMethod.GET, "/admin").hasAuthority("ADMIN")
				.requestMatchers(HttpMethod.PUT, "/admin").hasAuthority("ADMIN")
				.requestMatchers(HttpMethod.POST, "/admin").hasAuthority("ADMIN")
				.requestMatchers(HttpMethod.DELETE, "/admin").hasAuthority("ADMIN")

				// USUARIO
				.requestMatchers(HttpMethod.GET, "/usuario").hasAuthority("ADMIN")
				.requestMatchers(HttpMethod.GET, "/usuario").hasAuthority("USER")
				.requestMatchers(HttpMethod.POST, "/usuario").permitAll()
				.requestMatchers(HttpMethod.PUT, "/usuario").hasAuthority("USER")
				.requestMatchers(HttpMethod.PUT, "/usuario/actualizarContrasena").hasAuthority("USER")
				.requestMatchers(HttpMethod.DELETE, "/usuario").hasAuthority("USER")

				// EVENTO
				.requestMatchers(HttpMethod.GET, "/evento").hasAuthority("USER")
				.requestMatchers(HttpMethod.GET, "/evento/deUsuario").hasAuthority("USER")
				.requestMatchers(HttpMethod.GET, "/evento/porJuego/{id}").permitAll()
				.requestMatchers(HttpMethod.GET, "/evento/cantidad/{juegoId}").permitAll()
				.requestMatchers(HttpMethod.GET, "/evento/{id}").hasAuthority("USER")
				.requestMatchers(HttpMethod.GET, "/evento/usuario/{id}").permitAll()
				.requestMatchers(HttpMethod.POST, "/evento/crear/{juegoId}").hasAuthority("USER")
				.requestMatchers(HttpMethod.POST, "/evento").hasAuthority("USER")
				.requestMatchers(HttpMethod.DELETE, "/evento/{id}").permitAll()
				.requestMatchers(HttpMethod.PUT, "/evento").hasAuthority("USER")

				// SOLICITUD
				.requestMatchers(HttpMethod.GET, "/solicitud/deUsuario").hasAuthority("USER")
				.requestMatchers(HttpMethod.GET, "/solicitud/deEvento").hasAuthority("USER")
				.requestMatchers(HttpMethod.GET, "/solicitud/{id}").hasAuthority("USER")
				.requestMatchers(HttpMethod.GET, "/solicitud/create/{idUser}").hasAuthority("USER")
				.requestMatchers(HttpMethod.GET, "/solicitud/accept/{id}").hasAuthority("USER")
				.requestMatchers(HttpMethod.GET, "/solicitud/refuse/{id}").hasAuthority("USER")
				.requestMatchers(HttpMethod.DELETE, "/solicitud/{id}").hasAuthority("USER")

				// JUEGO
				.requestMatchers(HttpMethod.GET, "/juego").permitAll()
				.requestMatchers(HttpMethod.GET, "/juego/{id}").permitAll()
				.requestMatchers(HttpMethod.GET, "/juego/categoria").permitAll()
				.requestMatchers(HttpMethod.POST, "/juego").hasAuthority("ADMIN")
				.requestMatchers(HttpMethod.PUT, "/juego").hasAuthority("ADMIN")
				.requestMatchers(HttpMethod.DELETE, "/juego/{id}").hasAuthority("ADMIN")

				// SWAGGER
				.requestMatchers("/swagger-ui/**").permitAll()
				.requestMatchers("/v3/api-docs/**").permitAll()

				// OTRAS RUTAS
				.anyRequest().authenticated();

		http.addFilterBefore(JWTAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(List.of("http://localhost:4200"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
		config.setAllowCredentials(true);
		source.registerCorsConfiguration("/**", config);
		return new CorsFilter(source);
	}
}
