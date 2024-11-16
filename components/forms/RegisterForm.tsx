"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField";
import { PatientFormValidation, UserFormValidation } from "@/lib/validation";
import { useState } from "react";
import SubmitButton from "../SubmitButton";
import { useRouter } from "next/navigation";
import { registerPatient } from "@/lib/actions/patient.actions";
import { formFieldTypes } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../ui/FileUploader";

 

 
const RegisterForm = ( { user }: { user : User }) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
      
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);
    let formData;
    if(values.identificationDocument && values.identificationDocument.length > 0) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument.type,
      })

    formData = new FormData();
    formData.append('blobFile', blobFile);
    formData.append('fileName', values.identificationDocument[0].name);
    }

    try {
      const patientData = {
        ...values,
        userID: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData
      } 
      //@ts-ignore 
      const patient = await registerPatient(patientData);

      if(patient) router.push(`/patients/${user.$id}/new-appointment`)
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className=" space-y-4">
            <h1 className="header ">Welcome 👋</h1>
            <p className="text-dark-700">Let us know more about yourself</p>
        </section>

        <section className=" space-y-4">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Personal information</h2>
            </div>           
        </section>
      
      <CustomFormField
          fieldType={formFieldTypes.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user" 
        //   renderSkeleton={function (field: any): React.ReactNode {
        //     throw new Error("Function not implemented.");
        //   }
        //  }       
          />

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={formFieldTypes.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@email.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email" 
          //   renderSkeleton={function (field: any): React.ReactNode {
          //     throw new Error("Function not implemented.");
          //   } }       
        />

        <CustomFormField
          fieldType={formFieldTypes.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone Number"  
          //   renderSkeleton={function (field: any): React.ReactNode {
          //     throw new Error("Function not implemented.");
          //   } }       
        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
            fieldType={formFieldTypes.DATE_PICKER}
            control={form.control}
            name="birthdate"
            label="Date of Birth"
                  
            />

            <CustomFormField
              fieldType={formFieldTypes.SKELETON}
              control={form.control}
              name="gender"
              label="Gender"
              renderSkeleton={(feild) => (
                  <FormControl>
                      <RadioGroup className="flex h-11 xl:justify-between gap-6" onValueChange={feild.onChange} defaultValue={feild.value}>
                          {GenderOptions.map((option) => (
                              <div key={option} className="radio-group">
                                  <RadioGroupItem value={option} id={option} />
                                  <Label htmlFor={option} className="cursor-pointer">
                                      {option}
                                  </Label>
                              </div>
                          ))}
                      </RadioGroup>
                  </FormControl>
              )} 
                   
            />
        </div>

        

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={formFieldTypes.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="14th street Kolkatta"
            
            //   renderSkeleton={function (field: any): React.ReactNode {
            //     throw new Error("Function not implemented.");
            //   } }       
          />

        <CustomFormField
          fieldType={formFieldTypes.INPUT}
          control={form.control}
          name="occupation"
          label="Occupation"
          placeholder="Software Engineer" 
          //   renderSkeleton={function (field: any): React.ReactNode {
          //     throw new Error("Function not implemented.");
          //   } }       
        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={formFieldTypes.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Guardian's Name"
            //   renderSkeleton={function (field: any): React.ReactNode {
            //     throw new Error("Function not implemented.");
            //   } }       
          />

          <CustomFormField
            fieldType={formFieldTypes.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency Contact Number"  
            //   renderSkeleton={function (field: any): React.ReactNode {
            //     throw new Error("Function not implemented.");
            //   } }       
          />
        </div>

        <section className=" space-y-4">
          <div className="mb-9 space-y-1">
              <h2 className="sub-header">Medical information</h2>
          </div>           
        </section>

        <CustomFormField
            fieldType={formFieldTypes.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary Physician"
            placeholder="Select a physician"  
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

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={formFieldTypes.INPUT}
              control={form.control}
              name="insuranceProvider"
              label="Insurance Provider"
              placeholder="BlueCross, BlueShield"
              
              //   renderSkeleton={function (field: any): React.ReactNode {
              //     throw new Error("Function not implemented.");
              //   } }       
            />

            <CustomFormField
              fieldType={formFieldTypes.INPUT}
              control={form.control}
              name="insurancePolicyNumber"
              label="Insurance Policy Number"
              placeholder="ABC1234567" 
              //   renderSkeleton={function (field: any): React.ReactNode {
              //     throw new Error("Function not implemented.");
              //   } }       
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={formFieldTypes.TEXTAREA}
              control={form.control}
              name="allergies"
              label="Allergies (if any)"
              placeholder="Peanuts, Pollen"
              
              //   renderSkeleton={function (field: any): React.ReactNode {
              //     throw new Error("Function not implemented.");
              //   } }       
            />

            <CustomFormField
              fieldType={formFieldTypes.TEXTAREA}
              control={form.control}
              name="currentMedication"
              label="Current Medication"
              placeholder="Ibuprofin 200mg, Paracetamol 500mg" 
              //   renderSkeleton={function (field: any): React.ReactNode {
              //     throw new Error("Function not implemented.");
              //   } }       
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={formFieldTypes.TEXTAREA}
              control={form.control}
              name="familyMedicalHistoy"
              label="Family Medical History"
              placeholder="Mother had Diabetes, Father had High blood pressure"
              
              //   renderSkeleton={function (field: any): React.ReactNode {
              //     throw new Error("Function not implemented.");
              //   } }       
            />

            <CustomFormField
              fieldType={formFieldTypes.TEXTAREA}
              control={form.control}
              name="pastMedicalHistory"
              label="Past Medical History"
              placeholder="Appendectomy" 
              //   renderSkeleton={function (field: any): React.ReactNode {
              //     throw new Error("Function not implemented.");
              //   } }       
            />
          </div>

          <section className=" space-y-4">
          <div className="mb-9 space-y-1">
              <h2 className="sub-header">Identification and Verification</h2>
          </div>           
        </section>

        <CustomFormField
            fieldType={formFieldTypes.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select Identification Type"  
            //   renderSkeleton={function (field: any): React.ReactNode {
            //     throw new Error("Function not implemented.");
            //   } }       
          >
            {IdentificationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
              fieldType={formFieldTypes.INPUT}
              control={form.control}
              name="identificationNumber"
              label="Identification Number"
              placeholder="12345678" 
              //   renderSkeleton={function (field: any): React.ReactNode {
              //     throw new Error("Function not implemented.");
              //   } }       
            />

            <CustomFormField
              fieldType={formFieldTypes.SKELETON}
              control={form.control}
              name="identificationDocument"
              label="Scanned copy of Identification Document"
              renderSkeleton={(feild) => (
                  <FormControl>
                    <FileUploader files={feild.value} onChange={feild.onChange}/>
                  </FormControl>
              )} 
                   
            />

        <section className=" space-y-4">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Consent and Privacy</h2>
            </div>           
        </section>

        <CustomFormField 
          fieldType={formFieldTypes.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to treatment"
        />

        <CustomFormField 
          fieldType={formFieldTypes.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to disclosure of information"
        />

        <CustomFormField 
          fieldType={formFieldTypes.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I consent to Privacy Policy"
        />






      <SubmitButton isLoading={isLoading} >Get Started</SubmitButton>
    </form>
  </Form>
  )
}

export default RegisterForm;