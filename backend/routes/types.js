const express =  require('express');
const router=express.Router();

const TypeController=require('../controllers/type');
const checkAuth= require("../middleware/check-auth");

router.get('/search',TypeController.searchType);
router.get('/typeonly',checkAuth,TypeController.getAllTypesOnly);
router.get('',TypeController.getTypes);
router.get('/:id',TypeController.getType);
router.post('',checkAuth,TypeController.createType)
router.put('/:id',checkAuth,TypeController.updateType);
router.delete('/:id',checkAuth,TypeController.deleteType);

// router.post('',TypeController.createType)
// router.put('/:id',TypeController.updateType);
// router.delete('/:id',TypeController.deleteType);

module.exports=router;
