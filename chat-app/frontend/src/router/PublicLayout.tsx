import Login from "@/pages/login/Login";
import Signup from "@/pages/signup/Signup";
import { useAppSelector } from "@/redux/hooks";
import { Loader } from "lucide-react";
import * as React from "react";
import { ReactNode, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function PublicLayout({ children }: { children: ReactNode }) {
  const { isCheckAuth, loading, isFinishedCheckingAuth } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {

    if (
      React.isValidElement(children) &&
      (children.type === Login || children.type === Signup)
    ) {
      console.log("Loading:", loading, "Run authCheck:", isFinishedCheckingAuth, "Cookie is valid:", isCheckAuth);
      if (!loading && isFinishedCheckingAuth && isCheckAuth) {
        toast.error("You should log out before signing up or logging in with a new account.");
        navigate("/");
      }
    }
  }, [isFinishedCheckingAuth]);

  return loading || !isFinishedCheckingAuth ? (
    <div className="h-screen flex justify-center items-center">
      <Loader className="animate-spin" />
    </div>
  ) : (
    <div>{children}</div>
  );
}
