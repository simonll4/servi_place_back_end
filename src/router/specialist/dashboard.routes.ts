import express from 'express';

const router = express.Router();

//TODO aca irian todas las rutas del dashboard del especialista
// los GET, POST... etc
//
//

router.post('/', (req, res) => {
  res.send('Dashboard del especialista');
});



export default router;