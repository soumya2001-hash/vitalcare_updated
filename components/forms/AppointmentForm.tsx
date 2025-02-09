"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField";
import { Label } from '@/components/ui/label';
import {getAppointmentSchema } from "@/lib/validation";
import { useReducer, useState } from "react";
import SubmitButton from "../SubmitButton";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";

export enum formFieldTypes {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',
}
 

 
const AppointmentForm = ({userID, patientID, type, appointment, setOpen} : {
    userID: string;
    patientID: string;
    type: "create" | "cancel" | "schedule";
    appointment?:Appointment;
    setOpen: (open: boolean) => void;
}) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment?.primaryPhysician || "",
      schedule: appointment ? new Date(appointment.schedule) : new Date(Date.now()),
      reason:  appointment?.reason || "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values:  z.infer<typeof AppointmentFormValidation>) {
    console.log("I'm submitting through the button!!!" , {type})
    setIsLoading(true);
    
    let status;

    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending"
        break;
    }

    try {
      if(type === "create" && patientID ){
        
        const appointmentData = {
          userID,
          patient: patientID,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status 
        }
        //  console.log(appointmentData);
        const appointment = await createAppointment(appointmentData);
        //  console.log(appointment);
        if(appointment){
          form.reset();
          // console.log(userID, appointment);
          router.push(`/patients/${userID}/new-appointment/success?appointmentID=${appointment.$id}`)
        }
      } else {
        const appointmentToUpdate = {
          userID,
          appointmentID : appointment?.$id!,
          appointment : {
            primaryPhysician : values.primaryPhysician,
            schedule : new Date(values.schedule),
            status : status as Status,
            cancellationReason : values.cancellationReason
          },
          type
        };
        const updatedAppointment = await updateAppointment(appointmentToUpdate);
        // console.log(updatedAppointment);
        if(updatedAppointment){
            setOpen && setOpen(false);
            form.reset();
        }
      }

      
      
      
    } catch (error) {
      console.log("Failed to load the page", error);
    }

  }

  let buttonLabel;
  switch (type) {
    case "cancel":
        buttonLabel = "Cancel Appointment";
        break;
    
    case "create":
        buttonLabel = "Create Appointment";
        break;
    
    case "schedule":
        buttonLabel = "Schedule Appointment";
        break;
    default:
        break;
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
      
        {type === 'create' && <section className="mb-12 space-y-4">
            <h1 className="header ">New Appointment </h1>
            <p className="text-dark-700">Request a new appointment in 10 seconds</p>
        </section>}
      
    {type !== "cancel" && (
        <>
            <CustomFormField
            fieldType={formFieldTypes.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Doctor"
            placeholder="Select a doctor"  
            //   renderSkeleton={function (field: any): React.ReactNode {
            //     throw new Error("Function not implemented.");
            //   } }       
          >
            {Doctors.map((doctor) => (
              <SelectItem key={doctor.name} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image 
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt={doctor.name}
                    className="rounded-full border border-dark-500"
                  /> 
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
        </CustomFormField>

        <CustomFormField 
            fieldType={formFieldTypes.DATE_PICKER}
            control={form.control}
            name="schedule"
            label="Expected appointment date"
            showTimeSelect
            dateFormat="MM/dd/yyyy - h:mm aa"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={formFieldTypes.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for appoitment"
                placeholder="Enter reason for appointment"
            />

            <CustomFormField 
                fieldType={formFieldTypes.TEXTAREA}
                control={form.control}
                name="note"
                label="Notes"
                placeholder="Enter notes"
            />
        </div>
        </>
    )}

    {type === "cancel" && (
        <CustomFormField 
            fieldType={formFieldTypes.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
        />
    )}

    <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>
    </form>
  </Form>
  )
}

export default AppointmentForm;