import express from 'express';

import { getProfileInformation } from '../../controllers/users.information.controller';


const router = express.Router();

// actions that the client can perform from a third party profile or information that he can see
router.get('/userInformation', getProfileInformation);

export default router;