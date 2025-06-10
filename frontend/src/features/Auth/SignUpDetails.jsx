import { useState } from "react"
import Button from "../../component/Button"
import InputField from "../../component/InputField"
import PasswordField from "../../component/PasswordField"
import styles from "./SignupDetails.module.css"
import { apiSignup } from "../../services/apiAuth"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function SignUpDetails() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset, 
  } = useForm()

  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const signup = async (data) => {
    setError("")
    setIsSubmitting(true)

    if (data.password !== data.confirmpassword) {
      setError("Passwords do not match.")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await apiSignup({
        name: `${data.firstname} ${data.lastname}`,
        email: data.email,
        password: data.password,
        confirmpassword: data.confirmpassword,
      })

      console.log("Signup successful!", response.data)
      toast.success("Signup successful!")
      
      if (response.data.accessToken && response.data.user) {
        localStorage.setItem("userAccessToken", response.data.accessToken)
        localStorage.setItem("userRefreshToken", response.data.refreshToken)
        localStorage.setItem("userId", response.data.user._id)

        console.log("Stored User Auth Data:", {
          userId: localStorage.getItem("userId"),
          token: localStorage.getItem("userAccessToken")?.slice(0, 10) + "...",
        })
      }

      setTimeout(() => {
        navigate("/")
      }, 1000)

      reset({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmpassword: "",
      })
    } catch (error) {
      console.error("Signup failed", error)
      const errorMessage = error.response?.data?.message || "Something went wrong during signup."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={styles.mainWrapper}>
      <h1 className={styles.logo}>BMAP</h1>

      <div className={styles.signupWrapper}>
        <div className={styles.signupimgWrapper}>
          <img className={styles.signupimg} src="/LoginImage.jpg" alt="SignupImage" />
        </div>

        <div className={styles.signupContainer}>
          <h1>Get started with BMAP</h1>
          <p>Where business meets opportunity</p>

          <form onSubmit={handleSubmit(signup)} className={styles.formContainer}>
            <div className={styles.namesContainer}>
              <div className={styles.inputfield}>
                <label htmlFor="firstName">
                  First Name<span className={styles.requiredAsterisk}>*</span>
                </label>
                <InputField
                  {...register("firstname", {
                    required: "First name is required",
                    minLength: {
                      value: 3,
                      message: "Min 3 characters*",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "First name should only contain letters",
                    },
                  })}
                  layout="sm"
                  id="firstName"
                  placeholder="Enter your first name"
                />
                <span className={styles.error}>{errors?.firstname?.message}</span>
              </div>

              <div className={styles.inputfield}>
                <label htmlFor="lastName">
                  Last Name<span className={styles.requiredAsterisk}>*</span>
                </label>
                <InputField
                  {...register("lastname", {
                    required: "Last name is required",
                    minLength: {
                      value: 3,
                      message: "Min 3 characters*",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "Last name should only contain letters",
                    },
                  })}
                  layout="sm"
                  id="lastName"
                  placeholder="Enter your last name"
                />
                <span className={styles.error}>{errors?.lastname?.message}</span>
              </div>
            </div>

            <div className={styles.inputfield}>
              <label htmlFor="email">
                E-mail<span className={styles.requiredAsterisk}>*</span>
              </label>
              <InputField
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                    message: "Invalid email format",
                  },
                })}
                layout="fw"
                id="email"
                placeholder="Enter your e-mail"
              />
              <span className={styles.error}>{errors?.email?.message}</span>
            </div>

            <div className={styles.inputfield}>
              <label htmlFor="password">
                Password<span className={styles.requiredAsterisk}>*</span>
              </label>
              <PasswordField
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                layout="fw"
                id="password"
                placeholder="Enter your password"
              />
              <span className={styles.error}>{errors?.password?.message}</span>
            </div>

            <div className={styles.inputfield}>
              <label htmlFor="confirmPassword">
                Confirm Password<span className={styles.requiredAsterisk}>*</span>
              </label>
              <PasswordField
                {...register("confirmpassword", {
                  required: "Confirm password is required",
                  validate: (value) => value === getValues("password") || "Passwords do not match",
                })}
                layout="fw"
                id="confirmPassword"
                placeholder="Confirm your password"
              />
              <span className={styles.error}>{errors?.confirmpassword?.message}</span>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <Button type="submit" layout="fw" disabled={isSubmitting}>
              {isSubmitting ? "Signing up..." : "Sign up"}
            </Button>
          </form>

          <p>
            Already have an account?{" "}
            <a className={styles.signInLink} href="/login">
              Log In
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}