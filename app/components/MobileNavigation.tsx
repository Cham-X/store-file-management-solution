"use client"
import React, { useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { navItems } from '@/constants'
import { cn } from '@/lib/utils'
import FileUploader from './FileUploader'
import { signOutUser } from '@/lib/actions/user.actions'

interface Props {
    fullName: string;
    email: string;
    avatar: string;
    ownerId: string;
    accountId: string;
}

const MobileNavigation = ({ fullName, email, avatar }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    return (
        <header className='mobile-header'>
            <Image
                src="/assets/icons/logo-full-brand.svg"
                alt='logo'
                width={120}
                height={53}
            />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger>
                    <Image
                        src="/assets/icons/menu.svg"
                        alt='menu'
                        width={30}
                        height={30}
                    />
                </SheetTrigger>
                <SheetContent className='shad-sheet h-screen px-3'>
                    <SheetTitle>
                        <div className='header-user'>
                            <Image
                                src={avatar}
                                alt='menu'
                                width={44}
                                height={44}
                                className='header-user-avatar'
                            />
                            <div className='sm:hidden lg:block'>
                                <p className='subtitle-2 capitalize w-full truncate'>{fullName}</p>
                                <p className='caption w-[80%] truncate'>{email}</p>
                            </div>
                        </div>
                        <Separator className='bg-light-200/20 mb-4' />
                    </SheetTitle>
                    <nav className='mobile-nav'>
                        <ul className='mobile-nav-list'>
                            {navItems.map(({ name, url, icon }) => {
                                return (
                                    <Link href={url} className='lg:w-full' key={name}>
                                        <li className={cn(
                                            "mobile-nav-item",
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
                                            <p>{name}</p>
                                        </li>
                                    </Link>
                                )
                            })}
                        </ul>
                    </nav>

                    <Separator className='bg-light-200/20 mb-5' />

                    <div className='flex flex-col justify-between gap-5 pb-5'>
                        <FileUploader />
                        <Button
                            type='submit'
                            className='mobile-sign-out-button'
                            onClick={async () => await signOutUser()}>
                            <Image
                                src="/assets/icons/logout.svg"
                                alt='logout'
                                width={24}
                                height={24}
                                className='w-6'
                            />
                            <p>Logout</p>
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

        </header>
    )
}

export default MobileNavigation
