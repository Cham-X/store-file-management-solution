"use client"

import { navItems } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import React from 'react'

interface Props {
    fullName: string;
    email: string;
    avatar: string
}
const Sidebar = ({ fullName, email, avatar }: Props) => {
    const pathname = usePathname()
    return (
        <aside className='sidebar'>
            <Link href='/'>
                <Image
                    src="/assets/icons/logo-full-brand.svg"
                    alt='logo'
                    width={160}
                    height={50}
                    className='hidden h-auto lg:block'
                />
                <Image
                    src="/assets/icons/logo-brand.svg"
                    alt='logo'
                    width={52}
                    height={52}
                    className='lg:hidden'
                />
            </Link>

            <nav className='sidebar-nav'>
                <ul className='flex flex-1 flex-col gap-6'>
                    {navItems.map(({ name, url, icon }) => {
                        return (
                            <Link href={url} className='lg:w-full' key={name}>
                                <li className={cn(
                                    "sidebar-nav-item",
                                    pathname === url && "shad-active"
                                )}
                                >
                                    <Image
                                        src={icon}
                                        alt='name'
                                        width={24}
                                        height={24}
                                        className={cn(
                                            "nav-icon",
                                            pathname === url && "nav-icon-active"
                                        )}
                                    />
                                    <p className='hidden lg:block'>{name}</p>
                                </li>
                            </Link>
                        )
                    })}
                </ul>
            </nav>

            <Image
                src="/assets/images/files-2.png"
                alt='logo'
                width={506}
                height={418}
                className='w-full'
            />
            <div className='sidebar-user-info'>
                <Image
                    src={avatar}
                    alt='avatar'
                    width={44}
                    height={44}
                    className='sidebar-user-avatar'
                />

                <div className='hidden lg:block overflow-hidden  whitespace-nowrap '>
                    <p className='subtitle-2 capitalize w-full truncate'>{fullName}</p>
                    <p className='caption w-full truncate'>{email}</p>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
