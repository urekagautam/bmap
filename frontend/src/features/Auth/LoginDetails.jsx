import Button from "../../component/Button";
import InputField from "../../component/InputField";
import PasswordField from "../../component/PasswordField";
import styles from "./LoginDetails.module.css";

export default function LoginDetails() {
  return (
    <section className={styles.mainWrapper}>
      <h1 className={styles.logo}>BMAP</h1>

      <div className={styles.loginWrapper}>

      <div className={styles.loginimgWrapper}>
        <img className={styles.loginimg} src="/LoginImage.jpg" alt="LoginImage" />
        </div>

        <div className={styles.loginContainer}>
          <h1>Log in</h1>
          <p>Where business meets opportunity</p>
          <form className={styles.formContainer}>
            <div className={styles.inputfield}>
              <label htmlFor="email">
                E-mail<span className={styles.requiredAsterisk}>*</span>
              </label>
              <InputField
              onChange={handleChange}
                layout="fw"
                id="email"
                placeholder="Enter your e-mail"
              />
            </div>

            <div className={styles.inputfield}>
              <label htmlFor="password">
                Password<span className={styles.requiredAsterisk}>*</span>
              </label>
              <PasswordField
               onChange={handleChange}
                layout="fw"
                id="password"
                placeholder="Enter your password"
              />
            </div>

            <Button layout="fw">Log in</Button>
          </form>
          <p>
            New Here?{" "}
            <a className={styles.signUpLink} href="/signup">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
