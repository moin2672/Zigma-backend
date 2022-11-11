const Gdrive = require('../models/gdrive');

exports.createGdrive=(req, res, next) =>{
    // const gdrive=req.body;
    const gdrive=new Gdrive({
        client_id: req.body.client_id,
        client_secret: req.body.client_secret,
        redirect_url: req.body.redirect_url,
        refresh_token: req.body.refresh_token,
        creator:req.userData.userId
    });
    console.log("gdrive=", gdrive)
    gdrive.save().then(createdGdrive=>{
        console.log("gdrive added success")
        console.log(createdGdrive._id)
        res.status(201).json({
            message:"Gdrive added successfully!",
            gdriveId: createdGdrive._id
        });
    })
    .catch(error=>{
        console.log(error)
        res.status(500).json({message:'Creating a Gdrive failed!'})
    });
}

exports.updateGdrive=(req, res, next)=>{
    const gdrive = new Gdrive({
        _id:req.body._id,
        client_id: req.body.client_id,
        client_secret: req.body.client_secret,
        redirect_url: req.body.redirect_url,
        refresh_token: req.body.refresh_token,
        creator:req.userData.userId
    })
    Gdrive.updateOne({_id:req.params.id,creator: req.userData.userId}, gdrive)
        .then(result=>{
            console.log("updateGdrive")
            console.log(result)
            // if(result.modifiedCount>0)
            // if(result.matchedCount>0)
            // if(result.acknowledged)
            if(result.matchedCount>0){
                res.status(200).json({message:"Gdrive updated successfully!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Updating a Gdrive failed!'})
        });
}

exports.getGdrives=(req, res, next)=>{
    
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const gdriveQuery=Gdrive.find();
    let fetchedGdrives;
    if(pageSize && currentPage){
        gdriveQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize)
    }
    gdriveQuery
        .then(documents=>{
            fetchedGdrives=documents;
            return Gdrive.count();
        })
        .then(count=>{
            res.status(200).json({
                message:"Gdrive fetched successfully", 
                gdrives:fetchedGdrives,
                maxGdrives:count
            });
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Gdrives failed!'})
        });
}

exports.getGdrive=(req, res, next)=>{
    Gdrive.findById(req.params.id)
        .then(gdrive=>{
            if(gdrive){ 
                res.status(200).json({gdrive:gdrive})
            }else{
                res.status(404).json({message:"Gdrive not found"});
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Gdrive failed!'})
        });
}

exports.getRefreshToken=(req, res, next)=>{
    console.log("refresh token")
    console.log(req.params.id)
    Gdrive.findById(req.params.id)
        .then(gdrive=>{
            if(gdrive){ 
                res.status(200).json({refresh_token:gdrive.refresh_token})
            }else{
                res.status(404).json({message:"Gdrive refresh_token not found"});
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Gdrive refresh_token failed!'})
        });
}

exports.deleteGdrive=(req, res, next)=>{
    Gdrive.deleteOne({_id:req.params.id, creator: req.userData.userId})
    .then(result=>{
        // console.log("onDelete")
        // console.log(result);
        if(result.deletedCount>0){
            res.status(200).json({message:"Gdrive Deleted successfully!"});
        }else{
            res.status(401).json({message:"Not Authorized"})
        }
    })
    .catch(error=>{
        res.status(500).json({message:'Deleting the Gdrive failed!'})
    });
}