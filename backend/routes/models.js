const express =  require('express');
const router=express.Router();

const ModelController=require('../controllers/model');
const checkAuth= require("../middleware/check-auth");

router.get('/search',ModelController.searchModel);
router.get('',ModelController.getModels);
router.get('/:id',ModelController.getModel);
router.post('',checkAuth,ModelController.createModel)
router.put('/:id',checkAuth,ModelController.updateModel);
router.delete('/:id',checkAuth,ModelController.deleteModel);

// router.post('',ModelController.createModel)
// router.put('/:id',ModelController.updateModel);
// router.delete('/:id',ModelController.deleteModel);

module.exports=router;
