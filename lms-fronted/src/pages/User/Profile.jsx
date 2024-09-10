import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../Redux/Slices/AuthSlice";
import HomeLayout from "../../Layout/HomeLayout";
import { Link, useNavigate } from "react-router-dom";
import { cancelCourseBundle } from "../../Redux/Slices/RazorpaySlice";
import toast from "react-hot-toast";

function Profile() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userData = useSelector((state) => state?.auth?.data);
    const length = useSelector((state)=>state?.course?.subscribedCourses?.length)

    useEffect(() => {
        dispatch(getUserData());
    }, [dispatch]);

    // async function handleCancellation() {
    //     toast("Initiating cancelation");
    //     await dispatch(cancelCourseBundle());
    //     await dispatch(getUserData());
    //     toast.success("cancelation completed");
    //     navigate("/");
    // }
    return (
        <HomeLayout>
            <div className="min-h-[90vh] flex items-center justify-center">
                <div className="mt-10 flex flex-col gap-4 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
                    <img
                        src={userData?.avatar?.secure_url}
                        className="w-40 m-auto rounded-full border-black"
                    />
                    <h3 className="text-xl text-center font-semibold capitalize">
                        {userData?.fullName}
                    </h3>
                    <div className="grid grid-cols-2">
                        <p>Email: </p><p>{userData?.email}</p>

                        <p>Role: </p><p>{userData?.role}</p>

                        <p>Subscriptions: </p><p>{length}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <Link
                            to="/user/changePassword"
                            className="w-1/2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm font-semibold py-2 cursor-pointer text-center">
                            <button>Change password</button>

                        </Link>
                        <Link
                            to="/user/editprofile"
                            className="w-1/2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm font-semibold py-2 cursor-pointer text-center">
                            <button>Edit profile</button>

                        </Link>
                    </div>
                    {/* {userData?.subscription?.status === "active" && (
                        <button onClick={handleCancellation} className="w-full bg-red-600 hover:bg-red-500 transition-all ease-in-out duration-300 rounded-sm font-semibold py-2 cursor-pointer text-center">
                            Cancel Subscription
                        </button>
                    )
                    } */}

                </div>
            </div>
        </HomeLayout>
    );
}

export default Profile;