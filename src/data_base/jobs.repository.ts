import { JobState, type Jobs } from '@prisma/client'
import prisma from './models/jobs'


type jobCreateType = Pick<Jobs, 'name' | 'description' | 'idCustomer' | 'idSpecialist' >


export const jobCreate = async (job: jobCreateType) => {
    return await prisma.create({
        data: {
            name: job.name,
            description: job.description,
            idCustomer: job.idCustomer,
            idSpecialist: job.idSpecialist,
            state: "PENDING"
        }
    })
}

export const getJob = async (id: {id: number}) => {
    return await prisma.findUnique({
        where: {
            id: id.id
        }
    })
}

export const jobsByUser = async (id: {idCustomer: number}) => {
    return await prisma.findMany({
        where: {
            idCustomer: id.idCustomer
        }
    })
}

export const stateJob = async (id: {id: number}, state: JobState) => {
    return await prisma.update({
        where: {
            id: id.id
        },
        data: {
            state: state
        }
    })
}



// model Jobs {
//     id           Int    @id @default(autoincrement())
//     name         String 
//     description   String 
//     state        JobState
//     idCustomer   Int
//     idSpecialist Int
//     user1        Users  @relation(fields: [idCustomer], references: [id], name: "customerJobs")
//     user2        Users  @relation(fields: [idSpecialist], references: [id], name: "specialistJobs")
  
//   }