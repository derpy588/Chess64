import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div class="flex flex-col p-4 h-auto w-1/3 min-w-fir max-w-2/5 rounded-lg bg-gunmetal">
                <ApplicationLogo />
                <div class="w-full bg-charcoal-gray rounded-lg h-1 mt-2"></div>
                <div class="mb-4 text-lg text-gray-300 mt-4">
                    Forgot Password?
                </div>
                <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    Forgot your password? No problem. Just let us know your email address and we will email you a password
                    reset link that will allow you to choose a new one.
                </div>
                {status && <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">{status}</div>}
            <form onSubmit={submit}>
                <div className="mt-4 flex flex-col items-center justify-between">
                    <div class="w-full my-2">
                        <input placeholder="Email" class="w-full rounded-lg bg-tuna focus:ring-0 border-0 text-gray-300" type="text" value={data.email} onChange={e => setData('email', e.target.value)} />
                    </div>
                    <p class="my-2 text-red-400">{errors.email}</p>
                    <button class="transition w-fit h-fit bg-tuna border-0 text-gray-300 rounded-lg text-base px-4 py-2 hover:bg-gray-600" disabled={processing}>Email Password Reset Link</button>
                </div>
            </form>
            </div>
        </GuestLayout>
    );
}
