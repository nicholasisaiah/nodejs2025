const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middlewares/roleMiddleware');
// const verifyToken = require('../middlewares/authMiddleware'); // pastikan path benar
// const authorizeRoles = require('../middlewares/roleMiddleware');

router.use(isAdmin); // pastikan middleware ini bekerja
// router.use(verifyToken);
// router.use(authorizeRoles('admin'));

router.get('/', adminController.adminPage);
router.post('/user/update/:id', adminController.updateUser);
router.post('/user/delete/:id', adminController.deleteUser);
router.post('/record/delete/:id', adminController.deleteRecord);

module.exports = router;
