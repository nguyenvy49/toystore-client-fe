"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Image from "next/image";
import { blogService } from "@/services/blogServices";
import { getFirstImageFromString } from "@/utils/format";

const BlogDetails = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // console.log("ID trên URL:", id);
        const res = await blogService.getDetail(`${id}`);
        // console.log(" Kết quả API trả về:", res);
        setBlog(res?.result);
      } catch (error) {
        console.error("Error fetching blog detail:", error);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  if (!blog) {
    return <div className="text-center py-20 text-gray-500">Đang tải bài viết...</div>;
  }

  return (
    <>
      <Breadcrumb title={blog.title} pages={["Bài viết / ", blog.title]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[750px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="rounded-[10px] overflow-hidden mb-7.5">
            <Image
              className="rounded-[10px]"
              src={getFirstImageFromString(blog.image) || "/images/blog/default.jpg"}
              alt={blog.title}
              width={750}
              height={477}
            />
          </div>

          <h2 className="font-medium text-dark text-xl lg:text-2xl mb-4">
            {blog.title}
          </h2>

          <p className="mb-4 text-gray-600">
            {new Date(blog.createdOn).toLocaleDateString("vi-VN")}
            {/* {blog.createdbyStr || "Ẩn danh"} */}
          </p>

          <div
            className="prose prose-blue max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </section>
    </>
  );
};

export default BlogDetails;
