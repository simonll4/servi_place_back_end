import { Router } from "express";

import { createJob, finishJob, getJobByUser, rejectJob } from "../../controllers/jobs.controller";
import { commentJob } from "../../controllers/reviews.controller";


const router = Router();

//actions that the client can perform from the jobs page

// Bring a user's jobs by taking the token id
router.get('/my-jobs', getJobByUser);
// Create a new job
router.post('/create-job', createJob);
//Change the status of a work from slope to rejected
router.put('/reject-job/:id', rejectJob);
// Change the status of a work from accepted to finished
router.put('/finish-job/:id', finishJob);
// Create a new review
router.post('/create-review', commentJob);





export default router;