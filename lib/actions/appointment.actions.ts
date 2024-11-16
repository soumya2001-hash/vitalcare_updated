'use server';

import { ID, Query } from "node-appwrite";
import { APPOINTMENTS_COLLECTION_ID, DATABASE_ID, databases, messaging } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async (appointment : CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENTS_COLLECTION_ID!,
            ID.unique(),
            appointment
        )
        // console.log("here");
        return parseStringify(newAppointment);  
    } catch (error) {
        console.log("An error occurred while creating a new appointment:", error)
    }
}

export const getAppointment = async (appointmentID : String) => {
    try {
        const appointemt = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENTS_COLLECTION_ID!,
            appointmentID
        );
        return parseStringify(appointemt);
    } catch (error) {
        console.log("Error fetching the appointemt details", error)
    }
}

export const getRecentAppointmentsList = async () => {
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENTS_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        );
        const initialCounts = {
            scheduledCounts : 0,
            pendingCounts : 0,
            cancelledCounts : 0
        };
        const counts =  (appointments.documents as Appointment[]).reduce((acc, appointment) => 
        {
            if(appointment.status === 'scheduled'){
                acc.scheduledCounts += 1;
            } else if(appointment.status === 'pending'){
                acc.pendingCounts += 1;
            } else if(appointment.status === 'cancelled'){
                acc.cancelledCounts += 1;
            }
            return acc;
        } , initialCounts);

        const data = {
            totalCount : appointments.total,
            ...counts,
            documents: appointments.documents
        };

        return parseStringify(data);

    } catch (error) {
        console.log("Error fetching the appointments from appwrite", error);
    }
}

export const updateAppointment = async ({appointmentID, userID, appointment, type} : UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENTS_COLLECTION_ID!,
            appointmentID,
            appointment
        );
        if(!updatedAppointment){
            throw new Error("Appointment not found")
        }else{
            // SMS confirmation
            const smsMessage = `
            Hi, It's VitalCare.
            ${type === 'schedule' ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}` : `We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}`}
            `;
            await sendSMSNotification(userID, smsMessage);
            revalidatePath('/admin');
            return parseStringify(updatedAppointment);
        }
    } catch (error) {
        console.log("Error updating the appointment", error);
    }
}

export const sendSMSNotification = async (userID: string, content: string ) => {
    try {
        const message = await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userID]
        );
        return parseStringify(message);
    } catch (error) {
        console.log("Error sending SMS through twilio", error);
    }
} 