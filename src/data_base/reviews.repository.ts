import { Reviews } from '@prisma/client'
import prisma from './models/reviews'
import { getJobs } from './jobs.repository'


type reviewType = Pick<Reviews, 'content' | 'rating' | 'idCustomer' | "idJob">

export const createReview = async (review: reviewType) => {
  return prisma.create({
    data: {
      content: review.content,
      rating: review.rating,
      idCustomer: review.idCustomer,
      idJob: review.idJob
    }
  })
}


export const summaryReviews = async (idSpecialist: number) => {

  // data job by specialist
  const jobs = await getJobs(idSpecialist);
  const jobIds = jobs.map(job => job.id);

  const reviews = await prisma.findMany({
    where: {
      idJob: {
        in: jobIds
      }
    }
  });
  const summary = reviews.reduce((acc: { [key: number]: number }, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  return summary;
}