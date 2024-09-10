import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../Redux/Slices/CourseSlice";
import HomeLayout from "../../Layout/HomeLayout";
// import { elements } from "chart.js";
import CourseCard from "../../Components/CourseCard";
import {getUserData} from "../../Redux/Slices/AuthSlice.js";

function CourseList() {
    const dispatch = useDispatch();

    const { courseData } = useSelector((state) => state.course);
    console.log(courseData);


    async function loadCourses() {
     await dispatch(getAllCourses());
     await dispatch(getUserData());
    }

    useEffect(() => {
        loadCourses();
    }, []);

    return (
        <HomeLayout>
            <div className="min-h[90vh] pt-12 pl-20 flex flex-col gap-10 text-white" >
                <h1 className="text-center text-3xl font-semibold mb-5">
                    Explore the Courses made by <span className="font-bold text-yellow-500">Industry exprerts</span>
                    </h1>
                    <div className="mb-10 flex flex-wrap gap-14 ">
                        {courseData?.map((element) => {
                            return <CourseCard key={element._id} data={element} />
                        })}
                    </div>

            </div>
        </HomeLayout>
    )
}

export default CourseList;