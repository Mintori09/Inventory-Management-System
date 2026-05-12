"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Package } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      router.push("/dashboard");
    } catch (err: any) {
      setError("root", { message: err.message || "Email hoặc mật khẩu không đúng" });
    }
  };

  if (isLoading) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Package className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Quản lý kho</h1>
          <p className="mt-1 text-sm text-gray-500">Đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          {errors.root && (
            <p className="text-sm text-danger">{errors.root.message}</p>
          )}

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
}
