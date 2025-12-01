import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const resetPasswordSchema = z.object({
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            const { error: authError } = await supabase.auth.updateUser({
                password: data.password,
            });

            if (authError) {
                setError(authError.message);
            } else {
                setSuccessMessage('Password updated successfully.');
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Reset Password</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your new password below.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
                            {successMessage && (
                                <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                                    {successMessage}
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    {...register('confirmPassword')}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-600">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                            {error && (
                                <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resetting...
                                    </>
                                ) : 'Reset Password'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="hidden bg-gray-100 lg:block">
                <div className="flex flex-col justify-center items-center h-full text-center p-8">
                    <h2 className="text-4xl font-bold mb-4">CodeSmart</h2>
                    <p className="text-xl text-muted-foreground">
                        Get AI-powered feedback on your code in seconds.
                    </p>
                </div>
            </div>
        </div>
    );
}
