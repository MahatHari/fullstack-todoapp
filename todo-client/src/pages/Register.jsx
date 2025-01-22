import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { loginSuccess } from "../features/auth/authSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const [submitError, setSubmitError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Validate password whenever either password or confirmPassword changes
  useEffect(() => {
    validatePasswords(formData.password, formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  const validatePasswords = (password, confirmPassword) => {
    const errors = {
      password: "",
      confirmPassword: "",
    };
    if (password.length > 0 && password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    // confirm password validation
    if (confirmPassword.length > 0 && confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
    }
    setValidationErrors(errors);
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsLoading(true);

    // final validation before submit
    const errors = validatePasswords(
      formData.password,
      formData.confirmPassword
    );
    if (errors.password || errors.confirmPassword) {
      return;
    }

    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...registerData } = formData;
      const response = await AuthService.register(registerData);
      dispatch(loginSuccess(response));
      navigate("/dashboard");
    } catch (error) {
      setSubmitError(error.response?.data.error || "Registration failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {" "}
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {submitError && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {submitError}
            </div>
          )}
          <div>
            <input
              name="firstName"
              type="text"
              required
              className=" appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm "
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            ></input>
          </div>

          <div>
            <input
              name="lastName"
              type="text"
              required
              className=" appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm "
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            ></input>
          </div>
          <div>
            <input
              name="email"
              type="email"
              required
              className=" appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm "
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            ></input>
          </div>

          <div>
            <input
              name="password"
              type="password"
              required
              className=" appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm "
              placeholder="Password"
              value={formData.password}
              minLength={6}
              onChange={handleChange}
            ></input>
            {validationErrors.password && (
              <p className="absolute text-xs text-red-500 mt-1">
                {validationErrors.password}
              </p>
            )}
          </div>
          <div>
            <input
              name="confirmPassword"
              type="password"
              required
              className=" appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm "
              placeholder="confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            ></input>
            {validationErrors.confirmPassword && (
              <p className="absolute text-xs text-red-500 mt-1">
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={
                isLoading ||
                validationErrors.password ||
                validatePasswords.confirmPassword
              }
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
