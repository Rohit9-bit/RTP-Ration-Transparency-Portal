import { useCallback } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { useNavigate } from "react-router";

// const navigate = useNavigate();

// function handleLogout() {
//   confirm("Are you sure you want to logout?") &&
//     axiosInstance
//       .post("/beneficiary/logout", { withCredentials: true })
//       .then(() => {
//         navigate("/beneficiary/login");
//       })
//       .catch(() => {
//         alert("Logout failed. Please try again.");
//       });
// }

// export { handleLogout };

function useLogoutHook() {
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    confirm("Are you sure you want to logout?") &&
      (await axiosInstance
        .post("/beneficiary/logout", { withCredentials: true })
        .then(() => {
          navigate("/beneficiary/login");
        })
        .catch(() => {
          alert("Logout failed. Please try again.");
        }));
  });

  return handleLogout;
}

export default useLogoutHook;
