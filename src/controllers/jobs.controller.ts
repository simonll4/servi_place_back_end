import { NextFunction, Request, Response } from 'express'
import { findUser } from '../data_base/users.repository'
import { jobCreate, jobsByUser, getJob, stateJob } from '../data_base/jobs.repository'
import { JobState, Role } from '@prisma/client'

//Le paso el id del usuario que es el que esta logueado y el id del usuario al que le quiero crear el trabajo
export const createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user1 = await findUser({ id: req.body.decoded.id })
        if (!user1) return next({ name: 'NotFoundError' })
        const user2 = await findUser({ id: req.body.idUser })
        if (!user2) return next({ name: 'NotFoundError' })

        if (user1?.role === user2?.role) {
            console.log("holahola")
            return next({ name: 'same role' }) //pasar al error handler
        }

        if (user1?.role === Role.CUSTOMER && user2?.role === Role.SPECIALIST) {
            const job = await jobCreate({
                name: req.body.name,
                description: req.body.description,
                idCustomer: user1.id,
                idSpecialist: user2.id
            })
            res.status(201).json({ message: 'Job created', job: job })
        } else {
            res.status(400).json({ message: 'Specialist cannot create a job' })
        }
    } catch (err) {
        next()
    }
}

export const getJobByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await findUser({ id: req.body.decoded.id })
        if (!user) return next({ name: 'NotFoundError' })

        const jobs = await jobsByUser({ idCustomer: user.id })
        res.status(200).json({ jobs: jobs })
    } catch (err) {
        next(err)
    }
}

export const acceptJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await findUser({ id: req.body.decoded.id })
        if (!user) return next({ name: 'NotFoundError' })
        const job = await getJob({ id: req.body.idJob })
        if (!job) return next({ name: 'NotFoundError' })
        if(job.state !== JobState.PENDING) return next({name: 'Job is not pending'})

        // enum JobState {
        //     PENDING
        //     ACCEPTED
        //     REJECTED //ver este estado
        //     FINISHED
        //   }

        if (user.role === 'SPECIALIST' && job.idSpecialist === user.id) {
            const job = await stateJob({ id: req.body.idJob }, JobState.ACCEPTED)
            res.status(201).json({ message: 'Job updated', job: job })
        } else {
            res.status(400).json({ message: 'You cannot Accept a job' })
        }
    } catch (err) {
        next(err)
    }
}

export const rejectJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await findUser({ id: req.body.decoded.id })
        if (!user) return next({ name: 'NotFoundError' })
        const job = await getJob({ id: req.body.idJob })
        if (!job) return next({ name: 'NotFoundError' })

        if(job.state !== JobState.PENDING) return next({name: 'Job is not pending'})

        if (user.role === 'SPECIALIST' && job.idSpecialist === user.id) {
            const job = await stateJob({ id: req.body.idJob }, JobState.REJECTED)
            res.status(201).json({ message: 'Job updated', job: job })
        } else {
            res.status(400).json({ message: 'You cannot Accept a job' })
        }
    } catch (err) {
        next(err)
    }
}


export const finishJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await findUser({ id: req.body.decoded.id })
        if (!user) return next({ name: 'NotFoundError' })
        const job = await getJob({ id: req.body.idJob })
        if (!job) return next({ name: 'NotFoundError' })
        if (job.state !== JobState.ACCEPTED) return next({ name: 'Job is not accepted' })

        if (user.role === Role.CUSTOMER && job.idCustomer === user.id) {
            const job = await stateJob({ id: req.body.idJob }, JobState.FINISHED)
            res.status(201).json({ message: 'Job updated', job: job })
        } else {
            res.status(400).json({ message: 'You cannot Finish a job' })
        }
    } catch (err) {
        next(err)
    }
}

// model Jobs {
//     id           Int    @id @default(autoincrement())
//     state        JobState
//     idCustomer   Int
//     idSpecialist Int
//     user1        Users  @relation(fields: [idCustomer], references: [id], name: "customerJobs")
//     user2        Users  @relation(fields: [idSpecialist], references: [id], name: "specialistJobs")

//   }
