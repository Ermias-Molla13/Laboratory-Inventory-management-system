package org.wldu.webservices.auths;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequestDto request) {
 if (userRepository.existsByUsername(request.getUsername())) {
throw new RuntimeException("Username already exists");
 }

 User user = new User();
 user.setUsername(request.getUsername()); user.setPassword(passwordEncoder.encode(request.getPassword())); if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
 user.setRole("ROLE_ADMIN");
 } else {
 user.setRole("ROLE_USER");
 }

 return userRepository.save(user);
    }
}


