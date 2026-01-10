import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface VerifyInviteDesignProps {
  status: "loading" | "success" | "error";
  message: string;
  onLoginRedirect: () => void;
}

export function VerifyInviteDesign({
  status,
  message,
  onLoginRedirect,
}: VerifyInviteDesignProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "loading" && (
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            )}
            {status === "error" && (
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "Verifying Invitation"}
            {status === "success" && "Account Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading" &&
              "Please wait while we verify your invitation..."}
            {status === "success" &&
              "Your account has been successfully verified"}
            {status === "error" && "Unable to verify your invitation"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 text-sm text-center">
            {message}
          </div>

          {status === "success" && (
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  A temporary password has been sent to your email. Please use
                  it to log in and reset your password.
                </p>
              </div>
              <Button onClick={onLoginRedirect} className="w-full">
                Continue to Login
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                The invitation link may be invalid, expired, or already used.
              </p>
              <Button
                onClick={onLoginRedirect}
                variant="outline"
                className="w-full"
              >
                Go to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
