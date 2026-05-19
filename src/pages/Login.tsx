import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getIdTokenResult, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/firebase/client";
import { useToast } from "@/hooks/useToast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

type FormValues = z.infer<typeof schema>;

export function Login() {
  const { push } = useToast();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const tokenResult = await getIdTokenResult(userCredential.user, true);

      if (tokenResult.claims.admin !== true) {
        await signOut(auth);
        throw new Error("Access denied");
      }
      push({ title: "Welcome back", description: "Logged in successfully." });
      navigate("/");
    } catch (error) {
      const message = error instanceof Error && error.message === "Access denied"
        ? "Access denied. This account is not an admin."
        : "Check your credentials.";
      push({ title: "Login failed", description: message, variant: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in with your admin credentials.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input placeholder="Email" type="email" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
          </div>
          <div>
            <Input placeholder="Password" type="password" {...register("password")} />
            {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
          </div>
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign In"}
          </Button>

        </form>
      </Card>
    </div>
  );
}
