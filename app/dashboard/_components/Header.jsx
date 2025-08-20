"use client"
import { UserDetailContext } from '../../_context/UserDetailContext'
// Usar import relativo para evitar falha de alias '@' em runtime
import { Button } from '../../../components/ui/button'
import { UserButton } from '@clerk/clerk-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'

function Header() {
    const {userDetail,setUserDetail}=useContext(UserDetailContext);
  return (
    <div className='p-5 shadow-sm flex justify-between items-center'>
        <Link href={'/'} className='flex gap-2 items-center'>
            <Image src={'/logo.svg'} width={40} height={40} alt="Logo AI Room Design" />
            <h2 className='font-bold text-lg'>DecoFlow</h2>
        </Link>

       <div className='flex gap-7 items-center'>
           {userDetail?.credits&& 
            <Link href={'/dashboard/buy-credits'}>
              <div className='flex gap-2 p-1 items-center bg-slate-200 px-3 rounded-full cursor-pointer hover:bg-slate-300 transition-colors'>
                <h2>{userDetail?.credits}</h2>
                <span className='text-sm font-medium'>Créditos</span>
              </div>
            </Link>}
            <Link href={'/dashboard'} className="text-black hover:text-gray-700 font-medium transition-colors">
            Painel
        </Link>
        <UserButton/>
        </div>
       
  
       
    </div>
  )
}

export default Header