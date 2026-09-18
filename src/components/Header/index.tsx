'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { menuData } from './menuData';
import Dropdown from './Dropdown'
import { toast, Slide } from 'react-toastify';
import { useAppContext } from '@/app/context/AppContext';
import Image from 'next/image';
import { FaShoppingCart, FaSearch, FaUser } from "react-icons/fa";
import { AuthService } from '@/services/authServices';
import { useRouter } from 'next/navigation';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [navigationOpen, setNavigationOpen] = useState(false);
    const [stickyMenu, setStickyMenu] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout, isAuthenticated } = useAppContext();
    const router = useRouter();

    const handleOpenCartModal = () => {
        router.push('/cart');
    };
    const handleLogout = async () => {
        await AuthService.logout();
        logout();
        setShowUserMenu(false);
        toast.success("Đăng xuất thành công!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
        });
    };

    const getFirstName = (fullName: string | null | undefined) => {
        if (!fullName) return 'User';
        return fullName.split(' ').slice(-1)[0] || 'User';
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY >= 80) {
                setStickyMenu(true);
            } else {
                setStickyMenu(false);
            }

            if (currentScrollY > lastScrollY && currentScrollY > 150) {
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY) {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <header
            className={`fixed left-0 top-0 w-full z-9999 bg-[#AFDDFF] transition-transform ease-in-out duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
                } ${stickyMenu ? 'shadow' : ''}`}
        >
            <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
                {/* Header top start */}
                <div
                    className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 ease-out duration-200 ${stickyMenu ? 'py-2' : 'py-3'
                        }`}
                >
                    {/* First row on mobile, Left side on desktop: Logo */}
                    <Link className="flex-shrink-0" href="/">
                        <Image
                            src="/images/logo/logo7.png"
                            alt="Logo"
                            width={160}
                            height={36}
                        />
                    </Link>

                    {/* Search - Second row on mobile, Center on desktop */}
                    <div className="w-full lg:flex-1 lg:max-w-[650px] lg:mx-6">
                        <form>
                            <div className="flex items-center">
                                <div className="relative w-full">
                                    <input
                                        onChange={e =>
                                            setSearchQuery(e.target.value)
                                        }
                                        value={searchQuery}
                                        type="search"
                                        name="search"
                                        id="search"
                                        placeholder="Nhập từ khóa tìm kiếm..."
                                        autoComplete="off"
                                        className="w-full rounded-[8px] bg-gray-1 border border-gray-3 py-2.5 pl-4 pr-10 outline-none ease-in duration-200"
                                    />

                                    <button
                                        id="search-btn"
                                        aria-label="Search"
                                        className="flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 ease-in duration-200 hover:text-blue"
                                    >
                                        <FaSearch className="fill-current" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right side: User + Cart + Hamburger */}
                    <div className="flex items-center justify-end gap-5 absolute right-4 top-3 lg:static">
                        {/* User Section */}
                        {isAuthenticated && user ? (
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setShowUserMenu(!showUserMenu)
                                    }
                                    className="flex items-center gap-2 hover:text-blue transition-colors"
                                >
                                    <FaUser />
                                    <span className="hidden sm:inline text-sm font-medium">
                                        {getFirstName(user?.fullName)}
                                    </span>
                                </button>

                                {/* Dropdown menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <Link
                                            href="/my-account"
                                            className="block px-4 py-2 text-sm text-dark hover:bg-gray-100"
                                            onClick={() =>
                                                setShowUserMenu(false)
                                            }
                                        >
                                            Tài khoản của tôi
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/signin"
                                className="flex items-center gap-2 hover:text-blue transition-colors"
                            >
                                <FaUser />
                                <span className="hidden sm:inline text-sm font-medium">
                                    Đăng nhập
                                </span>
                            </Link>
                        )}

                        {/* Cart */}
                        <button
                            onClick={handleOpenCartModal}
                            className="flex items-center gap-2.5"
                        >
                            <span className="inline-block relative">
                                <FaShoppingCart />
                            </span>
                        </button>

                        {/* Hamburger Toggle BTN */}
                        <button
                            id="Toggle"
                            aria-label="Toggler"
                            className="xl:hidden block"
                            onClick={() => setNavigationOpen(!navigationOpen)}
                        >
                            <span className="block relative cursor-pointer w-5.5 h-5.5">
                                <span className="du-block absolute right-0 w-full h-full">
                                    <span
                                        className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-[0] ${!navigationOpen &&
                                            '!w-full delay-300'
                                            }`}
                                    ></span>
                                    <span
                                        className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-150 ${!navigationOpen &&
                                            '!w-full delay-400'
                                            }`}
                                    ></span>
                                    <span
                                        className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-200 ${!navigationOpen &&
                                            '!w-full delay-500'
                                            }`}
                                    ></span>
                                </span>

                                <span className="block absolute right-0 w-full h-full rotate-45">
                                    <span
                                        className={`block bg-dark rounded-sm ease-in-out duration-200 delay-300 absolute left-2.5 top-0 w-0.5 h-full ${!navigationOpen && '!h-0 delay-[0] '
                                            }`}
                                    ></span>
                                    <span
                                        className={`block bg-dark rounded-sm ease-in-out duration-200 delay-400 absolute left-0 top-2.5 w-full h-0.5 ${!navigationOpen && '!h-0 dealy-200'
                                            }`}
                                    ></span>
                                </span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="border-t-[2px] border-gray-3 bg-[#60B5FF]/100">
                <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
                    <div className="flex items-center justify-between">
                        {/* <!--=== Main Nav Start ===--> */}
                        <div
                            className={`w-[288px] absolute right-4 top-full xl:static xl:w-auto h-0 xl:h-auto invisible xl:visible xl:flex items-center justify-between ${navigationOpen &&
                                `!visible bg-[#61b5ff] shadow-lg border border-gray-3 !h-auto max-h-[400px] overflow-y-scroll rounded-md p-5`
                                }`}
                        >
                            {/* <!-- Main Nav Start --> */}
                            <nav>
                                <ul className="flex xl:items-center flex-col xl:flex-row gap-5 xl:gap-12">
                                    {menuData.map((menuItem, i) =>
                                        menuItem.submenu ? (
                                            <Dropdown
                                                key={i}
                                                menuItem={menuItem}
                                                stickyMenu={stickyMenu}
                                            />
                                        ) : (
                                            <li
                                                key={i}
                                                className=" group relative before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full "
                                            >
                                                <Link
                                                    href={menuItem.path}
                                                    className={`hover:text-blue text-custom-lg font-medium text-white flex ${stickyMenu
                                                        ? 'xl:py-4'
                                                        : 'xl:py-6'
                                                        }`}
                                                >
                                                    {menuItem.title}
                                                </Link>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </nav>
                            {/* <!-- Main Nav End --> */}
                        </div>
                        {/* <!--=== Main Nav End ===--> */}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
