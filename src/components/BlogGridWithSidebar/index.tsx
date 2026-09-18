"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import BlogItem from "../Blog/BlogItem";
import SearchForm from "../Blog/SearchForm";
import LatestPosts from "../Blog/LatestPosts";
import { blogService } from "@/services/blogServices";
import { getFirstImageFromString } from "@/utils/format";
import { motion } from "framer-motion"; // ✅ thêm hiệu ứng mềm mượt

const BlogGridWithSidebar = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const pageSize = 4;

  //  Fetch API
  const fetchBlogs = async (page: number, searchTerm = "") => {
    try {
      setLoading(true);
      const query = `/api/News/Client?PageNumber=${page}&PageSize=${pageSize}${
        searchTerm ? `&Search=${encodeURIComponent(searchTerm)}` : ""
      }`;

      const res = await blogService.getListBlog(query);
      const data = res?.result;
      const items = data?.items || [];

      const formattedBlogs = items.map((item: any) => ({
        id: item.id,
        title: item.title,
        image: getFirstImageFromString(item.image),
        date: new Date(item.createdOn).toLocaleDateString("vi-VN"),
        author: item.createdbyStr || "Ẩn danh",
        slug: item.slug,
      }));

      setBlogs(formattedBlogs);
      setTotalPages(data?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi đổi trang hoặc keyword
  useEffect(() => {
    fetchBlogs(currentPage, keyword);
  }, [currentPage, keyword]);

  // Chuyển trang
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Nhận từ SearchForm
  const handleSearch = (searchTerm: string) => {
    setKeyword(searchTerm);
    setCurrentPage(1); // reset về trang đầu
  };

  return (
    <>
      <Breadcrumb title={"Bài viết"} pages={["Bài viết"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row gap-7.5">
            {/* Blog grid */}
            <div className="lg:max-w-[770px] w-full">
              {loading ? (
                <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
              ) : blogs.length === 0 ? (
                //  Không tìm thấy bài viết nào
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-20 bg-white rounded-xl shadow-sm"
                >
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                     Không tìm thấy bài viết nào phù hợp
                  </h3>
                  <p className="text-gray-500">
                    Hãy thử lại với từ khóa khác nhé!
                  </p>
                </motion.div>
              ) : (
                //  Danh sách bài viết
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-7.5">
                  {blogs.map((blog) => (
                    <BlogItem
                      key={blog.id}
                      blog={{
                        id: blog.id,
                        img: blog.image,
                        title: blog.title,
                        date: blog.date,
                        slug: blog.slug,
                      }}
                    />
                  ))}
                </div>
              )}

              {/*  Pagination */}
              {!loading && blogs.length > 0 && totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <div className="bg-white shadow-1 rounded-md p-2">
                    <ul className="flex items-center">
                      <li>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="flex items-center justify-center w-8 h-9 rounded-[3px] hover:bg-blue hover:text-white disabled:text-gray-400"
                        >
                          &lt;
                        </button>
                      </li>

                      {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i}>
                          <button
                            onClick={() => handlePageChange(i + 1)}
                            className={`flex py-1.5 px-3.5 rounded-[3px] duration-200 ${
                              currentPage === i + 1
                                ? "bg-blue text-white"
                                : "hover:bg-blue hover:text-white"
                            }`}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}

                      <li>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="flex items-center justify-center w-8 h-9 rounded-[3px] hover:bg-blue hover:text-white disabled:text-gray-400"
                        >
                          &gt;
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:max-w-[370px] w-full">
              <SearchForm onSearch={handleSearch} />
              <LatestPosts />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogGridWithSidebar;
