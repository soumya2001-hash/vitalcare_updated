"use server";
import { ID, Query } from "appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils";


export const createUser = async (user:CreateUserParams) => {
    try {
        const newUser = await users.create(ID.unique(),user.email,user.phone,"xyajdhf1.",user.name);
        // if(newUser){
        //     console.log("Created new user ",newUser);
        // }else{
        //     console.log("No results from users.create");
        // }
        // console.log({newUser});
        return parseStringify(newUser);
    } catch (error:any) {
        // console.log(error);
        if(error && error?.code === 409){
            const documents = await users.list([
                Query.equal('phone',user.phone)
            ])
            // if(documents.users){
            //     console.log("Existing user ",documents.users);
            // }else{
            //     console.log("No results returned from database")
            // }
            return documents.users[0];
        }
        else{
            console.log(error);
        }


    }
}








 





export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
    try {
        let file;

        if (identificationDocument) {
            // Extract file from FormData
            const inputFile = identificationDocument.get("identificationDocument") as File; // ✅ Correct


            if (!inputFile) {
                throw new Error("No file found in FormData");
            }

            file = await storage.createFile(
                BUCKET_ID!,
                ID.unique(),
                inputFile // Directly pass the extracted file
            );
        }

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentID: file?.$id || null,
                identificationDocumentURL: file
                    ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
                    : null,
                ...patient
            }
        );

        return parseStringify(newPatient);
        
    } catch (error) {
        console.error("Error registering patient:", error);
        return null;
    }
};



export const getPatient = async (userID:string) => {
    try {
        const patient = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [
                Query.equal('userID', userID)
            ]
        );
        
        return parseStringify(patient.documents[0]);
    } catch (error) {
        console.log(error)
    }
}

export const getUser = async (userID:string) => {
    try {
        const user = await users.get(userID);

        return parseStringify(user);
    } catch (error) {
        console.log(error)
    }
}