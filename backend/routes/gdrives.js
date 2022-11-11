const express =  require('express');
const router=express.Router();

const GdriveController=require('../controllers/gdrive');
const checkAuth= require("../middleware/check-auth");

router.get('',GdriveController.getGdrives);
router.get('/refreshtoken/:id',GdriveController.getRefreshToken);
router.get('/:id',GdriveController.getGdrive);
router.post('',checkAuth,GdriveController.createGdrive)
router.put('/:id',checkAuth,GdriveController.updateGdrive);
router.delete('/:id',checkAuth,GdriveController.deleteGdrive);

// router.post('',GdriveController.createGdrive)
// router.put('/:id',GdriveController.updateGdrive);
// router.delete('/:id',GdriveController.deleteGdrive);

module.exports=router;
