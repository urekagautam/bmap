import { useState } from "react";
import styles from "./OrganizationSignupDetails.module.css";
import { apiOrganizationSignup } from "../../services/apiOrganizationAuth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import InputField from "../../component/InputField";
import Button from "../../component/Button";
import PasswordField from "../../component/PasswordField";

export default function SignUpDetails() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const signup = async (data) => {
    setError("");
    setIsSubmitting(true);

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await apiOrganizationSignup({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      console.log("Signup successful!", response.data);
      toast.success("Signup successful!");
      if (response.data.accessToken && response.data.organization) {
        localStorage.setItem("orgAccessToken", response.data.accessToken);
        localStorage.setItem("orgRefreshToken", response.data.refreshToken);
        localStorage.setItem("organizationId", response.data.organization._id);

     /*    console.log("Stored Auth Data:", {
          orgId: localStorage.getItem("organizationId"),
          token: localStorage.getItem("orgAccessToken")?.slice(0, 10) + "...",
        });  PASSSSSSS */
      }

      setTimeout(() => {
        navigate("/orgprofile");
      }, 1000);

      reset({
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Signup failed", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong during signup.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.mainWrapper}>
      <h1 className={styles.logo}>BMAP</h1>

      <div className={styles.signupWrapper}>
        <div className={styles.signupimgWrapper}>
          <img
            className={styles.signupimg}
            src="/LoginImage.jpg"
            alt="SignupImage"
          />
        </div>

        <div className={styles.signupContainer}>
          <h1>Get started with BMAP</h1>
          <p>Where business meets opportunity</p>

          <form
            onSubmit={handleSubmit(signup)}
            className={styles.formContainer}
          >
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
                Confirm Password
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <PasswordField
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === getValues("password") || "Passwords do not match",
                })}
                layout="fw"
                id="confirmPassword"
                placeholder="Confirm your password"
              />
              <span className={styles.error}>
                {errors?.confirmPassword?.message}
              </span>
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
  );
}
