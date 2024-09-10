import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { forgotPassword } from '../../Redux/Slices/AuthSlice';
import HomeLayout from '../../Layout/HomeLayout';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    dispatch(forgotPassword(email))
      .unwrap()
      .then(() => {
        toast.success('Reset password email sent');
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
          <h1 className="text-2xl font-bold mb-4 text-center">Forgot Password</h1>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Send Reset Email
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default ForgotPassword;