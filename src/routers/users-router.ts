import express from 'express'
import UserController from '../controllers/UserController';

const usersRouter = express.Router();
//const controller = new UserController();

usersRouter.get('/test', (req, res) => {
    res.send('Test ok');
});

usersRouter.get('/ctrl', UserController.ctrl);
usersRouter.get('/clear-cache', UserController.clearCacheFind);
usersRouter.get('/test-error', UserController.findErrorTest);
usersRouter.get('/', UserController.find);


export default usersRouter;