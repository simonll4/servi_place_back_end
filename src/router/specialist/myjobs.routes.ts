import { Router } from "express";

import { acceptJob, getJobByUser, rejectJob } from "../../controllers/jobs.controller";

const router = Router();

//actions that the client can perform from their profile 

// Bring a user's jobs by taking the token id
router.get('/myJobs', getJobByUser);
//Change the status of a work from slope to accepted
router.put('/acceptJob', acceptJob);
//Change the status of a work from slope to rejected
router.put('/rejectJob', rejectJob);




export default router;