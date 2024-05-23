import { NextFunction, Request, Response } from 'express'
import { findUser } from '../data_base/users.repository'
import { jobCreate, jobsByUser, getJob, stateJob, findStartedJob } from '../data_base/jobs.repository'
import { JobState } from '@prisma/client'
import { zParse } from '../services/zod.service'
import { jobSchema } from '../middlewares/validation/job.validation'


//Le paso el id del usuario que es el que esta logueado y el id del usuario al que le quiero crear el trabajo
export const createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const specialistUser = await findUser({ id: req.body.idSpecialist });

        if (!specialistUser) {
            res.status(404).json({ error: 'Specialist not found' });
            return;
        }
        if (req.body.decoded.role === specialistUser?.role) {
            res.status(400).json({ error: 'the job created must have a specialist assigned' });
            return;
        }
        const pendingJob = await findStartedJob({ idCustomer: req.body.decoded.id, idSpecialist: specialistUser.id });
        if (pendingJob) {
            res.status(400).json({ error: 'There is already a pending or accepted job with the specialist' });
            return;
        }

        const { body } = await zParse(jobSchema, req);
        const job = await jobCreate({
            name: body.name,
            description: body.description,
            idCustomer: req.body.decoded.id,
            idSpecialist: body.idSpecialist
        });

        res.status(201).json({ message: 'Job created', job: job });

    } catch (error) {
        next(error)
    }
}

export const getJobByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const idType = req.body.decoded.role === 'CUSTOMER' ? 'idCustomer' : 'idSpecialist';
        const jobs = await jobsByUser({ [idType]: Number(req.body.decoded.id) });
        const sortedJobs = jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        res.status(200).json({ jobs: sortedJobs })
    } catch (error) {
        next(error)
    }
}

export const acceptJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = Number(req.body.decoded.id);
        const idJob = Number(req.params.id);
        const job = await getJob(idJob)

        if (!job) {
            res.status(404).json({ error: 'Not found job' });
            return;
        }
        if (!(job.idCustomer === userId) && !(job.idSpecialist === userId)) {
            res.status(400).json({ error: 'You are not the owner of the job' });
            return;
        }
        if (job.state !== JobState.PENDING) {
            res.status(400).json({ error: 'Job is not pending' });
            return;
        }

        res.status(201).json({ message: 'Job updated', job: await stateJob({ id: idJob }, JobState.ACCEPTED) })
    } catch (error) {
        next(error)
    }
}

export const rejectJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = Number(req.body.decoded.id);
        const jobId = Number(req.params.id);
        const job = await getJob(jobId);

        if (!job) {
            res.status(404).json({ message: 'Not found job' });
            return;
        }
        if (!(job.idCustomer === userId) && !(job.idSpecialist === userId)) {
            res.status(400).json({ message: 'You are not the owner of the job' });
            return;
        }
        if (job.state == JobState.ACCEPTED || job.state == JobState.PENDING) {
            res.status(201).json({ message: 'Job updated', job: await stateJob({ id: jobId }, JobState.REJECTED) })
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
        const jobId = Number(req.params.id);
        const job = await getJob(jobId)

        if (!job) {
            res.status(404).json({ error: 'Not found job' });
            return;
        }
        if (job.state !== JobState.ACCEPTED) {
            res.status(400).json({ error: 'Job is not accepted' });
            return;
        }
        res.status(201).json({ message: 'Job updated', job: await stateJob({ id: jobId }, JobState.FINISHED) })

    } catch (error) {
        next(error)
    }
}

