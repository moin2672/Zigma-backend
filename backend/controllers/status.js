const Status = require('../models/status');

exports.createStatus=(req, res, next) =>{
    // const status=req.body;
    const status=new Status({
        status: req.body.status,
        creator:req.userData.userId
    });
    status.save().then(createdStatus=>{
        console.log("status added success")
        console.log(createdStatus._id)
        res.status(201).json({
            message:"Status added successfully!",
            statusId: createdStatus._id
        });
    })
    .catch(error=>{
        console.log(error)
        res.status(500).json({message:'Creating a Status failed!'})
    });
}

exports.updateStatus=(req, res, next)=>{
    const status = new Status({
        _id:req.body._id,
        status: req.body.status,
        creator:req.userData.userId
    })
    Status.updateOne({_id:req.params.id,creator: req.userData.userId}, status)
        .then(result=>{
            console.log("updateStatus")
            console.log(result)
            // if(result.modifiedCount>0)
            // if(result.matchedCount>0)
            // if(result.acknowledged)
            if(result.matchedCount>0){
                res.status(200).json({message:"Status updated successfully!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Updating a Status failed!'})
        });
}

exports.getStatuses=(req, res, next)=>{
    
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const statusQuery=Status.find();
    let fetchedStatuses;
    if(pageSize && currentPage){
        statusQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize)
    }
    statusQuery
        .then(documents=>{
            fetchedStatuses=documents;
            return Status.count();
        })
        .then(count=>{
            res.status(200).json({
                message:"Status fetched successfully", 
                statuses:fetchedStatuses,
                maxStatuses:count
            });
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Statuses failed!'})
        });
}

exports.getAllStatusOnly=(req, res, next)=>{
    Status.find({creator: req.userData.userId}).select({status:1, _id:0})
        .then(status=>{
            if(status){ 
                res.status(200).json({statusesOnly:status})
            }else{
                res.status(404).json({message:"Extracting status only not found"});
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching status only failed!'})
        });
}


exports.getStatus=(req, res, next)=>{
    Status.findById(req.params.id)
        .then(status=>{
            if(status){ 
                res.status(200).json({status:status})
            }else{
                res.status(404).json({message:"Status not found"});
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Status failed!'})
        });
}

exports.deleteStatus=(req, res, next)=>{
    Status.deleteOne({_id:req.params.id, creator: req.userData.userId})
    .then(result=>{
        // console.log("onDelete")
        // console.log(result);
        if(result.deletedCount>0){
            res.status(200).json({message:"Status Deleted successfully!"});
        }else{
            res.status(401).json({message:"Not Authorized"})
        }
    })
    .catch(error=>{
        res.status(500).json({message:'Deleting the Status failed!'})
    });
}

exports.searchStatus = (req, res, next) => {
    console.log(req.query);
  
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.currentpage;
    const searchText = req.query.searchtext;
  
    console.log(req.query);
    console.log(searchText);
  
    let statusQuery = Status.find();
    let fetchedStatuses;
  
    if (searchText) {
      console.log("inside");
      console.log(searchText);
      if (searchText != "") {
        var regexValue = ".*" + searchText.toLowerCase().trim() + ".*";
        const CheckValue = new RegExp(regexValue, "i");
  
        statusQuery = Status.find({ status: CheckValue });
      }
    }
  
    statusQuery
      .then((statuses) => {
        statusesCount = statuses.length;
        console.log("inside statuses - Count");
        // console.log(statusesCount)
        if (pageSize && currentPage) {
          statusQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
          // console.log("inside pagination")
        }
        statusQuery
          .clone()
          .then((statuses) => {
            fetchedStatuses = statuses;
            // console.log("inside statuses")
            //console.log(statuses.length)
            //console.log(fetchedStatuses.length)
          })
          .then((count) => {
            console.log("inside count");
            // console.log(count)
            // FOR DUMMY USE 'COUNT = '
            if (searchText != "" || typeof searchText != "undefined") {
              count = fetchedStatuses.length;
              // console.log(count)
            }
            // console.log("statusesCount=",statusesCount)
            // console.log("count=",count)
            res.status(200).json({
              message: "Filtered Statuses fetched successfully",
              statuses: fetchedStatuses,
              maxStatuses: statusesCount,
            });
          })
          .catch((error) => {
            console.log(error); //console.log("Unable to get filtered statuses")
            res
              .status(500)
              .json({ message: "Failed to fetch filtered Statuses!" });
          });
      })
      .catch((error) => {
        console.log(error);
        console.log("Unable to get statusesCount");
        res.status(500).json({ message: "Failed to fetch Statuses Count!" });
      });
  };