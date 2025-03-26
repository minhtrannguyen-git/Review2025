import { AlertCircle, Eye, EyeClosed, Loader, MessageSquare, UserIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Thumbnails from '@/components/Thumbnails'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { SignupFormData } from '@/types/authForm.type'
import { SignupAuthFormField } from '@/components/AuthFormFields'
import { z, ZodType } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { signupUser } from '@/redux/slices/authSlice'

const signupSchema: ZodType<SignupFormData> = z.object({
  fullname: z.string().min(3, "Full name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Signup() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector(state => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>(
    {
      resolver: zodResolver(signupSchema)
    }
  )

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: SignupFormData) => {
    console.log("Sign up data: ", data);
    await dispatch(signupUser(data))
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user, navigate])

  useEffect(() => {
    if (error) console.log("Error when signup: ", error);
  }, [error])

  return (
    <div className="w-full flex flex-col-reverse lg:flex-row text-gray-300 min-h-screen">
      {/* Form */}
      <div className="flex-1 flex flex-col items-center p-12 pt-40">
        <div className='p-2 bg-indigo-900 rounded-md text-indigo-300'>
          <MessageSquare />
        </div>
        <p className='text-2xl font-bold my-4'>Create Account</p>
        <p className='text-gray-500'>Get started with your free account</p>

        <form className='w-full px-20' onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <label className='ms-2 block mt-10'>Full Name</label>
          <div className='w-full border border-gray-600 flex p-3 rounded-md items-center mt-1.5'>
            <UserIcon className='text-gray-700 size-[20px] me-3' />
            <SignupAuthFormField type='text' placeholder='Your full name' name='fullname' className="flex-1 outline-none border-none bg-transparent text-gray-300" register={register} error={errors.fullname} />
          </div>
          {errors.fullname && <ErrorMessage message={errors.fullname.message} />}

          {/* Email */}
          <label className='ms-2 block mt-10'>Email</label>
          <div className='w-full border border-gray-600 flex p-3 rounded-md items-center mt-1.5'>
            <UserIcon className='text-gray-700 size-[20px] me-3' />
            <SignupAuthFormField type='email' placeholder='User@email.com' name='email' className="flex-1 outline-none border-none bg-transparent text-gray-300" register={register} error={errors.email} />
          </div>
          {errors.email && <ErrorMessage message={errors.email.message} />}

          {/* Password */}
          <label className='ms-2 block mt-10'>Password</label>
          <div className='w-full border border-gray-600 flex p-3 rounded-md items-center mt-1.5'>
            <UserIcon className='text-gray-700 size-[20px] me-3' />
            <SignupAuthFormField type={showPassword ? 'text' : 'password'} placeholder='Your new password' name='password' className="flex-1 outline-none border-none bg-transparent text-gray-300" register={register} error={errors.password} />
            {showPassword ? <EyeClosed className='text-gray-400 size-[20px] me-3 cursor-pointer' onClick={() => setShowPassword(false)} /> : <Eye className='text-gray-400 size-[20px] me-3 cursor-pointer' onClick={() => setShowPassword(true)} />}
          </div>
          {errors.password && <ErrorMessage message={errors.password.message} />}

          <button type='submit' disabled={loading} className='w-full bg-indigo-500 text-white rounded-md text-center py-3 font-bold mt-6 transition-colors hover:bg-indigo-600 duration-200 ease-in cursor-pointer disabled:bg-gray-500'>
            {!loading ? "Create Account" : <div className='flex justify-center gap-3'><Loader />Creating your new account...</div>}
          </button>
        </form>

        <p className='mt-8'>
          <span className='text-gray-500'>Already have an account? </span>
          <Link to={'/login'} className='text-indigo-500 underline'>Sign in</Link>
        </p>
      </div>

      {/* Thumbnail */}
      <div className='flex-1 lg:w-1/2 w-full'>
        <Thumbnails />
      </div>
    </div>
  )
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