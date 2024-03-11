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
    };

    return (
        <GuestLayout>
            <Head title="Register" />
            <div class="flex flex-col bg-cyan-900 items-center justify-center h-screen">
            <ApplicationLogo />
                <div class="bg-cyan-950 h-auto w-1/3 rounded-lg">
                    <div name="error" class="w-auto bg-red-300 m-2 rounded-lg">
                        <div class="w-full rounded-t-lg bg-red-400">
                            <div class="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    
                                </svg>
                                <label class="px-1 text-2xl">Error</label>
                            </div>
                        </div>
                        <label class="inline-flex mx-2 text-lg">This is sample text in order to find limit on this and stuff i dont really know what else to put here. evene more text to test so yeah</label>
                    </div>
                    <form onSubmit={submit}>
                        <div class="text-gray-300 m-2">
                            <label class="text-xl font-medium">
                                Username:
                                <input name="username" value={data.username} placeholder="example" type="text" class="bg-slate-900 border-transparent rounded-lg w-full mt-2"></input>
                            </label>
                        </div>
                        <div class="text-gray-300 m-2">
                            <label class="text-xl font-medium">
                                Email:
                                <input name="email" value={data.email} placeholder="example@gmail.com" type="text" class="bg-slate-900 border-transparent rounded-lg w-full mt-2"></input>
                            </label>
                        </div>
                        <div class="text-gray-300 m-2">
                            <label class="text-xl font-medium">
                                Password:
                                <input name="password" value={data.password} placeholder="password" type="password" class="bg-slate-900 border-transparent rounded-lg w-full mt-2"></input>
                            </label>
                        </div>
                        <div class="text-gray-300 m-2">
                            <label class="text-xl font-medium">
                                Confirm Password:
                                <input name="password_confirmation" value={data.password_confirmation} placeholder="confirm password" type="password" class="bg-slate-900 border-transparent rounded-lg w-full mt-2"></input>
                            </label>
                        </div>
                        <div class="flex flex-col h-full items-center justify-center">
                            
                            <button type="submit" class="inline-flex px-4 py-2 my-4 rounded-lg bg-blue-500 text-white shadow-lg hover:shadow-indigo-500/50 transition ease-in-out hover:-translate-y-1 hover:scale-102 hover:bg-indigo-500">Register</button>
                        </div>
                        
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
