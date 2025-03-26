import { Route, Routes } from "react-router-dom";
import { AllRoutes } from "./routes";
import PrivateLayout from "./PrivateLayout";
import PublicLayout from "./PublicLayout";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useRef } from "react";
import { checkAuthStatus } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";

export const AppRouter = () => {
  const { isCheckAuth, user, loading, isFinishedCheckingAuth } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, []);

  useEffect(() => {
    if (isCheckAuth && isFinishedCheckingAuth && !loading && user?.fullname) {
      toast.success(`Welcome back, ${user.fullname}!`);
    }
  }, [isCheckAuth, loading, user?.fullname]);

  const definedRoutes = AllRoutes.map((route) => (
    <Route
      key={route.pathname}
      path={route.pathname}
      element={
        route.private ? (
          <PrivateLayout>{route.page}</PrivateLayout>
        ) : (
          <PublicLayout>{route.page}</PublicLayout>
        )
      }
    />
  ));

  return <Routes>{definedRoutes}</Routes>;
};
