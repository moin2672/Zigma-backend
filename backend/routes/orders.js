const express =  require('express');
const router=express.Router();

const OrderController=require('../controllers/order');
const checkAuth= require("../middleware/check-auth");

router.get('/search',OrderController.searchOrder);
router.get('',OrderController.getOrders);
router.get('/:id',OrderController.getOrder);
router.post('',checkAuth,OrderController.createOrder)
router.put('/:id',checkAuth,OrderController.updateOrder);
router.delete('/:id',checkAuth,OrderController.deleteOrder);

// router.post('',OrderController.createOrder)
// router.put('/:id',OrderController.updateOrder);
// router.delete('/:id',OrderController.deleteOrder);

module.exports=router;
