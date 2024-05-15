import { type Categories } from '@prisma/client'
import prisma from './models/categories'

type createCategorieType = Pick<Categories, 'name' >
type getCategorieType = Pick<Categories, 'id' >

export const createCategory = async (category: createCategorieType) => {
    return await prisma.create({
        data: {
            name: category.name
        }
    })
}

export const getCategory = async (id: getCategorieType) => {
    return await prisma.findUnique({
        where: {
            id: id.id
        }
    })
}

// model Categories {
//     id             Int            @id @default(autoincrement())
//     name           String
//     userCategories UserCategory[]
//     articles       Articles[]
//     createdAt      DateTime       @default(now())
//     updatedAt      DateTime       @updatedAt
//   }