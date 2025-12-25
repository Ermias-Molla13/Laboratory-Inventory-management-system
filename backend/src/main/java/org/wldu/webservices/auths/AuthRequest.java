package org.wldu.webservices.auths;

public class AuthRequest {
    private String username;
    private String password;

    // Default constructor required by Spring
    public AuthRequest() {}

    // Getter and setter for username
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    // Getter and setter for password
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
