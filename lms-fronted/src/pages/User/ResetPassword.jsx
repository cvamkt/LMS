import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { resetPassword} from '../../Redux/Slices/AuthSlice';
import HomeLayout from '../../Layout/HomeLayout';

function ResetPassword() {
  const { resetToken } = useParams(); // Extract token from the URL
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password) {
      toast.error('Please enter a new password');
      return;
    }

    // Dispatch the reset password action
    dispatch(resetPassword({ resetToken, password }))
      .unwrap()
      .then(() => {
        toast.success('Password reset successfully');
        navigate('/login'); // Redirect to login page
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      });
  };

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-screen">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col p-6 shadow-[0_0_10px_black] rounded-lg w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter new password"
              value={password}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Reset Password
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default ResetPassword;