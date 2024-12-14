import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useCheckAuth = () => {
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!accessToken) {
      navigate("/auth");
    }
  }, [accessToken]);
};

export default useCheckAuth;
