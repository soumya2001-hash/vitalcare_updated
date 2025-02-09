"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField";
import { Label } from '@/components/ui/label';
import { UserFormValidation } from "@/lib/validation";
import { useReducer, useState } from "react";
import SubmitButton from "../SubmitButton";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";

export enum formFieldTypes {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',
}
 

 
const PatientForm = () => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit({name, email, phone }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    
    try {
      const userData = {name, email, phone};
      // console.log("Submitting userData:", userData);
      if(userData){
        const user = await createUser(userData);
        // console.log("API Response:", user);
        // console.log("loading");
        if(user) {
          // console.log(user);
          router.push(`/patients/${user.$id}/register`);
          console.log("routed")}
        else{
          console.log("user does not exist");
        }
      }
      
      
    } catch (error) {
      console.log(error);
    }
    finally {
      setIsLoading(false);
    }

  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1 className="header ">Hi There 👋</h1>
            <p className="text-dark-700">Schedule your first appointment</p>
        </section>
      
      <CustomFormField
          fieldType={formFieldTypes.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user" 
          renderSkeleton={function (field: any): React.ReactNode {
            throw new Error("Function not implemented.");
          } }       
          />

        <CustomFormField
          fieldType={formFieldTypes.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@email.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email" 
          renderSkeleton={function (field: any): React.ReactNode {
            throw new Error("Function not implemented.");
          } }       
          />

        <CustomFormField
          fieldType={formFieldTypes.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone Number"
          placeholder="1234567890"
          renderSkeleton={function (field: any): React.ReactNode {
            throw new Error("Function not implemented.");
          } }       
          />

      <SubmitButton isLoading={isLoading} >Get Started</SubmitButton>
    </form>
  </Form>
  )
}

export default PatientForm;