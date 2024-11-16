'use client';
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './ui/button';
import AppointmentForm from './forms/AppointmentForm';
import { Appointment } from '@/types/appwrite.types';
  
const AppointmentModal = ({type, patientID, userID, appointment} : {
    type : 'schedule' | 'cancel',
    patientID: string,
    userID: string,
    appointment?: Appointment
}) => {

    const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="ghost" className={`capitalize ${type === 'schedule' && 'text-green-500'}`}>
                {type}
            </Button>
        </DialogTrigger>
        <DialogContent className='shad-dialog sm:max-w-md max-h-screen overflow-scroll '>
            <DialogHeader className='mb-4 space-y-3'>
            <DialogTitle className='capitalize'>{type} Appointment</DialogTitle>
            <DialogDescription>
                Please fill in the following the details to {type} the appointment.
            </DialogDescription>
            </DialogHeader>
            <AppointmentForm 
                userID={userID}
                patientID={patientID}
                type={type}
                appointment={appointment}
                setOpen={setOpen}
            />
        </DialogContent>
    </Dialog>

  )
}

export default AppointmentModal