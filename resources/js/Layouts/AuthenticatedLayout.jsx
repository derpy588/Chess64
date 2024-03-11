import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react'
import { PlayIcon, 
        Cog6ToothIcon, 
        ArrowLeftOnRectangleIcon 
        } from '@heroicons/react/24/outline';
import { Popover, Transition } from '@headlessui/react';


export default function Authenticated({ user, header, children }) {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const { url } = usePage()

    const navItems = [
        {name: "Play", route: "dashboard", href: "/dashboard", icon: PlayIcon},
        {name: "Settings", route: "dashboard", href: "/settings", icon: Cog6ToothIcon},
        {name: "Logout", route: "logout", href: "/logout", icon: ArrowLeftOnRectangleIcon},
    ]

    function navbar_toggle(e) {
        setNavbarOpen((prev) => !prev)
    }

    return (
        <div class="flex h-screen w-screen bg-gunmetal">
            {/* Nav bar menu stuff here */}
            <div class="flex flex-col hidden md:block bg-xdark-gray md:min-h-full md:w-80">
                <div class="w-full mt-4 px-4 ">
                    <label class="text-gray-300 text-4xl lg:text-5xl font-semibold text-center">CHESS 64</label>
                </div>
                <div class="bg-tuna w-full h-0.5 mt-2"></div>
                <div class="flex flex-col w-full h-auto">
                    {navItems.map((item) => (
                        <div class="flex w-full h-fit">
                        <div class="flex px-2 my-2 w-full h-full">

                            <Link href={route(item.route)} className={"flex rounded-lg hover:bg-charcoal-gray w-full h-10 items-center px-2 text-center text-gray-300 self-center "+ (url.startsWith(item.href) ? 'bg-tuna' :'')}>
                                <item.icon class="h-6 w-6 text-white" />
                                
                                <p class="text-center w-full">{item.name}</p>
                            </Link>
                        </div>
                    </div>
                    ))}
                    
                </div>
            </div>
            
            {/* Mobile menu pop out stuff */}
            <Popover class="flex flex-row md:hidden w-full h-fit mx-auto bg-xdark-gray ">
            
                <Popover.Button class="h-11 w-11" onClick={navbar_toggle}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-full h-full p-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                </Popover.Button>
                        
                <Popover.Panel class="absolute z-40 w-screen h-full">
                    <div class="flex flex-col w-1/2 h-full bg-xdark-gray">
                        <div class="flex flex-row w-full mt-4 px-4">
                            <label class="text-gray-300 text-3xl font-semibold text-center">CHESS 64</label>
                            <Popover.Button class="text-white text-2xl ml-auto">X</Popover.Button>
                        </div>
                        <div class="bg-tuna w-full h-0.5 mt-2"></div>
                        <div class="flex flex-col w-full h-auto">
                            {navItems.map((item) => (
                                <div class="flex w-full h-fit">
                                <div class="flex px-2 my-2 w-full h-full">

                                    <Link href={route(item.route)} className={"flex rounded-lg hover:bg-charcoal-gray w-full h-10 items-center px-2 text-center text-gray-300 self-center "+ (url.startsWith(item.href) ? 'bg-tuna' :'')}>
                                        <item.icon class="h-6 w-6 text-white" />
                                        
                                        <p class="text-center w-full">{item.name}</p>
                                    </Link>
                                </div>
                            </div>
                            ))}
                            
                        </div>
                    </div>
                </Popover.Panel>

            </Popover>

            <div class="flex w-full h-full">
                {children}
            </div>
        </div>
    );
}
