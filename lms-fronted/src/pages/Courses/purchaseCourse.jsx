import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubscribedCourses } from "../../Redux/Slices/CourseSlice";
import HomeLayout from "../../Layout/HomeLayout";
import CourseCard from "../../Components/CourseCard";
import { getUserData } from "../../Redux/Slices/AuthSlice";

function purchasedCourses() {
    const dispatch = useDispatch();
    const { subscribedCourses } = useSelector((state) => state.course); // Ensure 'subscribedCourses' is in your state
    const state = useSelector((state) => state);
    console.log("Redux STATE:", state);
    console.log("SUBSCRIBD", subscribedCourses);
    // console.log("SUBSCRIBD course length", subscribedCourses.length);

    useEffect(() => {
        async function loadCourses() {
            try {
                const data = await dispatch(getSubscribedCourses()).unwrap();
                console.log("Subscribed Courses Data:", data);

                await dispatch(getUserData()).unwrap();
                console.log("User Data Loaded");
            } catch (error) {
                console.error("Error loading courses or user data:", error);
            }
        }

        loadCourses();
    }, [dispatch]);


    return (
        <HomeLayout>
            <div className="min-h-[90vh] pt-12 pl-20 flex flex-col gap-10 text-white">
                {Array.isArray(subscribedCourses) && subscribedCourses.length > 0 ? (
                    <>
                        <h1 className="text-center text-3xl font-semibold mb-5">
                            Explore the Courses made by <span className="font-bold text-yellow-500">Industry experts</span>
                        </h1>
                        <div className="mb-10 flex flex-wrap gap-14">

                            {subscribedCourses.map((course) => (
                                <CourseCard key={course._id} data={course} />


                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex justify-center items-center min-h-[50vh]">
                        <p className="text-xl font-semibold">
                            You haven't purchased any courses yet.
                        </p>
                    </div>

                )}

            </div>
        </HomeLayout>
    );
}

export default purchasedCourses;
