import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VerifyInviteDesign } from "./verifyInviteDesign";
import { authService } from "../../services";

export function VerifyInvite() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    try {
      const response = await authService.verifyInviteToken(token);
      setStatus("success");
      setMessage(
        response.message ||
          "Account verified successfully. Kindly login using the temporary password and reset your password."
      );
    } catch (error: any) {
      console.error("Verification error:", error);
      setStatus("error");
      setMessage(error.message || "Failed to verify invitation token");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <VerifyInviteDesign
      status={status}
      message={message}
      onLoginRedirect={handleLoginRedirect}
    />
  );
}
