package com.nexo.nexo_backend.Config;

import com.nexo.nexo_backend.Service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

        private final CustomOAuth2UserService customOAuth2UserService;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

            http
                    .csrf(csrf -> csrf.disable())
                    .cors(cors -> {}) // ✅ ADD THIS LINE

                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(
                                                                "/api/auth/**",
                                                                "/oauth2/**",
                                                                "/login/**")
                                                .permitAll()
                                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                                .anyRequest().authenticated())

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
                        );

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
}