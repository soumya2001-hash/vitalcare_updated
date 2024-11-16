import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Register = async ({params: {userID}} : SearchParamProps) => {

  const user = await getUser(userID);

  return (
    <div className="flex h-screen max-h-screen ">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
          src="/assets/icons/logo_full_final.png"
          height={1000}
          width={1000}
          alt="Logo"
          className="mb-12 h-10 w-fit"
          />
          <RegisterForm user={user}/>
          <p className="justify-items-end text-dark-600 xl:text-left py-12">© 2024 VitalCare</p>
          
        </div>
      </section>
      <Image 
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="max-w-[47%]"
      />
    </div>
  )
}

export default Register