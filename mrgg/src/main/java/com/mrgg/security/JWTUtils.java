package com.mrgg.security;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;

import com.mrgg.entity.Actor;
import com.mrgg.entity.Admin;
import com.mrgg.entity.Usuario;
import com.mrgg.service.ActorService;
import com.mrgg.service.AdminService;
import com.mrgg.service.UsuarioService;

@Component
public class JWTUtils {
	private static final String JWT_FIRMA = "mrgg123";
	private static final long EXTENCION_TOKEN = 86400000;

	@Autowired
	@Lazy
	private ActorService actorService;

	@Autowired
	@Lazy
	private UsuarioService usuarioService;

	@Autowired
	@Lazy
	private AdminService adminService;

	public static String getToken(HttpServletRequest request) {
		String tokenBearer = request.getHeader("Authorization");
		if (StringUtils.hasText(tokenBearer) && tokenBearer.startsWith("Bearer ")) {
			return tokenBearer.substring(7);
		}
		return null;
	}

	public static boolean validateToken(String token) {
		try {
			Jwts.parser().setSigningKey(JWT_FIRMA).parseClaimsJws(token);
			return true;
		} catch (Exception e) {
			throw new AuthenticationCredentialsNotFoundException("JWT ha experido o no es valido");
		}
	}

	public static String getUsernameOfToken(String token) {
		return Jwts.parser().setSigningKey(JWT_FIRMA).parseClaimsJws(token).getBody().getSubject();
	}

	public String generarClaveSegura() {
		SecureRandom secureRandom = new SecureRandom();
		byte[] claveBytes = new byte[24];
		secureRandom.nextBytes(claveBytes);
		return Base64.getUrlEncoder().withoutPadding().encodeToString(claveBytes);
	}

	public static String generateToken(Authentication authentication) {
		String username = authentication.getName();
		Date fechaActual = new Date();
		Date fechaExpiracion = new Date(fechaActual.getTime() + EXTENCION_TOKEN);
		String rol = authentication.getAuthorities().iterator().next().getAuthority();

		String token = Jwts.builder()
				.setSubject(username)
				.setIssuedAt(fechaActual)
				.setExpiration(fechaExpiracion)
				.claim("rol", rol)
				.signWith(SignatureAlgorithm.HS512, JWT_FIRMA).compact();
		return token;
	}

	public <T> T userLogin() {
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		T res = null;

		if (StringUtils.hasText(username)) {
			Optional<Actor> actorO = actorService.findByUsername(username);
			if (actorO.isPresent()) {
				Actor actor = actorO.get();
				switch (actor.getRol()) {
					case USER:
						Optional<Usuario> usuarioOptional = usuarioService.findByUsername(username);
						if (usuarioOptional.isPresent()) {
							res = (T) usuarioOptional.get();
						}
						break;
					case ADMIN:
						Optional<Admin> adminOptional = adminService.findByUsername(username);
						if (adminOptional.isPresent()) {
							res = (T) adminOptional.get();
						}
						break;
				}
			}
		}
		return res;
	}

}
