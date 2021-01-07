import { Router } from 'express';
var router = Router();
import UserController from '../controllers/user.js';
import User from '../models/user.js';

router.get('/users', function (req, res, next) {
  var userController = new UserController(User);
  res.set("Access-Control-Allow-Origin", "http://localhost:3000");   // Enable CORS in dev environment.
  userController.readAllUsers(function (err, apiResponseStep) {
    return res.send(apiResponseStep);
  });
});

router.get('/users/:userId', function (req, res, next) {
  var userController = new UserController(User);
  res.set("Access-Control-Allow-Origin", "http://localhost:3000");   // Enable CORS in dev environment.
  userController.readUser(req.query.id, function (err, apiResponseStep) {
    return res.send(apiResponseStep);
  });
});

export default router;