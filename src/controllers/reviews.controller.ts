import { NextFunction, Request, Response } from 'express'
import { createReview, summaryReviews } from '../data_base/reviews.repository'
import { reviewSchema } from '../middlewares/validation/reviews.validation'
import { zParse } from '../services/zod.service'
import { getJob, getReviewsBySpecialist } from '../data_base/jobs.repository'
import { findUser } from '../data_base/users.repository'


export const commentJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = req.body.decoded
  const { body } = await zParse(reviewSchema, req)

  try {
    const job = await getJob(body.idJob)

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    if (job.idCustomer !== user.id) {
      res.status(401).json({ error: 'You are not allowed to comment on this job' });
      return;
    }
    if (job?.state !== 'FINISHED') {
      res.status(400).json({ error: 'The job is not finished' });
      return;
    }

    const review = await createReview({ content: body.content, rating: body.rating, idCustomer: req.body.decoded.id, idJob: body.idJob })
    res.status(201).json({ message: 'Review created', review })
  } catch (error) {
    next(error)
  }
}


const getFilteredReviews = async (idSpecialist: number) => {
  const reviews = await getReviewsBySpecialist(idSpecialist);
  return reviews.map(review => {
    if (review) {
      return {
        id: review.id,
        content: review.content,
        rating: review.rating,
        idCustomer: review.idCustomer
      };
    }
    return null;
  }).filter(review => review !== null);
}

export const getReviewsByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const idSpecialist = req.params.id

  try {
    if (!findUser({ id: Number(idSpecialist) })) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    const filteredReviews = await getFilteredReviews(Number(idSpecialist))
    res.status(200).json({ reviews: filteredReviews });
  } catch (error) {
    next(error)
  }
}

export const getMyReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const filteredReviews = await getFilteredReviews(req.body.decoded.id)

    res.status(200).json({ reviews: filteredReviews });
  } catch (error) {
    next(error)
  }
}


export const getSummaryreviewsByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const specialistId = Number(req.params.id);
    const user = await findUser({ id: specialistId });

    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    if (user.role !== 'SPECIALIST') {
      res.status(400).send({ error: 'User is not a specialist' });
      return;
    }
    const summary = await summaryReviews(specialistId);

    const data = Object.entries(summary).map(([star, count]) => ({
      star: Number(star),
      count: count
    }));

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}
