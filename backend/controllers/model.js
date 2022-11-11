const Model = require('../models/model');

var modelsCount=0;


exports.getModels = (req, res, next)=>{
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const modelQuery=Model.find().sort({lastUpdatedDate:-1});
    let fetchedModels;
    if(pageSize && currentPage){
        modelQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize)
    }
    modelQuery
        .then(models=>{
            fetchedModels=models;
            return Model.count();
        })
        .then(count=>{
            res.status(200).json({
                message:"Models fetched successfully", 
                models:fetchedModels,
                maxModels:count
            });
        })
        .catch((error)=>{
            // console.log("Unable to get models")
            res.status(500).json({message:'Failed to fetch Models!'})
        });
}

exports.searchModel = (req, res, next)=>{
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const searchText= req.query.searchtext;
    const searchType=req.query.searchtype;
console.log(req.query);
console.log(searchText)
        console.log(searchType)
    let modelQuery=Model.find().sort({lastUpdatedDate:-1});
    let fetchedModels;
    
    
    if(searchText || searchType){
        console.log("inside")
        console.log(searchText)
        console.log(searchType)
        var regexValue = '\.*'+searchText.toLowerCase().trim()+'\.*';
        const CheckValue =new RegExp(regexValue,'i');
        if(searchType==""){
            modelQuery=Model.find({$and:[{$or:[{'businessType':'Buy'},{'businessType':'Sell'}]},{$or:[{'billNo':CheckValue},{'clientName':CheckValue},{'clientPhoneNo': CheckValue},{'listOfItems.itemName':CheckValue}]}]}).sort({lastUpdatedDate:-1});    
        }else{
        modelQuery=Model.find({$and:[
            {'businessType':searchType},
            {$or:[
                {'billNo':CheckValue},{'clientName':CheckValue},{'clientPhoneNo': CheckValue},{'listOfItems.itemName':CheckValue}
            ]}
            ]}).sort({lastUpdatedDate:-1});
        }
       
       
        //.find({$or:[{'metadata.userName': CheckValue},{'metadata.originalname': CheckValue},{'clientPhoneNo': CheckValue}]}).sort({uploadDate:-1}).toArray(function(err, files){});
    }

    modelQuery
    .then(models=>{
        modelsCount=models.length;
        console.log("models - Count")
        console.log(modelsCount)
        if(pageSize && currentPage){
            modelQuery
                .skip(pageSize*(currentPage-1))
                .limit(pageSize)
        }
        modelQuery
            .then(models=>{
                fetchedModels=models;
                console.log(models)
                console.log(models.length)
                console.log(fetchedModels.length)
                // if(searchText=="" && searchType==""){
                //     modelsCount=Model.count();
                // }
                // else{
                //     modelsCount=models.length;
                // }
                // return Model.count();
            })
            .then(count=>{
                // console.log("count")
                // console.log(count)
                if((searchText!="" || searchType!="") && (typeof(searchText)!="undefined" || typeof(searchType)!="undefined")){
                    count= fetchedModels.length;
                    // console.log(count)
                }
                console.log(count)
                res.status(200).json({
                    message:"Filtered Models fetched successfully", 
                    models:fetchedModels,
                    maxModels:modelsCount
                });
            })
            .catch((error)=>{
                // console.log(error);console.log("Unable to get filtered models")
                res.status(500).json({message:'Failed to fetch filtered Models!'})
            });
    })
    .catch((error)=>{
        console.log(error);console.log("Unable to get modelsCount")
        res.status(500).json({message:'Failed to fetch Models Count!'})
    }); 
    
    console.log("modelsCount")
    console.log(modelsCount)

    
}

exports.generateModelId = (req, res, next)=>{
    
    let fetchedModels;
    let lastModel;
    
    // Model.find().sort({"_id":-1}).limit(1).then(model=>{lastModel=model}).catch(console.log("Unable to get last model"))
    // console.log(lastModel)
    Model.find()
        .then(models=>{
            fetchedModels=models;
            return Model.count();
        })
        .then(count=>{
            if(fetchedModels[count-1]){
                lastModel=fetchedModels[count-1]
            }else{
                lastModel={billNo:"0"}
            }
            res.status(200).json({
                message:"Last Model details fetched successfully!!", 
                lastModelBillNo:lastModel.billNo,
                maxModels:count
            });
        })
        .catch((error)=>{
            // console.log("Unable to get models")
            res.status(500).json({message:'Failed to fetch Model GenID!'})
        });
}

exports.getModel = (req, res, next)=>{
    Model.findById(req.params.id)
        .then(model=>{
            if(model){
                res.status(200).json({model:model})
            }else{
                res.status(404).json({message:"Model not found"});
            }
        })
        .catch((error)=>{
            // console.log("Found error in getting a Model by ID")
            res.status(500).json({message:'Failed to fetch Model by ID!'})
        })
}

exports.createModel = (req, res, next) =>{
    console.log(req.body)
    const model=new Model({
        modelNo:req.body.modelNo,
        modelName: req.body.modelName,
        modelDescription: req.body.modelDescription,
        isAvailable: req.body.isAvailable,
        lastUpdatedDate: req.body.lastUpdatedDate,
        links: req.body.links,
        creator:req.userData.userId
    });
    console.log(model);
    model.save()
        .then(createdItem=>{
            res.status(201).json({
                message:"Model added successfully!",
                modelId: createdItem._id
            });
        })
        .catch((error)=>{
            console.log(error)
            // console.log("Model NOT saved")
            res.status(500).json({message:'Failed to add Models!'})
        });
}

exports.updateModel = (req, res, next)=>{
    const model = new Model({
        _id:req.body._id,
        modelNo:req.body.modelNo,
        modelName: req.body.modelName,
        modelDescription: req.body.modelDescription,
        isAvailable: req.body.isAvailable,
        lastUpdatedDate: req.body.lastUpdatedDate,
        links: req.body.links,
        creator:req.userData.userId
    })
    
    Model.updateOne({_id:req.params.id, creator: req.userData.userId}, model)
        .then(result=>{
            console.log(result)
            
            if(result.matchedCount>0){
                res.status(200).json({message:"Model updated successfully!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch((error)=>{
            // console.log("Model not updated")
            res.status(500).json({message:'Failed to update Models!'})
        })
}

exports.deleteModel = (req, res, next)=>{
    console.log(req.params.id)
    Model.deleteOne({_id:req.params.id, creator: req.userData.userId})
        .then(result=>{
            console.log(result);
            
            if(result.deletedCount>0){
                res.status(200).json({message:"Model Deleted!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch((error)=>{
            // console.log("Model NOT deleted")
            res.status(500).json({message:'Failed to delete Models!'})
        })
}

exports.searchModel = (req, res, next)=>{

    console.log(req.query)
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.currentpage;
    const searchText= req.query.searchtext;
    
    console.log(req.query);
    console.log(searchText)
            
    let modelQuery=Model.find();
    let fetchedModels;
    
    
    if(searchText){
        console.log("inside")
        console.log(searchText)
        if(searchText!=""){
        var regexValue = '\.*'+searchText.toLowerCase().trim()+'\.*';
        const CheckValue =new RegExp(regexValue,'i');
       
        modelQuery=Model.find({$or:[{'modelNo':CheckValue},{'modelName':CheckValue},{'modelDescription':CheckValue}]});
        }     
    }
    
    modelQuery.then(documents=>{
        console.log("getting total count");
        modelsCount = documents.length;
    
        // console.log("inside pagination")
        if (pageSize && currentPage) {
            modelQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }
    
        //console.log(fetchedModels.length)
        modelQuery
          .clone()
          .then((models) => {
            fetchedModels = models;
            // console.log("inside models")
            //console.log(models.length)
          }).then(()=>{
            res.status(200).json({
                message: "Filtered Models fetched successfully",
                models: fetchedModels,
                maxModels: modelsCount,
              });
          }) .catch((error) => {
            console.log(error); //console.log("Unable to get filtered models")
            res.status(500).json({ message: "Failed to fetch filtered Models!" });
          });
    
    }).catch((error) => {
        console.log(error);
        console.log("Unable to get modelsCount");
        res.status(500).json({ message: "Failed to fetch Models Count!"});
      });

    // modelQuery
    //     .then(documents=>{
    //         fetchedModels=documents;
    //         return fetchedModels.length;
    //     })
    //     .then(count=>{
    //         res.status(200).json({
    //             message:"Filtered Model fetched successfully", 
    //             models:fetchedModels,
    //             maxModels:count
    //         });
    //     })
    //     .catch(error=>{
    //         res.status(500).json({message:'Fetching Filtered Models failed!'})
    //     });

}