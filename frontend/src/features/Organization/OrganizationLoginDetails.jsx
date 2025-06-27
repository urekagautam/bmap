import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import Button from "../../component/Button"
import InputField from "../../component/InputField"
import PasswordField from "../../component/PasswordField"
import { apiOrganizationLogin } from "../../services/apiOrganizationAuth"
import useOrgAuth from "../../hooks/useOrgAuth"
import styles from "../Auth/LoginDetails.module.css" 

export default function OrganizationLoginDetails() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { setAuth, isAuthenticated } = useOrgAuth()

  // Redirecting if already authenticated
  /*   if (isAuthenticated) {
    navigate("/org")
    return null
  } */

  const login = async (data) => {
    setError("")
    setIsSubmitting(true)

    try {
      console.log("Attempting organization login with:", { email: data.email })

      const response = await apiOrganizationLogin({
        email: data.email,
        password: data.password,
      })

      console.log("Organization login successful!", response)
      toast.success("Login successful!")

      // Using the hook to set authentication data
      if (response.data.accessToken && response.data.organization) {
        setAuth({
          organization: response.data.organization,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      }

      // Reset form
      reset({
        email: "",
        password: "",
      })

      setTimeout(() => {
        navigate("/org") 
      }, 1000)
    } catch (error) {
      console.error("Organization login failed", error)
      const errorMessage = error.response?.data?.message || "Invalid email or password"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={styles.mainWrapper}>
      <h1 className={styles.logo}>BMAP</h1>

      <div className={styles.loginWrapper}>
        <div className={styles.loginimgWrapper}>
          <img className={styles.loginimg} src="/LoginImage.jpg" alt="LoginImage" />
        </div>

        <div className={styles.loginContainer}>
          <h1>Organization Log In</h1>
          <p>Where business meets opportunity</p>

          <form onSubmit={handleSubmit(login)} className={styles.formContainer}>
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
                placeholder="Enter your organization e-mail"
                autoComplete="email"
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
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                layout="fw"
                id="password"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <span className={styles.error}>{errors?.password?.message}</span>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <Button type="submit" layout="fw" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p>
            Don't have an account?{" "}
            <Link className={styles.signUpLink} to="/org/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
