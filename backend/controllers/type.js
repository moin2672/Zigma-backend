const Type = require('../models/type');

exports.createType=(req, res, next) =>{
    // const type=req.body;
    const type=new Type({
        type: req.body.type,
        creator:req.userData.userId
    });
    type.save().then(createdType=>{
        console.log("type added success")
        console.log(createdType._id)
        res.status(201).json({
            message:"Type added successfully!",
            typeId: createdType._id
        });
    })
    .catch(error=>{
        console.log(error)
        res.status(500).json({message:'Creating a Type failed!'})
    });
}

exports.updateType=(req, res, next)=>{
    const type = new Type({
        _id:req.body._id,
        type: req.body.type,
        creator:req.userData.userId
    })
    Type.updateOne({_id:req.params.id,creator: req.userData.userId}, type)
        .then(result=>{
            console.log("updateType")
            console.log(result)
            // if(result.modifiedCount>0)
            // if(result.matchedCount>0)
            // if(result.acknowledged)
            if(result.matchedCount>0){
                res.status(200).json({message:"Type updated successfully!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Updating a Type failed!'})
        });
}

exports.getTypes=(req, res, next)=>{
    
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const typeQuery=Type.find();
    let fetchedTypes;
    if(pageSize && currentPage){
        typeQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize)
    }
    typeQuery
        .then(documents=>{
            fetchedTypes=documents;
            return Type.count();
        })
        .then(count=>{
            res.status(200).json({
                message:"Type fetched successfully", 
                types:fetchedTypes,
                maxTypes:count
            });
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Types failed!'})
        });
}

exports.getAllTypesOnly=(req, res, next)=>{
    Type.find({creator: req.userData.userId}).select({type:1, _id:0})
        .then(type=>{
            if(type){ 
                res.status(200).json({typesOnly:type})
            }else{
                res.status(404).json({message:"Extracting types only not found"});
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching types only failed!'})
        });
}

exports.getType=(req, res, next)=>{
    Type.findById(req.params.id)
        .then(type=>{
            if(type){ 
                res.status(200).json({type:type})
            }else{
                res.status(404).json({message:"Type not found"});
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Type failed!'})
        });
}

exports.deleteType=(req, res, next)=>{
    Type.deleteOne({_id:req.params.id, creator: req.userData.userId})
    .then(result=>{
        // console.log("onDelete")
        // console.log(result);
        if(result.deletedCount>0){
            res.status(200).json({message:"Type Deleted successfully!"});
        }else{
            res.status(401).json({message:"Not Authorized"})
        }
    })
    .catch(error=>{
        res.status(500).json({message:'Deleting the Type failed!'})
    });
}

exports.searchType = (req, res, next) => {
    console.log(req.query);
  
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.currentpage;
    const searchText = req.query.searchtext;
  
    console.log(req.query);
    console.log(searchText);
  
    let typeQuery = Type.find();
    let fetchedTypes;
  
    if (searchText) {
      console.log("inside");
      console.log(searchText);
      if (searchText != "") {
        var regexValue = ".*" + searchText.toLowerCase().trim() + ".*";
        const CheckValue = new RegExp(regexValue, "i");
  
        typeQuery = Type.find({ type: CheckValue });
      }
    }
  
    typeQuery
      .then((types) => {
        typesCount = types.length;
        console.log("inside types - Count");
        // console.log(typesCount)
        if (pageSize && currentPage) {
          typeQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
          // console.log("inside pagination")
        }
        typeQuery
          .clone()
          .then((types) => {
            fetchedTypes = types;
            // console.log("inside types")
            //console.log(types.length)
            //console.log(fetchedTypes.length)
          })
          .then((count) => {
            console.log("inside count");
            // console.log(count)
            // FOR DUMMY USE 'COUNT = '
            if (searchText != "" || typeof searchText != "undefined") {
              count = fetchedTypes.length;
              // console.log(count)
            }
            // console.log("typesCount=",typesCount)
            // console.log("count=",count)
            res.status(200).json({
              message: "Filtered Types fetched successfully",
              types: fetchedTypes,
              maxTypes: typesCount,
            });
          })
          .catch((error) => {
            console.log(error); //console.log("Unable to get filtered types")
            res
              .status(500)
              .json({ message: "Failed to fetch filtered Types!" });
          });
      })
      .catch((error) => {
        console.log(error);
        console.log("Unable to get typesCount");
        res.status(500).json({ message: "Failed to fetch Types Count!" });
      });
  };