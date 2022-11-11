const Customer = require('../models/customer');

exports.createCustomer=(req, res, next) =>{
    // const customer=req.body;
    const customer=new Customer({
        customerName: req.body.customerName,
        customerPhoneNo: req.body.customerPhoneNo,
        creator:req.userData.userId
    });
    console.log("customer=", customer)
    customer.save().then(createdCustomer=>{
        console.log("customer added success")
        console.log(createdCustomer._id)
        res.status(201).json({
            message:"Customer added successfully!",
            customerId: createdCustomer._id
        });
    })
    .catch(error=>{
        console.log(error)
        res.status(500).json({message:'Creating a Customer failed!'})
    });
}

exports.updateCustomer=(req, res, next)=>{
    const customer = new Customer({
        _id:req.body._id,
        customerName: req.body.customerName,
        customerPhoneNo: req.body.customerPhoneNo,
        creator:req.userData.userId
    })
    Customer.updateOne({_id:req.params.id,creator: req.userData.userId}, customer)
        .then(result=>{
            console.log("updateCustomer")
            console.log(result)
            // if(result.modifiedCount>0)
            // if(result.matchedCount>0)
            // if(result.acknowledged)
            if(result.matchedCount>0){
                res.status(200).json({message:"Customer updated successfully!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Updating a Customer failed!'})
        });
}

exports.getCustomers=(req, res, next)=>{
    
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const customerQuery=Customer.find();
    let fetchedCustomers;
    if(pageSize && currentPage){
        customerQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize)
    }
    customerQuery
        .then(documents=>{
            fetchedCustomers=documents;
            return Customer.count();
        })
        .then(count=>{
            res.status(200).json({
                message:"Customer fetched successfully", 
                customers:fetchedCustomers,
                maxCustomers:count
            });
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Customers failed!'})
        });
}

exports.getCustomer=(req, res, next)=>{
    Customer.findById(req.params.id)
        .then(customer=>{
            if(customer){ 
                res.status(200).json({customer:customer})
            }else{
                res.status(404).json({message:"Customer not found"});
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Customer failed!'})
        });
}



exports.getCustomerPhoneNos=(req, res, next)=>{
    Customer.find({creator: req.userData.userId}).select({customerPhoneNo:1, _id:0})
        .then(customerPhoneNos=>{
            if(customerPhoneNos){ 
                res.status(200).json({customerPhoneNos:customerPhoneNos})
            }else{
                res.status(404).json({message:"customerPhoneNo not found"});
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching customerPhoneNo failed!'})
        });
}


exports.deleteCustomer=(req, res, next)=>{
    Customer.deleteOne({_id:req.params.id, creator: req.userData.userId})
    .then(result=>{
        // console.log("onDelete")
        // console.log(result);
        if(result.deletedCount>0){
            res.status(200).json({message:"Customer Deleted successfully!"});
        }else{
            res.status(401).json({message:"Not Authorized"})
        }
    })
    .catch(error=>{
        res.status(500).json({message:'Deleting the Customer failed!'})
    });
}


exports.searchCustomer = (req, res, next)=>{

    console.log(req.query)
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.currentpage;
    const searchText= req.query.searchtext;
    
    console.log(req.query);
    console.log(searchText)
            
    let customerQuery=Customer.find();
    let fetchedCustomers;
    
    
    if(searchText){
        console.log("inside")
        console.log(searchText)
        if(searchText!=""){
        var regexValue = '\.*'+searchText.toLowerCase().trim()+'\.*';
        const CheckValue =new RegExp(regexValue,'i');
       
        customerQuery=Customer.find({$or:[{'customerName':CheckValue},{'customerPhoneNo':CheckValue}]});
        }     
    }

    customerQuery.then(documents=>{
        console.log("getting total count");
        customersCount = documents.length;
    
        // console.log("inside pagination")
        if (pageSize && currentPage) {
            customerQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }
    
        //console.log(fetchedCustomers.length)
        customerQuery
          .clone()
          .then((customers) => {
            fetchedCustomers = customers;
            // console.log("inside customers")
            //console.log(customers.length)
          }).then(()=>{
            res.status(200).json({
                message: "Filtered Customers fetched successfully",
                customers: fetchedCustomers,
                maxCustomers: customersCount,
              });
          }) .catch((error) => {
            console.log(error); //console.log("Unable to get filtered customers")
            res.status(500).json({ message: "Failed to fetch filtered Customers!" });
          });
    
    }).catch((error) => {
        console.log(error);
        console.log("Unable to get customersCount");
        res.status(500).json({ message: "Failed to fetch Customers Count!"});
      });

    // customerQuery
    //     .then(documents=>{
    //         fetchedCustomers=documents;
    //         return fetchedCustomers.length;
    //     })
    //     .then(count=>{
    //         res.status(200).json({
    //             message:"Filtered Customer fetched successfully", 
    //             customers:fetchedCustomers,
    //             maxCustomers:count
    //         });
    //     })
    //     .catch(error=>{
    //         res.status(500).json({message:'Fetching Filtered Customers failed!'})
    //     });

}