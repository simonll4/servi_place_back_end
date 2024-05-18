import express from 'express'
import { acceptJob, createJob, finishJob, getJobByUser } from '../../controllers/jobs.controller'


const router = express.Router();

router.post('/createJob', createJob);
router.get('/jobsByUser', getJobByUser);
router.put('/acceptJob', acceptJob);
router.put('/finishJob', finishJob);


export default router;