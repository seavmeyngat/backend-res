const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const authMiddleware = require('../middleware/authmiddleware');

console.log(authController);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getCurrentUser)
router.get('/getAll', authMiddleware, authController.getAllUsers);
router.put('/updateBy/:id', authMiddleware, authController.updateUser);
router.delete('/deleteBy/:id', authMiddleware, authController.deleteUser);

module.exports = router;

