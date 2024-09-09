import { Button } from '@material-tailwind/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LoginPage() {

    let regexPhoneNumber = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/ 

    const [isError, setIsError] = useState(false)
 

    const handleSubmitRegisterForm = (e) => {
        e.preventDefault()  
 
        let phone_number = e.target.phone_number.value
        let password = e.target.password.value

        if (!regexPhoneNumber.test(phone_number)) {
            setIsError(true)  
        } else {
            setIsError(false)
        }

        // fetch check login
         
        
    }

  return (
    <div className='container mx-auto'>
            <div className='grid lg:grid-cols-2 grid-cols-1 gap-4'>
                <div className='flex flex-col h-screen w-full items-center justify-center'> 
                    <h1 className='text-4xl mb-8 font-semibold text-primary'>Đăng Nhập</h1> 
                    <form method='POST' onSubmit={handleSubmitRegisterForm} className="max-w-lg w-[80%] mx-auto">
                        <label htmlFor="phone-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Số điện thoại</label>
                        <div className="relative mb-6">
                            <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 19 18">
                                    <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z"/>
                                </svg>
                            </div>
                            <input onChange={() => setIsError(false)} name='phone_number' type="text" id="phone-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                pattern={regexPhoneNumber} placeholder="Số điện thoại" required
                            />
                        </div> 

                        <div className="mb-3">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mật khẩu</label>
                            <input name='password' type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nhập mật khẩu" required />
                        </div>  

                        {isError && <div className='mb-3'>
                            <p className='text-red-500'>Số điện thoại hoặc mật khẩu không chính xác</p>
                        </div>}

                        <Button className='w-full mb-6 bg-primary' type='submit'>Đăng Nhập</Button>
                    </form>    

                    <div className='flex'>
                        <p>Bạn chưa có tài khoản?</p>
                        <Link to={'/register'} className='mx-2 text-primary font-semibold'>Đăng ký</Link>
                    </div>
                </div>
                <div className='bg-indigo-300 my-12 rounded-3xl overflow-hidden lg:block hidden'>
                    <img className='object-cover h-full w-full' src='https://media.istockphoto.com/id/1323340232/photo/banh-mi-viet-nam-viet-nam-traditional-sandwiches.jpg?s=612x612&w=0&k=20&c=2ziGdTLcOet9pIlOmawk744cCzgmP8bGVr3kQ9QedSE='></img>
                </div>

            </div>

        </div>
  )
}
