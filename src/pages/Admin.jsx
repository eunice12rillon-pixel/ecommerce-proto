import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminPage from "../pages/AdminPage";

const Admin = ({ role }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") {
      navigate("/"); // Redirect to home if not an admin
    }
  }, [role, navigate]);

  // Render the AdminPage, assuming this component is only used when the user is an admin
  return role === "admin" ? <AdminPage /> : null; // Ensure nothing is rendered if not an admin
};

export default Admin;
