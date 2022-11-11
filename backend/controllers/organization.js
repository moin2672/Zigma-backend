const Organization = require('../models/organization');

exports.createOrganization=(req, res, next) =>{
    // const organization=req.body;
    const organization=new Organization({
        organizationName: req.body.organizationName,
        organizationPhoneNo: req.body.organizationPhoneNo,
        organizationWhatsAppNo: req.body.organizationWhatsAppNo,
        organizationAddress: req.body.organizationAddress,
        organizationEmail: req.body.organizationEmail,
        organizationDescription: req.body.organizationDescription,
        organizationGoogleMap: req.body.organizationGoogleMap,
        lastUpdatedDate: req.body.lastUpdatedDate,
        creator:req.userData.userId
    });
    console.log("organization=", organization)
    organization.save().then(createdOrganization=>{
        console.log("organization added success")
        console.log(createdOrganization._id)
        res.status(201).json({
            message:"Organization added successfully!",
            organizationId: createdOrganization._id
        });
    })
    .catch(error=>{
        console.log(error)
        res.status(500).json({message:'Creating a Organization failed!'})
    });
}

exports.updateOrganization=(req, res, next)=>{
    const organization = new Organization({
        _id:req.body._id,
        organizationName: req.body.organizationName,
        organizationPhoneNo: req.body.organizationPhoneNo,
        organizationWhatsAppNo: req.body.organizationWhatsAppNo,
        organizationAddress: req.body.organizationAddress,
        organizationEmail: req.body.organizationEmail,
        organizationDescription: req.body.organizationDescription,
        organizationGoogleMap: req.body.organizationGoogleMap,
        lastUpdatedDate: req.body.lastUpdatedDate,
        creator:req.userData.userId
    })
    Organization.updateOne({_id:req.params.id,creator: req.userData.userId}, organization)
        .then(result=>{
            console.log("updateOrganization")
            console.log(result)
            // if(result.modifiedCount>0)
            // if(result.matchedCount>0)
            // if(result.acknowledged)
            if(result.matchedCount>0){
                res.status(200).json({message:"Organization updated successfully!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Updating a Organization failed!'})
        });
}

exports.getOrganizations=(req, res, next)=>{
    
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const organizationQuery=Organization.find();
    let fetchedOrganizations;
    if(pageSize && currentPage){
        organizationQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize)
    }
    organizationQuery
        .then(documents=>{
            fetchedOrganizations=documents;
            return Organization.count();
        })
        .then(count=>{
            res.status(200).json({
                message:"Organization fetched successfully", 
                organizations:fetchedOrganizations,
                maxOrganizations:count
            });
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Organizations failed!'})
        });
}

exports.getOrganization=(req, res, next)=>{
    Organization.findById(req.params.id)
        .then(organization=>{
            if(organization){ 
                res.status(200).json({organization:organization})
            }else{
                res.status(404).json({message:"Organization not found"});
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Organization failed!'})
        });
}

exports.getRefreshToken=(req, res, next)=>{
    console.log("refresh token")
    console.log(req.params.id)
    Organization.findById(req.params.id)
        .then(organization=>{
            if(organization){ 
                res.status(200).json({organizationAddress:organization.organizationAddress})
            }else{
                res.status(404).json({message:"Organization organizationAddress not found"});
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Organization organizationAddress failed!'})
        });
}

exports.deleteOrganization=(req, res, next)=>{
    Organization.deleteOne({_id:req.params.id, creator: req.userData.userId})
    .then(result=>{
        // console.log("onDelete")
        // console.log(result);
        if(result.deletedCount>0){
            res.status(200).json({message:"Organization Deleted successfully!"});
        }else{
            res.status(401).json({message:"Not Authorized"})
        }
    })
    .catch(error=>{
        res.status(500).json({message:'Deleting the Organization failed!'})
    });
}