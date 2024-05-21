import { Router } from "express";

import { createJob, finishJob, getJobByUser, rejectJob } from "../../controllers/jobs.controller";
import { commentJob } from "../../controllers/reviews.controller";


const router = Router();

//actions that the client can perform from the jobs page

// Bring a user's jobs by taking the token id
router.get('/myJobs', getJobByUser);
// Create a new job
router.post('/createJob', createJob);
//Change the status of a work from slope to rejected
router.put('/rejectJob', rejectJob);
// Change the status of a work from accepted to finished
router.put('/finishJob', finishJob);
// Create a new review
router.post('/createReview',commentJob);





export default router;