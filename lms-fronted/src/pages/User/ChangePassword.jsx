import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import HomeLayout from "../../Layout/HomeLayout";
import { changePassword, getUserData } from "../../Redux/Slices/AuthSlice";

function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state?.auth?.data?._id);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();

    const { oldPassword, newPassword } = passwords;

    if (!oldPassword || !newPassword) {
      toast.error("All fields are mandatory");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    try {
      await dispatch(changePassword({ oldPassword, newPassword })).unwrap();
      await dispatch(getUserData());
      navigate("/user/profile");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to change password");
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          onSubmit={onFormSubmit}
          className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-80 min-h-[26rem] shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-semibold">Change Password</h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="oldPassword" className="text-lg font-semibold">
              Old Password
            </label>
            <input
              required
              type="password"
              name="oldPassword"
              id="oldPassword"
              placeholder="Enter old password"
              className="bg-transparent px-2 py-1 border"
              value={passwords.oldPassword}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="newPassword" className="text-lg font-semibold">
              New Password
            </label>
            <input
              required
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="Enter new password"
              className="bg-transparent px-2 py-1 border"
              value={passwords.newPassword}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 text-lg cursor-pointer"
          >
            Change Password
          </button>
          <Link to="/user/profile">
            <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
              <AiOutlineArrowLeft /> Go back to profile
            </p>
          </Link>
        </form>
      </div>
    </HomeLayout>
  );
}

export default ChangePassword;