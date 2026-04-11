package edu.cit.jaducana.nexo

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import android.view.MotionEvent
class RegisterActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        val firstname = findViewById<EditText>(R.id.firstname)
        val lastname = findViewById<EditText>(R.id.lastname)
        val email = findViewById<EditText>(R.id.email)
        val password = findViewById<EditText>(R.id.password)
        val confirmPassword = findViewById<EditText>(R.id.confirmpassword)
        val registerBtn = findViewById<Button>(R.id.button_register)
        val loginText = findViewById<TextView>(R.id.text_login)
        var isPasswordVisible = false
        var isConfirmVisible = false

        password.setOnTouchListener { _, event ->
            if (event.action == android.view.MotionEvent.ACTION_UP) {

                val drawableEnd = 2

                if (event.rawX >= (password.right - password.compoundDrawables[drawableEnd].bounds.width())) {

                    isPasswordVisible = !isPasswordVisible

                    if (isPasswordVisible) {
                        password.inputType =
                            android.text.InputType.TYPE_CLASS_TEXT or android.text.InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD
                        password.setCompoundDrawablesWithIntrinsicBounds(
                            0, 0, R.drawable.eye_open, 0
                        )
                    } else {
                        password.inputType =
                            android.text.InputType.TYPE_CLASS_TEXT or android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD
                        password.setCompoundDrawablesWithIntrinsicBounds(
                            0, 0, R.drawable.eye_close, 0
                        )
                    }

                    password.setSelection(password.text.length)
                    return@setOnTouchListener true
                }
            }
            false
        }

        confirmPassword.setOnTouchListener { _, event ->
            if (event.action == android.view.MotionEvent.ACTION_UP) {

                val drawableEnd = 2

                if (event.rawX >= (confirmPassword.right - confirmPassword.compoundDrawables[drawableEnd].bounds.width())) {

                    isConfirmVisible = !isConfirmVisible

                    if (isConfirmVisible) {
                        confirmPassword.inputType =
                            android.text.InputType.TYPE_CLASS_TEXT or android.text.InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD
                        confirmPassword.setCompoundDrawablesWithIntrinsicBounds(
                            0, 0, R.drawable.eye_open, 0
                        )
                    } else {
                        confirmPassword.inputType =
                            android.text.InputType.TYPE_CLASS_TEXT or android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD
                        confirmPassword.setCompoundDrawablesWithIntrinsicBounds(
                            0, 0, R.drawable.eye_close, 0
                        )
                    }

                    confirmPassword.setSelection(confirmPassword.text.length)
                    return@setOnTouchListener true
                }
            }
            false
        }

        loginText.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }

        // ✅ THIS IS THE IMPORTANT PART
        registerBtn.setOnClickListener {

            val fName = firstname.text.toString().trim()
            val lName = lastname.text.toString().trim()
            val mail = email.text.toString().trim()
            val pass = password.text.toString().trim()
            val confirm = confirmPassword.text.toString().trim()

            // ✅ VALIDATION (STEP 1)
            if (fName.isEmpty() || lName.isEmpty() || mail.isEmpty() || pass.isEmpty()) {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (pass != confirm) {
                Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // ✅ API REQUEST (CONNECT TO BACKEND)
            val request = SignupRequest(
                email = mail,
                firstname = fName,
                lastname = lName,
                password = pass,
                confirmPassword = confirm
            )

            RetrofitClient.api.signup(request)
                .enqueue(object : Callback<ApiResponse> {

                    override fun onResponse(call: Call<ApiResponse>, response: Response<ApiResponse>) {

                        if (response.isSuccessful) {
                            Toast.makeText(
                                this@RegisterActivity,
                                "Success: " + response.body()?.message,
                                Toast.LENGTH_LONG
                            ).show()

                            val intent = Intent(this@RegisterActivity, LoginActivity::class.java)
                            intent.putExtra("email", mail)
                            intent.putExtra("password", pass)
                            startActivity(intent)
                            finish()
                        } else {
                            Toast.makeText(
                                this@RegisterActivity,
                                "Error: " + response.errorBody()?.string(),
                                Toast.LENGTH_LONG
                            ).show()
                        }
                    }

                    override fun onFailure(call: Call<ApiResponse>, t: Throwable) {
                        Toast.makeText(
                            this@RegisterActivity,
                            "Failed: ${t.message}",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                })
        }
    }
}