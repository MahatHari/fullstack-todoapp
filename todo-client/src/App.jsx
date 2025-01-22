import { useSelector } from "react-redux";
import { selectIsUserAuthenticated } from "./features/auth/authSlice";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const Dashboard = () => {
  console.log("from dashboard");
  return (
    <div className="w-full justify-center flex">
      <h2>THis is dashboard</h2>
    </div>
  );
};

function App() {
  const isAuthenticated = useSelector(selectIsUserAuthenticated);

  return (
    <>
      <Router>
        <Routes>
          {/** Public Routes */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
            }
          />

          {/** Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/** Redirect root to dashboard or login based on auth status */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
