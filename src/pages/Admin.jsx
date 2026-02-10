import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminPage from "../pages/AdminPage";

const Admin = ({ role }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, [role, navigate]);

  return <AdminPage />;
};

export default Admin;
