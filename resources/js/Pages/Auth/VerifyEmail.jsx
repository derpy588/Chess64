import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div class="flex flex-col p-4 h-auto w-1/3 min-w-fir max-w-2/5 rounded-lg bg-gunmetal">
                <div class="mb-4 text-lg text-gray-300">
                    Email Verification
                </div>
                <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    Thank you for signing up. Before being able to play chess you must verify your email address by
                    clicking on the link that was sent in the email. If you did not receive the email then click the
                    button below to send another email.
                </div>
                {status === 'verification-link-sent' && (
                <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            )}
            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <button class="transition w-fit h-fit bg-tuna border-0 text-gray-300 rounded-lg text-base px-4 py-2 hover:bg-gray-600" disabled={processing}>Resend Verification Email</button>
                    

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
            </div>
        </GuestLayout>
    );
}
