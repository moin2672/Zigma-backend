const express =  require('express');
const router=express.Router();

const CustomerController=require('../controllers/customer');
const checkAuth= require("../middleware/check-auth");

router.get('/search',checkAuth,CustomerController.searchCustomer);
router.get('/phone',checkAuth,CustomerController.getCustomerPhoneNos);
router.get('',CustomerController.getCustomers);
router.get('/:id',CustomerController.getCustomer);
router.post('',checkAuth,CustomerController.createCustomer)
router.put('/:id',checkAuth,CustomerController.updateCustomer);
router.delete('/:id',checkAuth,CustomerController.deleteCustomer);

// router.post('',CustomerController.createCustomer)
// router.put('/:id',CustomerController.updateCustomer);
// router.delete('/:id',CustomerController.deleteCustomer);

module.exports=router;
