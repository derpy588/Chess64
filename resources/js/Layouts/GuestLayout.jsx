import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div class="flex flex-col h-screen w-screen bg-xdark-gray items-center justify-center">
            { children }
        </div>
    );
}
