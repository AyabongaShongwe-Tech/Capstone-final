import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { loginRequest } from "../../utils/api";
import "./Login.css";

// Airbnb logo mark (reused, brand-colored on the light login screen)
function LogoMark() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
      <path d="M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.152-1.056 2.121-1.056.97 0 1.644.345 2.12 1.055.472.625.575 1.435.292 2.464-.278 1.335-1.072 2.82-2.412 4.46zm9.601 1.503c-.244 1.487-1.256 2.694-2.607 3.278-2.657 1.163-5.281-.68-7.52-3.174-2.32 2.611-4.99 4.264-7.522 3.171-1.349-.582-2.36-1.79-2.606-3.275-.13-.816-.057-1.66.216-2.58l-.001-.005c.078-.264.213-.63.386-1.075l.014-.036c.912-2.318 2.492-5.947 4.734-9.867l.058-.104.058-.1c.756-1.322 1.32-2.325 1.755-3.026.505-.813 1.096-1.478 2.116-1.478 1.02 0 1.612.665 2.117 1.478.435.701.999 1.704 1.755 3.026l.058.1.058.104c2.242 3.92 3.822 7.549 4.734 9.867l.014.036c.173.445.308.811.386 1.075l-.001.005c.273.92.346 1.764.216 2.58zm-1.017-1.955c-.077-.26-.216-.634-.4-1.107-.877-2.226-2.416-5.746-4.582-9.539l-.05-.089-.05-.089c-.752-1.315-1.303-2.297-1.716-2.963-.462-.744-.717-.957-1.171-.957-.454 0-.71.213-1.171.957-.413.666-.964 1.648-1.716 2.963l-.05.089-.05.089c-2.166 3.793-3.705 7.313-4.582 9.539-.184.473-.323.847-.4 1.107l-.005.017c-.207.7-.264 1.334-.166 1.944.163.99.838 1.796 1.741 2.184 1.667.716 3.72-.635 5.67-2.859l.216-.247.008-.01c-1.593-1.945-2.54-3.716-2.856-5.242l-.006-.028c-.379-1.483-.218-2.75.508-3.844.727-1.094 1.867-1.641 3.269-1.641s2.542.547 3.269 1.641c.726 1.094.887 2.361.508 3.844l-.006.028c-.316 1.526-1.263 3.297-2.856 5.242l.008.01.216.247c1.95 2.224 4.003 3.575 5.67 2.859.903-.388 1.578-1.195 1.741-2.184.098-.61.041-1.244-.166-1.944z" />
    </svg>
  );
}

// Pure validation so it is easy to reason about / unit test.
function validate({ username, password }) {
  const errors = {};
  if (!username.trim()) errors.username = "Username is required";
  else if (username.trim().length < 3)
    errors.username = "Username must be at least 3 characters";

  if (!password) errors.password = "Password is required";
  else if (password.length < 6)
    errors.password = "Password must be at least 6 characters";

  return errors;
}

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Where to send a regular user after login (page they were bounced from).
  const from = location.state?.from?.pathname;

  function handleChange(e) {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);
    // Re-validate the touched field live so errors clear as the user fixes them.
    if (touched[name]) setErrors(validate(next));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(values));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched({ username: true, password: true });
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const { token, user } = await loginRequest(values);
      login({ token, user });
      toast.success(`Welcome back, ${user.username}!`);

      // Hosts go to the admin dashboard; regular users go back where they were
      // (or home). Both flows share this one login screen.
      if (user.role === "host") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from && from !== "/login" ? from : "/", { replace: true });
      }
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
      setErrors((prev) => ({ ...prev, form: err.message }));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login">
      <div className="login__card">
        <Link to="/" className="login__logo" aria-label="Airbnb home">
          <LogoMark />
          <span className="login__logo-text">airbnb</span>
        </Link>

        <h1 className="login__title">Login</h1>

        <form className="login__form" onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="field">
            <label htmlFor="username" className="field__label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className={`field__input${
                touched.username && errors.username ? " field__input--error" : ""
              }`}
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(touched.username && errors.username)}
              aria-describedby={errors.username ? "username-error" : undefined}
            />
            {touched.username && errors.username && (
              <p id="username-error" className="field__error">
                {errors.username}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="field">
            <label htmlFor="password" className="field__label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={`field__input${
                touched.password && errors.password ? " field__input--error" : ""
              }`}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(touched.password && errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {touched.password && errors.password && (
              <p id="password-error" className="field__error">
                {errors.password}
              </p>
            )}
          </div>

          <a href="#" className="login__forgot">
            Forgot Password ?
          </a>

          <button type="submit" className="btn btn--primary login__submit" disabled={submitting}>
            {submitting ? "Logging in…" : "Login"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;
