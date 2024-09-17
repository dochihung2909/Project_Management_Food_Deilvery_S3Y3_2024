import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input } from "@material-tailwind/react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function User() {
    const { user, update } = useUser();

    const accessToken = Cookies.get('access_token');

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate()

    const [openChangePassword, setOpenChangePassword] = useState(false) 

    const [openSuccessModal, setOpenSuccessModal] = useState(false)
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: ''
    });  
    
    const [formPassword, setFormPassword] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const [userInfoError, setUserInfoError] = useState({
        id: -1,
        msg: ''
    })

    const [passwordError, setPasswordError] = useState({
        id: -1,
        msg: ''
    })


    useEffect(() => {
        if (user) {
            setFormData({
              firstName: user?.first_name,
              lastName: user?.last_name,
              phone: user?.phone_number,
            }) 
        } else {
            navigate('/login')
        }
    }, [user]);
    
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    }; 
    
    const handleInputPasswordChange = (e) => {
        setPasswordError({
            id: -1,
            msg: ''
        })

        const { name, value } = e.target;
        setFormPassword({
          ...formPassword,
          [name]: value
        });
    };

    const handleValidateUserInfo = () => { 
        const regexPhoneNumber = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/
        let invalidNullMsg = 'Không được để trống'
        let invalidPhoneNumberMsg = 'Số điện thoại không đúng định dạng.'

        setUserInfoError({
            id: -1,
            msg: ''
        })

        if (!regexPhoneNumber.test(formData.phone)) {
            setUserInfoError({
                id: 0,
                msg: invalidPhoneNumberMsg
            })
            return false
        }

        if (!formData.firstName || !formData.lastName) {
            setUserInfoError({
                id: 1,
                msg: invalidNullMsg
            }) 
            return false
        }

        return true
 
    }
  
    const handleValidatePassword = () => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/gm
        setPasswordError({
            id: -1,
            msg: ''
        })

        if (!passwordRegex.test(formPassword.newPassword)) {
            setPasswordError({
                id: 1,
                msg: "Mật khẩu phải chứa ít nhất 8 ký tự, một chữ cái, một số và một ký tự đặc biệt."
            }) 
            return false
        } 
        if (formPassword.confirmPassword !== formPassword.newPassword) {
            setPasswordError({
                id: 2,
                msg: "Mật khẩu nhập lại không đúng."
            })
            return false
        }
        return true
    }
      
    const handleChangePassword = async () => { 
        if (handleValidatePassword()) { 
            
            const response = await fetch(BASE_URL + 'users/current-user/change-password/', {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    current_password: formPassword.currentPassword,
                    new_password: formPassword.newPassword,
                })
            })
            const data = await response.json() 

            if (response.status == 200) {  
                await update(data) 

                setTimeout(() => {
                    setOpenChangePassword(false)
                    handleOpenSuccessModal() 
  
                })
            } else if (response.status == 400) {
                if (data.error) {
                    setPasswordError({
                        id: 0,
                        msg: 'Sai mật khẩu'
                    })
                }
            }  
        } 
    };

    const handleChangeAvatar = async (e) => {
        const file = e.target.files[0];

        if (file) {
            const form = new FormData();
            form.append('avatar', file)

            const response = await fetch(BASE_URL + `users/current-user/update/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                },
                body: form
            }) 

            if (response.status == 200) {
                const data = await response.json()
                await update(data)   

                setTimeout(() => {
                    handleOpenSuccessModal() 
                })
            }
        } 
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (handleValidateUserInfo()) {
        const response = await fetch(BASE_URL + `users/current-user/update/`, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({  
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone_number: formData.phone
            })
        }) 

        if (response.status == 200) {
            const data = await response.json()  
            console.log(data)
            await update(data)   
            
            setTimeout(() => {
                handleOpenSuccessModal() 
            })

        } 
      }
    };

    const handleOpenChangePassword = () => {
        setOpenChangePassword(!openChangePassword)
    }

    const handleOpenSuccessModal = () => {
        setOpenSuccessModal(!openSuccessModal)
    }

    return (
        <>
            <Dialog size="sm" open={openSuccessModal} handler={handleOpenSuccessModal}>
                <DialogHeader>Đổi mật khẩu</DialogHeader>
                <DialogBody>
                    Đổi thông tin thành công
                </DialogBody>
                <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    onClick={handleOpenSuccessModal}
                    className="mr-1"
                >
                    <span>Ở lại trang</span>
                </Button>
                <Button variant="gradient" color="green" onClick={() => {
                    navigate('/')
                }}>
                    <span>Quay về trang chủ</span>
                </Button>
                </DialogFooter>
            </Dialog>

            <Dialog open={openChangePassword} handler={handleOpenChangePassword}>
                <DialogHeader>Đổi mật khẩu</DialogHeader>
                <DialogBody>
                    <div className="mb-4">
                        <Input onBlur={handleValidatePassword} name="currentPassword" onChange={handleInputPasswordChange} type="password" label="Mật khẩu cũ" /> 
                        {passwordError.id == 0 && <p className="text-red-500 text-sm mx-2">{passwordError.msg}</p>}
                    </div>
                    <div className="my-4">
                        <Input onBlur={handleValidatePassword} name="newPassword" onChange={handleInputPasswordChange} type="password" label="Mật khẩu mới" />
                        {passwordError.id == 1 && <p className="text-red-500 text-sm mx-2">{passwordError.msg}</p>}
                    </div>
                    <div className="my-4">
                        <Input onBlur={handleValidatePassword} name="confirmPassword" onChange={handleInputPasswordChange} type="password" label="Nhập lại mật khẩu" /> 
                        {passwordError.id == 2 && <p className="text-red-500 text-sm mx-2">{passwordError.msg}</p>}
                    </div>
                </DialogBody>
                <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    onClick={handleOpenChangePassword}
                    className="mr-1"
                >
                    <span>Huỷ</span>
                </Button>
                <Button variant="gradient" color="green" onClick={handleChangePassword}>
                    <span>Xác nhận</span>
                </Button>
                </DialogFooter>
            </Dialog>
            <div className="container mx-auto mt-10">
                <h1 className="text-4xl font-semibold">Thông tin người dùng</h1>
                <div className="my-4 grid lg:grid-cols-3 grid-cols-1">
                    <div className="flex justify-center flex-col items-center gap-4">
                        <img
                            className="w-40 h-40 rounded-full"
                            src={
                                user?.avatar
                            }
                        ></img>
                        <Button> 
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleChangeAvatar} 
                            />
                        </Button>
                    </div>
                    <div className="lg:col-span-2 w-full">
                        <form
                            onSubmit={handleSubmit}
                            className="mx-auto bg-white p-6 rounded-md shadow-md space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Họ
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange} 
                                    onBlur={handleValidateUserInfo}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Nhập họ"
                                />
                                {userInfoError.id == 1 && <p className="text-red-500 text-sm mx-2">{userInfoError.msg}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Tên
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange} 
                                    onBlur={handleValidateUserInfo}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Nhập tên"
                                /> 
                                {userInfoError.id == 1 && <p className="text-red-500 text-sm mx-2">{userInfoError.msg}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    onBlur={handleValidateUserInfo}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Nhập số điện thoại"
                                    autoComplete="off"
                                /> 
                                {userInfoError.id == 0 && <p className="text-red-500 text-sm mx-2">{userInfoError.msg}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        type={"password"}
                                        name="password"
                                        value={'123123123132123123123132'} 
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                                        disabled
                                    />
                                    <button
                                        type="button"
                                        onClick={handleOpenChangePassword}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    >
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div> 
        </>
    );
}
