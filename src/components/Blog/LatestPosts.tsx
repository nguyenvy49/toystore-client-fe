"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { blogService } from "@/services/blogServices";
import { getFirstImageFromString } from "@/utils/format";

const LatestPosts = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await blogService.getListBlog("/api/News/Client");
        const items = res?.result?.items || [];

        const formatted = items.map((item: any) => ({
          id: item.id,
          title: item.title,
          img: getFirstImageFromString(item.image) || "/images/blog/default.jpg",
          date: new Date(item.createdOn).toLocaleDateString("vi-VN"),
          author: item.createdbyStr || "Ẩn danh",
          slug: item.slug,
          views: item.views || 0,
        }));

        setBlogs(formatted);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài viết:", error);
      }
    };

    fetchBlogs();
  }, []);

  if (!blogs.length) {
    return (
      <div className="shadow-1 bg-white rounded-xl mt-7.5 p-6 text-gray-500">
        Không có bài viết nào.
      </div>
    );
  }

  return (
    <div className="shadow-1 bg-white rounded-xl mt-7.5">
      <div className="px-4 sm:px-6 py-4.5 border-b border-gray-3">
        <h2 className="font-medium text-lg text-dark">Recent Posts</h2>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-6">
          {blogs.slice(0, 3).map((blog, key) => (
            <div className="flex items-center gap-4" key={key}>
              <Link
                href={`/blogs/blog-details/${blog.id}`}
                className="max-w-[110px] w-full rounded-[10px] overflow-hidden"
              >
                <Image
                  src={blog.img}
                  alt={blog.title || "blog"}
                  className="rounded-[10px] w-full object-cover"
                  width={110}
                  height={80}
                />
              </Link>

              <div>
                <h3 className="text-dark leading-[22px] ease-out duration-200 mb-1.5 hover:text-blue">
                  <Link href={`/blogs/blog-details/${blog.id}`}>
                    {blog.title}
                  </Link>
                </h3>

                <span className="flex items-center gap-3 text-gray-500 text-sm">
                  <span>{blog.date}</span>
                  {/* <span className="block w-px h-4 bg-gray-4"></span> */}
                  {/* <span>{blog.views} lượt xem</span> */}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestPosts;
