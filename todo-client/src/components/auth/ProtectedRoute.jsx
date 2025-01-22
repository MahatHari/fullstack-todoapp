import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsUserAuthenticated } from "../../features/auth/authSlice";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsUserAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    //Redirect to Login Page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};
export default ProtectedRoute;
