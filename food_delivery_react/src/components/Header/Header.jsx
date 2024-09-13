import React, { useEffect, useRef } from 'react'  
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Card,
  Collapse,
  Input,
} from "@material-tailwind/react";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Login from '../Login/Login';
import { useUser } from '../../contexts/UserContext';
import { CartDrawer } from '../Drawer/CartDrawer';

  
export default function Header() {
    const [openNav, setOpenNav] = React.useState(false);
    const [openLogin, setOpenLogin] = React.useState(false);
    const [openUserMenu, setOpenUserMenu] = React.useState(false);
    const [openCart, setOpenCart] = React.useState(false);
 
    const navigate = useNavigate()

    const userMenuRef = useRef()

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenUserMenu(false);
      }
    };

    useEffect(() => {
      if (openUserMenu) {
        document.addEventListener('mousedown', handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [openUserMenu]);

    const { user, logout } = useUser()

    useEffect(() => {
        console.log(user)
    }, [])
 
    useEffect(() => {
      window.addEventListener(
        "resize",
        () => window.innerWidth >= 960 && setOpenNav(false),
      );
    }, []); 

    useEffect(() => {
      if (openCart) { 
        window.scrollTo(0, 0);
        let scrollTop =
                window.pageYOffset ||
                document.documentElement.scrollTop;
        let scrollLeft =
                window.pageXOffset ||
                document.documentElement.scrollLeft;

                // if any scroll is attempted,
                // set this to the previous value
                window.onscroll = function () {
                    window.scrollTo(scrollLeft, scrollTop);
                };
      } else {
        window.onscroll = function () { };
      }
    }, [openCart])

    const openLoginModal = () => {
      setOpenLogin(!openLogin);
      console.debug(openLogin)  
    }
   
    const navList = (
      <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <IconButton onClick={() => setOpenCart(!openCart)}>
            <i className="fa-solid fa-cart-shopping"></i>
          </IconButton>
        </Typography> 
      </ul>
    )
   
    return (
      <> 
        <CartDrawer open={openCart} setOpen={setOpenCart}></CartDrawer>
        {/* {!user && ((openLogin) && <Login setOpenLogin={openLoginModal}></Login>)}  */}
        <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography  
            
            className="mr-4 cursor-pointer py-1.5 font-medium"
          >
            <NavLink to="/">
              Material Tailwind
            </NavLink>
          </Typography>

          <div className="hidden items-center gap-x-2 lg:flex">
          <div className="relative flex w-full gap-2 md:w-max">
            <Input
              type="search"
              placeholder="Search"
              containerProps={{
                className: "min-w-[288px]",
              }}
              className=" !border-t-blue-gray-300 pl-9 placeholder:text-blue-gray-300 focus:!border-blue-gray-300"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <div className="!absolute left-3 top-[13px]">
              <svg
                width="13"
                height="14"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.97811 7.95252C10.2126 7.38634 10.3333 6.7795 10.3333 6.16667C10.3333 4.92899 9.84167 3.742 8.9665 2.86683C8.09133 1.99167 6.90434 1.5 5.66667 1.5C4.42899 1.5 3.242 1.99167 2.36683 2.86683C1.49167 3.742 1 4.92899 1 6.16667C1 6.7795 1.12071 7.38634 1.35523 7.95252C1.58975 8.51871 1.93349 9.03316 2.36683 9.4665C2.80018 9.89984 3.31462 10.2436 3.88081 10.4781C4.447 10.7126 5.05383 10.8333 5.66667 10.8333C6.2795 10.8333 6.88634 10.7126 7.45252 10.4781C8.01871 10.2436 8.53316 9.89984 8.9665 9.4665C9.39984 9.03316 9.74358 8.51871 9.97811 7.95252Z"
                  fill="#CFD8DC"
                />
                <path
                  d="M13 13.5L9 9.5M10.3333 6.16667C10.3333 6.7795 10.2126 7.38634 9.97811 7.95252C9.74358 8.51871 9.39984 9.03316 8.9665 9.4665C8.53316 9.89984 8.01871 10.2436 7.45252 10.4781C6.88634 10.7126 6.2795 10.8333 5.66667 10.8333C5.05383 10.8333 4.447 10.7126 3.88081 10.4781C3.31462 10.2436 2.80018 9.89984 2.36683 9.4665C1.93349 9.03316 1.58975 8.51871 1.35523 7.95252C1.12071 7.38634 1 6.7795 1 6.16667C1 4.92899 1.49167 3.742 2.36683 2.86683C3.242 1.99167 4.42899 1.5 5.66667 1.5C6.90434 1.5 8.09133 1.99167 8.9665 2.86683C9.84167 3.742 10.3333 4.92899 10.3333 6.16667Z"
                  stroke="#CFD8DC"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <Button size="md" className="rounded-lg ">
            Search
          </Button>
        </div>
          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>
            <div className="flex items-center gap-x-1">
              

              {user ? 
              <div className='hidden lg:inline-block relative'>
                  <Button onClick={() => setOpenUserMenu(!openUserMenu)} className="bg-transparent rounded-full p-0 "> 
                      <img className='w-10 h-10 rounded-full' src={user.avatar} />  
                  </Button> 
                  {openUserMenu && 
                    <div ref={userMenuRef}  className='absolute w-[180px] right-0 top-[100%] mt-2 bg-white border-2 rounded-xl p-4 '>
                      <ul className='flex flex-wrap w-full'>
                        <li className=' w-full'>
                          <Button className='text-left  w-full py-2 bg-transparent px-0 text-black hover:shadow-transparent shadow-transparent'>
                            Thông tin cá nhân
                          </Button>
                        </li> 
                        <li className='h-[2px] w-full bg-gray-600 bg-opacity-40'></li>
                        <li className=' w-full'>
                          <Button onClick={logout} className='text-left w-full py-2 bg-transparent px-0 text-red-500 font-semibold text-sm hover:shadow-transparent shadow-transparent'>
                            Đăng xuất 
                          </Button>
                        </li> 
                      </ul>

                    </div>
                  }
                  
                  
              </div> 
              : 
                <Button
                    variant="text"
                    size="sm"
                    className="hidden lg:inline-block"
                    // onClick={openLoginModal}
                    onClick={() => navigate('/login')}
                  >
                    <span>Log In</span>
                  </Button>} 
              
            </div>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
          </div>
        </div>
        <Collapse  open={openNav}>
          {navList}
          <div className="flex items-center gap-x-1">
            {user ? 
              <Button className="bg-transparent rounded-full p-0 lg:inline-block"> 
                  <img className='w-10 h-10 rounded-full' src={user.avatar} />  
              </Button> 
            : 
            <Button onClick={openLoginModal} fullWidth variant="text" size="sm" className="">
                Log In
            </Button>} 
 
          </div>
        </Collapse>
        </Navbar> 
      </>
        
    )
}