import { Profile } from "@/pages/profile/Profile";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Signup from "../pages/signup/Signup";

export interface IRoute {
    pathname: string,
    page: React.JSX.Element,
    private: boolean
}

export const AllRoutes: IRoute[] = [
    {
        pathname: '/',
        page: <Home />,
        private: true
    },
    {
        pathname:'/login',
        page: <Login />,
        private:false
    },
    {
        pathname:'/signup',
        page: <Signup />,
        private:false
    },
    {
        pathname:'/profile',
        page: <Profile />,
        private:true
    },
]