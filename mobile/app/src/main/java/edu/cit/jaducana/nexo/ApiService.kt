package edu.cit.jaducana.nexo

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

data class SignupRequest(
    val email: String,
    val firstname: String,
    val lastname: String,
    val password: String,
    val confirmPassword: String
)
data class LoginRequest(
    val email: String,
    val password: String
)

data class UserInfoResponse(
    val firstname: String,
    val lastname: String,
    val email: String,
    val role: String
)

data class ApiResponse(val message: String)

interface ApiService {

    @POST("/api/auth/signup")
    fun signup(@Body request: SignupRequest): Call<ApiResponse>
    @POST("/api/auth/login")
    fun login(@Body request: LoginRequest): Call<UserInfoResponse>
}
