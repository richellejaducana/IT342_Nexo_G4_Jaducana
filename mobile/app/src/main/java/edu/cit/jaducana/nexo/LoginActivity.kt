package edu.cit.jaducana.nexo

import android.content.Intent
import android.os.Bundle
import android.view.MotionEvent
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class LoginActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        val joinText = findViewById<TextView>(R.id.text_join_nexus)
        val password = findViewById<EditText>(R.id.password)
        val email = findViewById<EditText>(R.id.email)
        val loginBtn = findViewById<Button>(R.id.button_login)
        var isPasswordVisible = false


        joinText.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
        }
        loginBtn.setOnClickListener {

            val inputEmail = email.text.toString().trim()
            val inputPassword = password.text.toString().trim()

            if (inputEmail.isEmpty() || inputPassword.isEmpty()) {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val request = LoginRequest(inputEmail, inputPassword)

            RetrofitClient.api.login(request)
                .enqueue(object : retrofit2.Callback<UserInfoResponse> {

                    override fun onResponse(
                        call: retrofit2.Call<UserInfoResponse>,
                        response: retrofit2.Response<UserInfoResponse>
                    ) {

                        if (response.isSuccessful) {

                            val user = response.body()

                            Toast.makeText(this@LoginActivity, "Login Success", Toast.LENGTH_SHORT).show()

                            val intent = Intent(this@LoginActivity, UserDashboardActivity::class.java)

                            // optional: pass user data
                            intent.putExtra("firstname", user?.firstname)
                            intent.putExtra("email", user?.email)

                            startActivity(intent)
                            finish()

                        } else {
                            Toast.makeText(
                                this@LoginActivity,
                                "Invalid email or password",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    }

                    override fun onFailure(call: retrofit2.Call<UserInfoResponse>, t: Throwable) {
                        Toast.makeText(
                            this@LoginActivity,
                            "Error: ${t.message}",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                })
        }

        // 🔥 PASSWORD TOGGLE (LOGIN)
        password.setOnTouchListener { _, event ->
            if (event.action == MotionEvent.ACTION_UP) {

                val drawableEnd = 2

                password.compoundDrawables[drawableEnd]?.let { drawable ->

                    val touchAreaStart = password.right - drawable.bounds.width()

                    if (event.rawX >= touchAreaStart) {

                        isPasswordVisible = !isPasswordVisible

                        if (isPasswordVisible) {
                            password.inputType =
                                android.text.InputType.TYPE_CLASS_TEXT or
                                        android.text.InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD

                            password.setCompoundDrawablesWithIntrinsicBounds(
                                0, 0, R.drawable.eye_open, 0
                            )
                        } else {
                            password.inputType =
                                android.text.InputType.TYPE_CLASS_TEXT or
                                        android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD

                            password.setCompoundDrawablesWithIntrinsicBounds(
                                0, 0, R.drawable.eye_close, 0
                            )
                        }

                        password.setSelection(password.text.length)
                        return@setOnTouchListener true
                    }
                }
            }
            false
        }
    }
}