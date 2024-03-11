import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <div class="flex flex-col p-4 h-auto w-1/3 min-w-fit rounded-lg bg-gunmetal">
                <ApplicationLogo />
                <div class="w-full bg-charcoal-gray rounded-lg h-1 mt-2"></div>
                <form onSubmit={submit}>

                    <div class="w-full my-2">
                        <p class="text-gray-300 text-lg">Email:</p>
                        <input placeholder="Email" class="w-full rounded-lg bg-tuna focus:ring-0 border-0 text-gray-300" type="text" value={data.email} onChange={e => setData('email', e.target.value)} />
                        {errors.email && <div class="text-light-vermilion">*{errors.email}</div>}
                    </div>

                    <div class="w-full my-2">
                        <p class="text-gray-300 text-lg">Password:</p>
                        <input placeholder="Password" class="w-full rounded-lg bg-tuna focus:ring-0 border-0 text-gray-300" type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
                        {errors.password && <div class="text-light-vermilion">*{errors.password}</div>}
                    </div>

                    <div class="flex w-full mt-2">
                        <label class="text-gray-300">
                            <input
                                name="remember"
                                type="checkbox"
                                class="rounded outline-none bg-tuna focus:bg-tuna ring-transparent focus:ring-offset-0 focus:ring-transparent focus:outline-transparent text-blue-500"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            ></input>
                            <span class="text-gray ml-3">Remember me</span>
                        </label>
                    </div>

                    <div class="flex flex-col mt-4 w-full items-center justify-center">
                        <button class="transition w-fit h-fit bg-tuna border-0 text-gray-300 rounded-lg text-base px-4 py-2 hover:bg-gray-600" type="submit" disabled={processing}>Login</button>
                    </div>
                </form>
                <div class='flex w-full'>
                    <Link class="text-gray-400 hover:text-gray-300" href="/register">Register?</Link>
                    <Link class="text-gray-400 hover:text-gray-300 ml-auto" href="/forgot-password">Forgot Password?</Link>
                </div>
            </div>
        </GuestLayout>
    );
}
