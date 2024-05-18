import { NextFunction, Request, Response } from 'express'
import { findUser } from '../data_base/users.repository'
import { jobCreate, jobsByUser, getJob, stateJob, findPendingJob } from '../data_base/jobs.repository'
import { JobState } from '@prisma/client'


//Le paso el id del usuario que es el que esta logueado y el id del usuario al que le quiero crear el trabajo
export const createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const specialistUser = await findUser({ id: req.body.idUser })
        if (!specialistUser) {
            res.status(404).json({ message: 'Specialist not found' });
            return;
        }

        if (req.body.decoded.role === specialistUser?.role) {
            res.status(400).json({ message: 'the job created must have a specialist assigned' });
            return;
        }

        const pendingJob = await findPendingJob({ idCustomer: req.body.decoded.id, idSpecialist: specialistUser.id });
        if (pendingJob) {
            res.status(400).json({ message: 'There is already a pending job with the specialist' });
            return;
        }

        const job = await jobCreate({
            name: req.body.name,
            description: req.body.description,
            idCustomer: req.body.decoded.id,
            idSpecialist: specialistUser.id
        })
        res.status(201).json({ message: 'Job created', job: job })

    } catch (error) {
        next(error)
    }
}

export const getJobByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const idType = req.body.decoded.role === 'CUSTOMER' ? 'idCustomer' : 'idSpecialist';
        console.log(idType)
        const jobs = await jobsByUser({ [idType]: Number(req.body.decoded.id) });
        res.status(200).json({ jobs: jobs })
    } catch (error) {
        next(error)
    }
}

export const acceptJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const job = await getJob(req.body.idJob)
        if (!job) {
            res.status(404).json({ message: 'Not found job' });
            return;
        }

        if (job.state !== JobState.PENDING) {
            res.status(400).json({ message: 'Job is not pending' });
            return;
        }

        res.status(201).json({ message: 'Job updated', job: await stateJob({ id: req.body.idJob }, JobState.ACCEPTED) })

    } catch (error) {
        next(error)
    }
}

export const rejectJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const job = await getJob(req.body.idJob);
        if (!job) {
            res.status(404).json({ message: 'Not found job' });
            return;
        }

        if (job.state == JobState.ACCEPTED || job.state == JobState.PENDING) {
            res.status(201).json({ message: 'Job updated', job: await stateJob({ id: req.body.idJob }, JobState.REJECTED) })
        }
        else {
            res.status(400).json({ message: 'Job is not accepted or is not pending' });
            return;
        }

    } catch (error) {
        next(error)
    }
}


export const finishJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const job = await getJob(req.body.idJob)
        if (!job) {
            res.status(404).json({ message: 'Not found job' });
            return;
        }
        if (job.state !== JobState.ACCEPTED) {
            res.status(400).json({ message: 'Job is not accepted' });
            return;
        }
        res.status(201).json({ message: 'Job updated', job: await stateJob({ id: req.body.idJob }, JobState.FINISHED) })

    } catch (error) {
        next(error)
    }
}

