const express =  require('express');
const router=express.Router();

const OrganizationController=require('../controllers/organization');
const checkAuth= require("../middleware/check-auth");

router.get('',OrganizationController.getOrganizations);
router.get('/refreshtoken/:id',OrganizationController.getRefreshToken);
router.get('/:id',OrganizationController.getOrganization);
router.post('',checkAuth,OrganizationController.createOrganization)
router.put('/:id',checkAuth,OrganizationController.updateOrganization);
router.delete('/:id',checkAuth,OrganizationController.deleteOrganization);

// router.post('',OrganizationController.createOrganization)
// router.put('/:id',OrganizationController.updateOrganization);
// router.delete('/:id',OrganizationController.deleteOrganization);

module.exports=router;
