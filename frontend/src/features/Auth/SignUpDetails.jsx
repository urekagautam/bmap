import { useState } from "react";
import Button from "../../component/Button";
import InputField from "../../component/InputField";
import PasswordField from "../../component/PasswordField";
import styles from "./SignupDetails.module.css";

export default function SignUpDetails() {
  const [inputs, setInputs] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({...inputs, [name]: value});
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    console.log("Form submitted:", inputs);
  };

  return (
    <section className={styles.mainWrapper}>
      <h1 className={styles.logo}>BMAP</h1>

      <div className={styles.signupWrapper}>
        <div className={styles.signupimgWrapper}>
          <img
            className={styles.signupimg}
            src="/LoginImage.jpg"
            alt="LoginImage"
          />
        </div>

        <div className={styles.signupContainer}>
          <h1>Get started with BMAP</h1>
          <p>Where business meets opportunity</p>
          <form onSubmit={handleSignUp} className={styles.formContainer}>
            <div className={styles.namesContainer}>
              <div className={styles.inputfield}>
                <label htmlFor="firstName">
                  First Name<span className={styles.requiredAsterisk}>*</span>
                </label>
                <InputField
                  name="firstname"
                  onChange={handleChange}
                  layout="sm"
                  id="firstName"
                  placeholder="Enter your first name"
                  value={inputs.firstname}
                />
              </div>

              <div className={styles.inputfield}>
                <label htmlFor="lastName">
                  Last Name<span className={styles.requiredAsterisk}>*</span>
                </label>
                <InputField
                  name="lastname"
                  onChange={handleChange}
                  layout="sm"
                  id="lastName"
                  placeholder="Enter your last name"
                  value={inputs.lastname}
                />
              </div>
            </div>

            <div className={styles.inputfield}>
              <label htmlFor="email">
                E-mail<span className={styles.requiredAsterisk}>*</span>
              </label>
              <InputField
                name="email"
                onChange={handleChange}
                layout="fw"
                id="email"
                placeholder="Enter your e-mail"
                value={inputs.email}
              />
            </div>

            <div className={styles.inputfield}>
              <label htmlFor="password">
                Password<span className={styles.requiredAsterisk}>*</span>
              </label>
              <PasswordField
                name="password"
                onChange={handleChange}
                layout="fw"
                id="password"
                placeholder="Enter your password"
                value={inputs.password}
              />
            </div>

            <div className={styles.inputfield}>
              <label htmlFor="confirmPassword">
                Confirm Password
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <PasswordField
                name="confirmPassword"
                onChange={handleChange}
                layout="fw"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={inputs.confirmPassword}
              />
            </div>

            <Button type="submit" layout="fw">
              Sign up
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