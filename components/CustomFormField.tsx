"use client"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formFieldTypes } from "./forms/PatientForm";
import { Control } from "react-hook-form";
import Image from "next/image";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

interface CustomProps {
    control: Control<any>,
    fieldType: formFieldTypes,
    name: string,
    label?: string,
    placeholder?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    dateFormat?: string,
    showTimeSelect?: boolean,
    children?: React.ReactNode,
    renderSkeleton: (field: any) => React.ReactNode,
}

const RenderField = ({field, props} : {field: any; props: CustomProps}) => {
    const {fieldType, iconAlt, iconSrc, placeholder, showTimeSelect, dateFormat, renderSkeleton} = props;
    switch (fieldType) {
      case formFieldTypes.INPUT:
        return (
          <div className="flex rounded-md border border-dark-500 bg-dark-400">
            {iconSrc && (
              <Image src={iconSrc} alt={iconAlt || "icon"} width={24} height={24} className="ml-2 " />
            )}

            <FormControl>
              <Input placeholder={placeholder} {...field} className="shad-input border-0"/>
            </FormControl>
          </div>
        )
      case formFieldTypes.PHONE_INPUT:
        return (
          <FormControl>
            <PhoneInput 
            defaultCountry="IN"
            placeholder={placeholder} 
            international 
            withCountryCallingCode 
            value={field.value } /* specify type E164Number */
            onChange={field.onChange}
            className="input-phone shad-input border-0" 
            />
          </FormControl>
        )
      case formFieldTypes.DATE_PICKER:
        return (
          <div className="flex rounded-md border border-dark-500 bg-dark-400 ">
            <Image 
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calender"
              className="ml-2"
            />
            <FormControl>
              <DatePicker 
              selected={field.value} 
              onChange={(date) => field.onChange(date)}
              dateFormat={dateFormat ?? 'MM/DD/YYYY'}
              showTimeSelect={showTimeSelect ?? false}
              timeInputLabel="Time:"
              wrapperClassName="date-picker"
              />
            </FormControl>
          </div>
        )
      case formFieldTypes.SELECT:
        return (
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl >
                <SelectTrigger className="shad-select-trigger">
                  <SelectValue placeholder={placeholder}/>
                </SelectTrigger>
              </FormControl>
              <SelectContent className="shad-select-content">
                {props.children}
              </SelectContent>
            </Select>
          </FormControl>
        )
      case formFieldTypes.TEXTAREA:
        return (
          <FormControl>
            <Textarea 
              placeholder={placeholder}
              {...field}
              className="shad-textArea"
              disabled={props.disabled}
            />
          </FormControl>
        )
      case formFieldTypes.CHECKBOX:
        return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox 
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
        )
      case formFieldTypes.SKELETON:
        return (
          renderSkeleton ? renderSkeleton(field) : null
        )
      default:
        break;
    }
  
}

const CustomFormField = (props: CustomProps) => {
  const {control, fieldType, name, label} = props;
  return (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex-1 ">
            {fieldType !== formFieldTypes.CHECKBOX && label && (
                <FormLabel>
                    {label}
                </FormLabel>
            )}

            <RenderField field={field} props={props} />

            <FormMessage className="shad-error"/>

          </FormItem>
        )}
    />
  )
}

export default CustomFormField