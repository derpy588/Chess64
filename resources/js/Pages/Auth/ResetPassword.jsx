import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
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

        post(route('password.store'));
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div class="flex flex-col p-4 h-auto w-1/3 min-w-fir max-w-2/5 rounded-lg bg-gunmetal">
                <div class="mb-4 text-lg text-gray-300">
                    Reset Password
                </div>
                <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <div class="w-full my-2">
                        <input placeholder="Email" autoComplete="username" class="w-full rounded-lg bg-tuna focus:ring-0 border-0 text-gray-300" type="text" value={data.email} onChange={e => setData('email', e.target.value)} />
                    </div>

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <div class="w-full my-2">
                        <input placeholder="Password" class="w-full rounded-lg bg-tuna focus:ring-0 border-0 text-gray-300" type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
                    </div>

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                    <div class="w-full my-2">
                        <input placeholder="Email" class="w-full rounded-lg bg-tuna focus:ring-0 border-0 text-gray-300" type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                    </div>

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <button class="transition w-fit h-fit bg-tuna border-0 text-gray-300 rounded-lg text-base px-4 py-2 hover:bg-gray-600" disabled={processing}>Reset Password</button>
                    
                </div>
            </form>
            </div>

           
        </GuestLayout>
    );
}
