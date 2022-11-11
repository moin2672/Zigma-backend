const express =  require('express');
const router=express.Router();

const StatusController=require('../controllers/status');
const checkAuth= require("../middleware/check-auth");

router.get('/search',StatusController.searchStatus);
router.get('/statusonly',checkAuth,StatusController.getAllStatusOnly);
router.get('',StatusController.getStatuses);
router.get('/:id',StatusController.getStatus);
router.post('',checkAuth,StatusController.createStatus)
router.put('/:id',checkAuth,StatusController.updateStatus);
router.delete('/:id',checkAuth,StatusController.deleteStatus);

// router.post('',StatusController.createStatus)
// router.put('/:id',StatusController.updateStatus);
// router.delete('/:id',StatusController.deleteStatus);

module.exports=router;
