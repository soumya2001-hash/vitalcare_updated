import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import StatCard from '@/components/StatCard'
import { getRecentAppointmentsList } from '@/lib/actions/appointment.actions'
import {DataTable} from '@/components/table/DataTable'
import {columns, Payment} from '@/components/table/columns'


const Admin = async () => {
    const appointments = await getRecentAppointmentsList();

  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
        <header className='admin-header'>
            <Link href="/home" className='cursor-pointer'>
                <Image 
                    src="/assets/icons/logo_full_final.png"
                    height={32}
                    width={162}
                    alt='logo'
                    className='h-8 w-fit'
                />
            </Link>
            <p className='text-16-semibold'>Admin Dashboard</p>
        </header>
        <main className='admin-main'>
            <section className='w-full space-y-4'>
                <h1 className='header'>Welcome 👋</h1>
                <p className='text-dark-700'>Start the day with managing appointments</p>
            </section>

            <section className='admin-stat'>
                <StatCard 
                    type='appointments'
                    count={appointments.scheduledCounts}
                    label="Scheduled appointments"
                    icon="/assets/icons/appointments.svg"
                />
                <StatCard 
                    type='pending'
                    count={appointments.pendingCounts}
                    label="Pending appointments"
                    icon="/assets/icons/pending.svg"
                />
                <StatCard 
                    type='cancelled'
                    count={appointments.cancelledCounts}
                    label="Cancelled appointments"
                    icon="/assets/icons/cancelled.svg"
                />
            </section>

            <DataTable columns={columns} data={appointments.documents} />
            

        </main>
    </div>
  )
}

export default Admin