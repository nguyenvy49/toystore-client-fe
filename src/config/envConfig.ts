import { z } from "zod";

const configSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().min(1,"NEXT_PUBLIC_API_URL không được để trống"),
});

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
if (!configProject.success) {
  console.error("❌ Lỗi biến môi trường:", configProject.error.format());
  throw new Error("Các giá trị khai báo trong file .env không hợp lệ");
}

const envConfig = configProject.data;
export default envConfig;