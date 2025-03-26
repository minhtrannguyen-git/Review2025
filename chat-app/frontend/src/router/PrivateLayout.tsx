import { Navbar } from "@/components/Navbar/Navbar";
import { useAppSelector } from "@/redux/hooks";
import { Loader } from "lucide-react";
import { ReactNode, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const { isCheckAuth, loading, isFinishedCheckingAuth } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isFinishedCheckingAuth && !isCheckAuth) {
      console.log("Loading: ", loading, "Run authCheck:", isFinishedCheckingAuth, "Cookie is valid:", isCheckAuth)
      toast.error("You should log in first.")
      navigate('/login')
    }
  }, [isFinishedCheckingAuth])
  return (loading || !isFinishedCheckingAuth) ? (
    <div className="h-screen flex justify-center items-center">
      <Loader className="animate-spin" />
    </div>
  ) : isCheckAuth ? (
    <div>
      <Navbar />
      {children}
    </div>
  ) : (
    <Navigate to={"/login"} replace={true} />
  );
}
