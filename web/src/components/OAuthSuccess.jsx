import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
     console.log("OAuthSuccess loaded"); 
    const params = new URLSearchParams(window.location.search);
    console.log("QUERY:", params.toString()); 

    const user = {
      firstname: params.get("firstname"),
      lastname: params.get("lastname"),
      email: params.get("email"),
      role: params.get("role"),
    };
    console.log("USER:", user); 
    localStorage.setItem("user", JSON.stringify(user));

setTimeout(() => {
  navigate("/userDashboard", { replace: true });
}, 200);
  }, []);

  return <p>Logging you in...</p>;
}