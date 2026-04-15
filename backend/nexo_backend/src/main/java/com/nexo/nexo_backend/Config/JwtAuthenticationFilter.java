package com.nexo.nexo_backend.Config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * JWT Authentication Filter that validates tokens from Supabase.
 * Reads the Authorization header, validates the JWT, and sets authentication
 * in the SecurityContext with appropriate roles.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret:your-supabase-jwt-secret}")
    private String jwtSecret;

    @Value("${jwt.enabled:true}")
    private boolean jwtEnabled;

    /**
     * Filters incoming requests to validate JWT tokens.
     * If the token is valid, sets authentication in SecurityContext.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            // Skip JWT validation if disabled
            if (!jwtEnabled) {
                filterChain.doFilter(request, response);
                return;
            }

            // Get Authorization header
            String authHeader = request.getHeader("Authorization");

            // If no Authorization header, proceed without authentication
            if (authHeader == null || authHeader.isEmpty()) {
                filterChain.doFilter(request, response);
                return;
            }

            // Validate Bearer token format
            if (!authHeader.startsWith("Bearer ")) {
                log.warn("Invalid Authorization header format");
                filterChain.doFilter(request, response);
                return;
            }

            // Extract token
            String token = authHeader.substring(7).trim();

            // Validate and parse JWT
            Claims claims = validateAndParseJwt(token);

            if (claims != null) {
                // Extract user information from claims
                String userId = claims.getSubject();
                String email = claims.get("email", String.class);
                
                // Extract roles from claims
                List<SimpleGrantedAuthority> authorities = extractAuthorities(claims);

                // Create authentication token
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userId, null, authorities);

                // Set authentication context
                SecurityContextHolder.getContext().setAuthentication(authentication);

                log.debug("JWT validated for user: {} with roles: {}", userId, authorities);
            }

        } catch (JwtException e) {
            log.error("JWT validation failed: {}", e.getMessage());
        } catch (Exception e) {
            log.error("Error processing JWT: {}", e.getMessage());
        }

        // Continue filter chain
        filterChain.doFilter(request, response);
    }

    /**
     * Validates and parses the JWT token using Supabase secret.
     *
     * @param token The JWT token to validate
     * @return Claims if valid, throws exception if invalid
     */
    private Claims validateAndParseJwt(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

        } catch (io.jsonwebtoken.security.SignatureException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
            throw new JwtException("Invalid signature", e);
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            log.error("JWT token expired: {}", e.getMessage());
            throw new JwtException("Token expired", e);
        } catch (io.jsonwebtoken.MalformedJwtException e) {
            log.error("Malformed JWT: {}", e.getMessage());
            throw new JwtException("Malformed token", e);
        } catch (io.jsonwebtoken.UnsupportedJwtException e) {
            log.error("Unsupported JWT: {}", e.getMessage());
            throw new JwtException("Unsupported token", e);
        } catch (IllegalArgumentException e) {
            log.error("JWT claim string is empty: {}", e.getMessage());
            throw new JwtException("Empty claims", e);
        }
    }

    /**
     * Extract authorities/roles from JWT claims.
     * Looks for 'roles' or 'user_role' in claims, or uses 'ROLE_USER' as default.
     *
     * @param claims The JWT claims
     * @return List of granted authorities
     */
    private List<SimpleGrantedAuthority> extractAuthorities(Claims claims) {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        // Try to get roles from various possible claim names
        Object rolesObj = claims.get("roles");
        if (rolesObj == null) {
            rolesObj = claims.get("user_role");
        }
        if (rolesObj == null) {
            rolesObj = claims.get("role");
        }

        if (rolesObj instanceof List<?>) {
            // Handle list of roles
            ((List<?>) rolesObj).forEach(role -> {
                String roleStr = role.toString().trim();
                if (!roleStr.startsWith("ROLE_")) {
                    roleStr = "ROLE_" + roleStr;
                }
                authorities.add(new SimpleGrantedAuthority(roleStr));
            });
        } else if (rolesObj instanceof String) {
            // Handle single role string
            String roleStr = rolesObj.toString().trim();
            if (!roleStr.startsWith("ROLE_")) {
                roleStr = "ROLE_" + roleStr;
            }
            authorities.add(new SimpleGrantedAuthority(roleStr));
        }

        // Default to ROLE_USER if no roles found
        if (authorities.isEmpty()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }

        return authorities;
    }
}
