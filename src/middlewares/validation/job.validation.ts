import { z } from 'zod';


const name_schema = z.string().min(4, { message: 'Name must be at least 4 characters long' });
const description_schema = z.string().min(4, { message: 'Description must be at least 4 characters long' });


const jobBody = z.object({
  name: name_schema,
  description: description_schema,

});

export const jobSchema = z.object({
  body: jobBody
});

// model Jobs {
//   id           Int      @id @default(autoincrement())
//   name         String
//   description  String
//   state        JobState
//   idCustomer   Int
//   idSpecialist Int
//   idReview     Int
//   user1        Users    @relation(fields: [idCustomer], references: [id], name: "customerJobs")
//   user2        Users    @relation(fields: [idSpecialist], references: [id], name: "specialistJobs")
//   review       Reviews?
//   createdAt  DateTime   @default(now())
//   updatedAt  DateTime   @updatedAt
// }
