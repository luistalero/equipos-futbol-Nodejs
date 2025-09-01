const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/by-email', userController.getUserByEmail);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/:id/status', verifyToken, userController.getUserStatus);
router.patch('/strikes', userController.updateUserStrikes);

module.exports = router;