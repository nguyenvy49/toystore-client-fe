"use client"
import { useAppContext } from "@/app/context/AppContext";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { AuthService } from "@/services/authServices";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Signin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {setUser} = useAppContext();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await AuthService.login({ username, password });
      console.log(response)
      const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000)
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.result.user));
        await AuthService.auth({
          roleUser: response.result.user.roles[0],
          sessionToken: response.result.accessToken,
          expiresAt: expiresAt.toISOString(),
        })
        setUser(response.result.user);
        // Redirect to home page
        router.push('/');
      } else {
        setError('Đăng nhập không thành công. Vui lòng thử lại.');
      }
    } catch (error: any) {
      console.error('Login failed', error);
      const errorMessage =
        error.response?.data?.message ||
        'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Breadcrumb title={"Đăng nhập"} pages={["Đăng nhập"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Đăng nhập
              </h2>
              <p>Nhập tài khoản của bạn</p>
            </div>

            <div>
              {error && (
                <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Email
                  </label>

                  <input
                    type="email"
                    id="username"
                    name="username"
                    onChange={e =>
                      setUsername(e.target.value)
                    }
                    placeholder="Nhập email của bạn"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Mật khẩu
                  </label>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    onChange={e =>
                      setPassword(e.target.value)
                    }
                    placeholder="Nhập mật khẩu của bạn"
                    autoComplete="on"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5"
                  disabled={loading}
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>

                <a
                  href="#"
                  className="block text-center text-dark-4 mt-4.5 ease-out duration-200 hover:text-dark"
                >
                  Quên mật khẩu?
                </a>

                <p className="text-center mt-6">
                  Chưa có tài khoản?
                  <Link
                    href="/signup"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    Đăng ký!
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;
