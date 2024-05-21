import { Reviews } from '@prisma/client'
import prisma from './models/reviews'


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


