import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireAuth({ allowedRoles }) {
    const { isLoggedIn, role } = useSelector((state) => state.auth);
    // const location = useLocation();

    return isLoggedIn && allowedRoles.find((myRole) => myRole == role) ? (
        <Outlet />  // given by react-dom here it will help to access thr children comnents inside RequireAuth if present after authentication
    ) : isLoggedIn ? (<Navigate to="/denied" />) : (<Navigate to="/login" />)

}

export default RequireAuth;