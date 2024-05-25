import { NextFunction, Request, Response } from 'express'
import { createReview, summaryReviews } from '../data_base/reviews.repository'
import { reviewSchema } from '../middlewares/validation/reviews.validation'
import { zParse } from '../services/zod.service'
import { getJob, getReviewsBySpecialist } from '../data_base/jobs.repository'
import { findUser } from '../data_base/users.repository'


export const commentJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = req.body.decoded;
  const jobId = Number(req.params.id);


  try {
    const { body } = await zParse(reviewSchema, req);
    const job = await getJob(jobId);

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

    const review = await createReview({ content: body.content, rating: body.rating, idCustomer: req.body.decoded.id, idJob: jobId })
    res.status(201).json({ message: 'Review created', review })
  } catch (error) {
    next(error)
  }
}


const getFilteredReviews = async (idSpecialist: number) => {
  const jobs = await getReviewsBySpecialist(idSpecialist);
  return jobs.map(job => {
    if (job.review) {
      return {
        idJob: job.id,
        finishedDate: job.updatedAt,
        reviewId: job.review?.id,
        reviewContent: job.review?.content,
        reviewRating: job.review?.rating,
        reviewClientName: job.user1.name,
        reviewClientLastName: job.user1.last_name,
        reviewClientPicture: job.user1.profile_picture
      };
    }
    return null;
  }).filter(review => review !== null);
}
// {
//   id: 2,
//   name: 'a labuar 3 ',
//   description: 'te voy a pagar pquito 3',
//   state: 'FINISHED',
//   idCustomer: 3,
//   idSpecialist: 4,
//   createdAt: 2024-05-24T23:36:42.577Z,
//   updatedAt: 2024-05-24T23:38:49.577Z,
//   review: {
//     id: 2,
//     content: 'tremendo perro bien ahi',
//     rating: 4,
//     idCustomer: 3,
//     idJob: 2,
//     createdAt: 2024-05-24T23:40:13.710Z,
//     updatedAt: 2024-05-24T23:40:13.710Z
//   },
//   user1: {
//     id: 3,
//     email: 'martincliente@hotmail.com',
//     password: '$2b$10$OrvLYZlDWy/QJLs1tHWWQuxoQI7JSOvhdbzfVrrkOjVKaInZYOZbG',
//     name: 'martincliente',
//     last_name: 'cliente',
//     description: '',
//     role: 'CUSTOMER',
//     profile_picture: 'https://i.imgur.com/ez02Lc6.png',
//     createdAt: 2024-05-23T22:30:32.507Z,
//     updatedAt: 2024-05-23T22:30:32.507Z
//   }
// }




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
