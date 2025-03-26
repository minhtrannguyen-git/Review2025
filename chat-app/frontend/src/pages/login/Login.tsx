import { AlertCircle, Eye, EyeClosed, MessageSquare, UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Thumbnails from '@/components/Thumbnails';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData } from '@/types/authForm.type';
import { LoginAuthFormField } from '@/components/AuthFormFields';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loginUser } from '@/redux/slices/authSlice';

const loginSchema: ZodType<LoginFormData> = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data:LoginFormData) => {
    await dispatch(loginUser(data))
  }


  useEffect(() => {
    if (user) navigate("/"); // Redirect if logged in
  }, [user, navigate]);

  return (
    <div className="w-full flex flex-col-reverse lg:flex-row text-gray-300 min-h-screen">
      {/* Form */}
      <div className="flex-1 flex flex-col items-center p-12 pt-40">
        <div className='p-2 bg-indigo-900 rounded-md text-indigo-300'>
          <MessageSquare />
        </div>
        <p className='text-2xl font-bold my-4'>Welcome Back</p>
        <p className='text-gray-500'>Sign in to your account</p>

        <form className='w-full px-20' onSubmit={handleSubmit(onSubmit)}>
          <label className='ms-2 block mt-10'>Email</label>
          <div className='w-full border border-gray-600 flex p-3 rounded-md items-center mt-1.5'>
            <UserIcon className='text-gray-700 size-[20px] me-3' />
            <LoginAuthFormField type='email' placeholder='User@email.com' name='email' className="flex-1 outline-none border-none bg-transparent text-gray-300" register={register} error={errors.email} />
          </div>
          {errors.email && <ErrorMessage message={errors.email.message} />}

          <label className='ms-2 block mt-10'>Password</label>
          <div className='w-full border border-gray-600 flex p-3 rounded-md items-center mt-1.5'>
            <UserIcon className='text-gray-700 size-[20px] me-3' />
            <LoginAuthFormField type={showPassword ? 'text' : 'password'} placeholder='Your password' name='password' className="flex-1 outline-none border-none bg-transparent text-gray-300" register={register} error={errors.password} />
            {showPassword ? <EyeClosed className='text-gray-400 size-[20px] me-3 cursor-pointer' onClick={() => setShowPassword(false)} /> : <Eye className='text-gray-400 size-[20px] me-3 cursor-pointer' onClick={() => setShowPassword(true)} />}
          </div>
          {errors.password && <ErrorMessage message={errors.password.message} />}

          {error && <ErrorMessage message={error} />}
          <button type='submit' disabled={loading} className={`w-full ${loading ? 'bg-gray-500' : 'bg-indigo-500 hover:bg-indigo-600'} text-white rounded-md text-center py-3 font-bold mt-6 transition-colors duration-200 ease-in cursor-pointer`}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className='mt-8'>
          <span className='text-gray-500'>Don't have an account? </span>
          <Link to={'/signup'} className='text-indigo-500 underline'>Sign up</Link>
        </p>
      </div>

      {/* Thumbnail */}
      <div className='flex-1 lg:w-1/2 w-full'>
        <Thumbnails />
      </div>
    </div>
  );
}

// Error Message Component
function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center text-red-500 text-sm mt-1">
      <AlertCircle className="size-[16px] me-2" />
      {message}
    </p>
  );
}
