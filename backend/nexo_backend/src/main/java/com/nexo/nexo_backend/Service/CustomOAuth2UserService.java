package com.nexo.nexo_backend.Service;

import com.nexo.nexo_backend.Entity.UserEntity;
import com.nexo.nexo_backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {

        OAuth2User oauthUser = new DefaultOAuth2UserService().loadUser(userRequest);

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        UserEntity user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {

            String firstName = name.split(" ")[0];
            String lastName = name.contains(" ") ? name.split(" ")[1] : "";

            user = UserEntity.builder()
                    .email(email)
                    .firstname(firstName)
                    .lastname(lastName)
                    .password("") // no password for google users
                    .role("ROLE_USER") // 👈 ADD THIS
                    .build();

            userRepository.save(user);
        }

        return new DefaultOAuth2User(
                java.util.Collections.singleton(
                        new SimpleGrantedAuthority(user.getRole())
                ),
                oauthUser.getAttributes(),
                "email"
        );
    }
}