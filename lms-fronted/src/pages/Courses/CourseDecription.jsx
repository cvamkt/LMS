import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import HomeLayout from "../../Layout/HomeLayout";
import { cancelCourseBundle } from "../../Redux/Slices/RazorpaySlice";
import { getUserData } from "../../Redux/Slices/AuthSlice";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { getRecommendedCourses } from "../../Redux/Slices/CourseSlice";


function CourseDescription() {
    const { state } = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courseId } = useParams(); // Get courseId from URL params
    console.log(courseId);


    const { role, data } = useSelector((state) => state.auth);
    console.log("STATE", state);


    // Find the subscription for the current course
    const currentSubscription = data.subscriptions?.find(sub => sub.course_id === courseId);
    console.log("cureenttttt", currentSubscription)
    //console.log(data)
    const isSubscribed = currentSubscription?.status === 'active';
    console.log("ISSUBSCRIBED", isSubscribed);



    async function handleCancellation(courseId) {
        if (!isSubscribed) {
            return;
        } else {
            toast("Initiating cancelation");
            try {
                await dispatch(cancelCourseBundle(courseId)).unwrap();
                await dispatch(getUserData()).unwrap();
                toast.dismiss();
                toast.success("cancelation completed");
                navigate("/");

            } catch (error) {
                toast.dismiss();
                toast.error("Failed to cancel subscription");
            }
        }
    }
    const { recommendedCourses } = useSelector((state) => state.course);
    useEffect(() => {
        if (state?.category) {
            dispatch(getRecommendedCourses({
                category: state?.category,
                courseId: courseId
            }));
        }
    }, [state?.category, courseId]);

    return (
        <HomeLayout>
            <div className="min-h-[90vh] pt-12 px-20 flex flex-col items-center justify-center text-white">
                <div className="grid grid-cols-2 gap-10 py-10 relative">
                    <div className="space-y-5">
                        <img
                            className="w-full h-64"
                            alt="thumbnail"
                            src={state?.thumbnail?.secure_url}
                        />
                        <div className="space-y-4">
                            <div className="flex flex-col items-center justify-between text-xl">
                                <p className="font-semibold">
                                    <span className="text-yellow-500 font-bold">
                                        Total lectures : {" "}
                                    </span>
                                    {state?.numberOfLectures}
                                </p>
                                <p className="font-semibold">
                                    <span className="text-yellow-500 font-bold">
                                        Instructor : {" "}
                                    </span>
                                    {state?.createdBy}
                                </p>
                            </div>
                            {role === "ADMIN" || isSubscribed ? (
                                <>
                                    <button
                                        onClick={() => navigate("/course/displaylectures", { state: { ...state, courseId: courseId } })}
                                        className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300"
                                    >
                                        Watch lectures
                                    </button>
                                    {isSubscribed && (
                                        <button
                                            onClick={() => handleCancellation(courseId)}
                                            className="bg-red-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-red-500 transition-all ease-in-out duration-300"

                                        >
                                            cancel Subscription
                                        </button>
                                    )}

                                </>
                            ) : (
                                <button
                                    onClick={() => navigate(`/checkout/${courseId}`)}
                                    className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300"
                                >
                                    Subscribe
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2 text-xl">
                        <h1 className="text-3xl font-bold text-yellow-500 mb-5 text-center">
                            {state?.title}
                        </h1>
                        <p className="text-yellow-500">Course description: </p>
                        <p>{state?.description}</p>


                        <div className="mt-10">
                            <h2 className="text-2xl font-bold text-yellow-500 mb-4">
                                Recommended Courses
                            </h2>
                            <div className="grid grid-cols-3 gap-5">
                                {recommendedCourses
                                    ?.filter(course => course._id !== courseId)
                                    .map((course) => (
                                        <div
                                            key={course._id}
                                            className="bg-gray-800 p-4 rounded-lg cursor-pointer"
                                            onClick={() =>
                                                navigate(`/course/description/${course._id}`, {
                                                    state: course
                                                })
                                            }
                                        >
                                            <img
                                                src={course?.thumbnail?.secure_url}
                                                className="h-40 w-full object-cover rounded"
                                            />
                                            <h3 className="mt-2 font-semibold">{course.title}</h3>
                                        </div>
                                    ))}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout >
    );
}

export default CourseDescription;
