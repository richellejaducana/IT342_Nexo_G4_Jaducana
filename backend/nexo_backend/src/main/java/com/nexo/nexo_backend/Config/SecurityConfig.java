package com.nexo.nexo_backend.Config;

import com.nexo.nexo_backend.Service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import java.util.List;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Spring Security configuration for the application.
 * 
 * Configures:
 * - CSRF protection disabled (stateless API)
 * - Stateless session management
 * - JWT authentication via custom filter
 * - OAuth2 login with Google
 * - Role-based access control (ROLE_USER, ROLE_ADMIN)
 * - CORS for frontend communication
 */
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

        private final CustomOAuth2UserService customOAuth2UserService;
        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

            http
                    .csrf(csrf -> csrf.disable())
                    .sessionManagement(session -> session.sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS))
                    .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                    // Add JWT filter before username/password authentication filter
                    .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                    // Configure authorization rules
                    .authorizeHttpRequests(auth -> auth
                            // Public endpoints - no authentication required
                            .requestMatchers(
                                    "/api/auth/**",
                                    "/oauth2/**",
                                    "/login/**"
                            )
                            .permitAll()
                            
                            // Public event and registration endpoints
                            .requestMatchers(HttpMethod.GET, "/api/events/**", "/api/registrations/**")
                            .permitAll()
                            
                            // Admin endpoints - only ROLE_ADMIN
                            .requestMatchers("/api/admin/**")
                            .hasRole("ADMIN")
                            
                            // User endpoints - any authenticated user with ROLE_USER
                            .requestMatchers("/api/user/**")
                            .hasRole("USER")
                            
                            // All other requests require authentication
                            .anyRequest()
                            .authenticated()
                    )

                    // OAuth2 login configuration
                    .oauth2Login(oauth -> oauth
                            .userInfoEndpoint(user -> user
                                    .userService(customOAuth2UserService)
                            )
                            .successHandler((request, response, authentication) -> {
                                System.out.println("✅ GOOGLE LOGIN SUCCESS");

                                OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

                                String email = oauthUser.getAttribute("email");
                                String name = oauthUser.getAttribute("name");

                                if (name == null) name = "User";

                                String firstName = name.split(" ")[0];
                                String lastName = name.contains(" ") ? name.split(" ")[1] : "";

                                String redirectUrl = "http://localhost:5173/oauth-success"
                                        + "?firstname=" + firstName
                                        + "&lastname=" + lastName
                                        + "&email=" + email
                                        + "&role=ROLE_USER";

                                response.sendRedirect(redirectUrl);
                            })
                    )
                    
                    // Handle authentication errors
                    .exceptionHandling(exceptions -> exceptions
                            .authenticationEntryPoint((request, response, authException) -> {
                                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                response.setContentType("application/json");
                                response.getWriter().write("{\"error\": \"Unauthorized - Invalid or missing token\"}");
                            })
                            .accessDeniedHandler((request, response, accessDeniedException) -> {
                                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                                response.setContentType("application/json");
                                response.getWriter().write("{\"error\": \"Forbidden - Insufficient permissions\"}");
                            })
                    );

            return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();

    config.setAllowedOrigins(List.of("http://localhost:5173"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);

    return source;
}

}