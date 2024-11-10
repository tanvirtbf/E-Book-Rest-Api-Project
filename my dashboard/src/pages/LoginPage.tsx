import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/http/api';
import { useMutation } from '@tanstack/react-query';
import { RefreshCcw } from 'lucide-react';
import useTokenStore from '@/store';

const LoginPage = () => {

    const navigate = useNavigate()
    const setToken = useTokenStore((state)=> state.setToken)

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    // Mutations
    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (response) => {
            console.log('Success!', response)

            setToken(response.data.accessToken)

            // Redirect After login successfully..
            navigate('/dashboard/home')
        },
    })

    const handleLoginSubmit = () => {
        const email = emailRef.current?.value
        const password = passwordRef.current?.value

        if(!email || !password){
            return alert('Please Enter Email or Password!')
        }

        // make server log
        mutation.mutate({email,password})
    }

    return (
        <section className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account. <br />
                        {mutation.isError && <span className='text-red-500'>{mutation.error.message}</span>}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input ref={emailRef} id="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input ref={passwordRef} id="password" type="password" required />
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="w-full">
                        <Button className="w-full flex items-center gap-2" onClick={handleLoginSubmit} disabled={mutation.isPending}>
                            {mutation.isPending && <RefreshCcw className='animate-spin' />}
                            <span>Sign in</span>
                        </Button>

                        <div className="mt-4 text-center text-sm">
                            Don't have an account?{' '}
                            <Link to={'/auth/register'} className="underline">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </section>
    );
};

export default LoginPage;