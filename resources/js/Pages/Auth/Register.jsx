import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));

        reset('password', 'password_confirmation');
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div class="flex flex-col p-4 h-auto w-1/3 min-w-fit rounded-lg bg-gunmetal">
                <ApplicationLogo />
                <div class="w-full bg-charcoal-gray rounded-lg h-1 mt-2"></div>
                <form onSubmit={submit}>
                    
                    <div class="w-full my-2">
                        <p class="text-gray-300 text-lg">Username:*</p>
                        <input placeholder="Username" class="w-full rounded-lg bg-tuna focus:ring-0 border-0 text-gray-300" type="text" value={data.username} onChange={e => setData('username', e.target.value)} />
                        {errors.username && <div class="text-light-vermilion">*{errors.username}</div>}
                    </div>

                    <div class="w-full my-2">
                        <p class="text-gray-300 text-lg">Email:*</p>
                        <input placeholder="Email" class="w-full rounded-lg bg-tuna focus:ring-0 border-0 text-gray-300" type="text" value={data.email} onChange={e => setData('email', e.target.value)} />
                        {errors.email && <div class="text-light-vermilion">*{errors.email}</div>}
                    </div>

                    <div class="w-full my-2">
                        <p class="text-gray-300 text-lg">Password:*</p>
                        <input placeholder="Password" class="w-full rounded-lg bg-tuna focus:ring-0 border-0 text-gray-300" type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
                        {errors.password && <div class="text-light-vermilion">*{errors.password}</div>}
                    </div>

                    <div class="w-full my-2">
                        <p class="text-gray-300 text-lg">Confirm Password:*</p>
                        <input placeholder="Confirm Password" class="w-full rounded-lg bg-tuna focus:ring-0 border-0 text-gray-300" type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                        {errors.password_confirmation && <div class="text-light-vermilion">*{errors.password_confirmation}</div>}
                    </div>

                    <div class="flex flex-col mt-4 w-full items-center justify-center">
                        <button class="transition w-fit h-fit bg-tuna border-0 text-gray-300 rounded-lg text-base px-4 py-2 hover:bg-gray-600" type="submit" disabled={processing}>Register</button>
                    </div>
                </form>
                <div class="flex flex-col mt-4 w-full items-center-justify-center">
                    <p class="text-gray-400 text-center">* Field is required to be filled out.</p>
                </div>
                <Link class="text-gray-400 hover:text-gray-300" href="/login">Login?</Link>
            </div>
        </GuestLayout>
    );
}
