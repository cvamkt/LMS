import './App.css'
import { Route, Routes } from 'react-router-dom'
// import Footer from './Components/footer'
// import HomeLayout from './Layout/HomeLayout'
import HomePage from './pages/HomePage'
import AboutUS from './pages/aboutUs'
import NotFound from './pages/NotFound'
import Signup from './pages/SignUp'
import Login from './pages/Login'
import CourseList from './pages/Courses/CourseList'
import Contact from './pages/Contact'
import Denied from './pages/Denied'
import CourseDescription from './pages/Courses/CourseDecription'
import RequireAuth from './Components/Auth/RequireAuth'
import CreateCourse from './pages/Courses/CreateCourse'
import Profile from './pages/User/Profile'
import EditProfile from './pages/User/EditProfile'
import ChangePassword from './pages/User/ChangePassword'
import Checkout from './pages/Payment/Checkout'
import CheckoutSuccess from './pages/Payment/CheckoutSuccess'
import CheckoutFailure from './pages/Payment/CheckoutFailure'
import Displaylectures from './pages/Dashboard/DisplayLectures'
import Addlecture from './pages/Dashboard/Addlecture'
import AdminDashboard from './pages/Dashboard/AdminDashboard'
import ForgotPassword from './pages/User/ForgotPassword'
import ResetPassword from './pages/User/ResetPassword'
import PurchasedCourses from './pages/Courses/purchaseCourse'

// import DisplayLectures from './pages/Dashboard/DisplayLectures'
// import { API_BASE_URL } from './apiConfig'

function App() {
  // console.log('API_BASE_URL:', API_BASE_URL);

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/about' element={<AboutUS />}></Route>
        <Route path='/*' element={<NotFound />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/forgotPassword' element={<ForgotPassword />}></Route>
        <Route path='/reset-password/:resetToken' element={<ResetPassword />}></Route>
        <Route path='/courses' element={<CourseList />}></Route>
        <Route path='/purchasedCourses' element={<PurchasedCourses />}></Route>
        <Route path='/course/description/:courseId' element={<CourseDescription />}></Route>
        <Route path='/contact' element={<Contact />}></Route>
        <Route path='/denied' element={<Denied />}></Route>

// accessible by ADMIN
        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/course/create" element={<CreateCourse />}></Route>
          <Route path="/course/addlecture" element={<Addlecture />}></Route>
          <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
        </Route>



        <Route element={<RequireAuth allowedRoles={["ADMIN", "USER"]} />}>
          <Route path='/user/profile' element={<Profile />}></Route>
          <Route path='/user/editprofile' element={<EditProfile />}></Route>
          <Route path='/user/changePassword' element={<ChangePassword />}></Route>
          <Route path='/checkout/:courseId' element={<Checkout />}></Route>
          <Route path='/checkout/success' element={<CheckoutSuccess />}></Route>
          <Route path='/checkout/failed' element={<CheckoutFailure />}></Route>
          <Route path='/course/displaylectures' element={<Displaylectures />}></Route>
        </Route>


      </Routes>


    </>

  )
}

export default App
