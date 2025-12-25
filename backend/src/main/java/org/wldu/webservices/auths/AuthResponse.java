package org.wldu.webservices.auths;

public class AuthResponse {
    private String token;

    public AuthResponse() {}  // Default constructor

    public AuthResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
}
