import { JobState, type Jobs } from '@prisma/client'
import prisma from './models/jobs'


type jobCreateType = Pick<Jobs, 'name' | 'description' | 'idCustomer' | 'idSpecialist' >
type idJobsType = { idCustomer?: number, idSpecialist?: number };
type idCustomerIdSpecialistType = { idCustomer: number,idSpecialist: number}

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

export const getJob = async (idJob: number) => {
    console.log(idJob)
    return await prisma.findUnique({
        where: {
            id: idJob
        }
    })
}


export const jobsByUser = async (id: idJobsType) => {
    const key = 'idCustomer' in id ? 'idCustomer' : 'idSpecialist';
    return await prisma.findMany({
        where: {
            [key]: id[key as keyof typeof id]
        }
    });
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


export const findPendingJob = async (ids: idCustomerIdSpecialistType) => {
    return await prisma.findFirst({
        where: {
            idCustomer: ids.idCustomer,
            idSpecialist: ids.idSpecialist,
            state: JobState.PENDING
        }
    });
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