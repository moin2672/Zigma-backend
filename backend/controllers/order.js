const Order = require('../models/order');

isNumeric = (num) => {
    return !isNaN(num);
}
padLeft = (nr, n, str) => {
    return Array(n - String(nr).length + 1).join(str || "0") + nr;
}

exports.createOrder=(req, res, next) =>{

    let namingConvention="ZIGMA "

    let fetchedOrders;
    let lastOrder;
    let genBillNoVal="";

    Order.find()
        .then(orders => {
            fetchedOrders = orders;
            return Order.countDocuments();
        })
        .then(count => {
            if (fetchedOrders[count - 1]) {
                lastOrder = fetchedOrders[count - 1]
            } else {
                lastOrder = { orderBillNo: "0" }
            }
            let lastOrderBillNo = lastOrder.orderBillNo;
            let maxOrderCount = count;
            let lastBillNo_num = 0;
            console.log("********=")
            console.log("lastOrderBillNo=",lastOrderBillNo)
            console.log("maxOrderCount=",maxOrderCount)
            console.log("********=")
            let billNoAr = lastOrderBillNo.split(" ");

            for (let i = 0; i < billNoAr.length; i++) {
                if (isNumeric(billNoAr[i].trim())) {
                    lastBillNo_num = Number(billNoAr[i].trim());
                    if (lastBillNo_num >= maxOrderCount) {
                        genBillNoVal =
                        namingConvention + padLeft(lastBillNo_num + 1, 5, "0");
                    } else {
                        genBillNoVal =
                        namingConvention + padLeft(maxOrderCount + 1, 5, "0");
                    }
                }
            }
            const order=new Order({
                customerPhoneNo: req.body.customerPhoneNo,
                orderBillNo:genBillNoVal,
                orderType: req.body.orderType,
                orderModelNo: req.body.orderModelNo,
                orderDescription: req.body.orderDescription,
                totalAmount: req.body.totalAmount,
                amountPaid: req.body.amountPaidToday,
                amountPaidToday: req.body.amountPaidToday,
                transactionType: req.body.transactionType,
                transactionSummary: req.body.transactionSummary,
                orderStatus:req.body.orderStatus,
                image: req.body.image,
                lastUpdatedDate: req.body.lastUpdatedDate,
                creator:req.userData.userId
            });
            console.log("order=", order)
            order.save().then(createdOrder=>{
                console.log("order added success")
                console.log(createdOrder._id)
                res.status(201).json({
                    message:"Order added successfully!",
                    orderId: createdOrder._id
                });
            })
            .catch(error=>{
                console.log(error)
                res.status(500).json({message:'Creating a Order failed!'})
            });

        }).catch(error=>{
            console.log("error in id generation:", error)
        })

    
}

exports.updateOrder=(req, res, next)=>{
    let _amountPaid=req.body.amountPaid+req.body.amountPaidToday
    const order = new Order({
        _id:req.body._id,
        customerPhoneNo: req.body.customerPhoneNo,
        orderBillNo: req.body.orderBillNo,
        orderType: req.body.orderType,
        orderModelNo: req.body.orderModelNo,
        orderDescription: req.body.orderDescription,
        totalAmount: req.body.totalAmount,
        amountPaid: _amountPaid,
        amountPaidToday: req.body.amountPaidToday,
        transactionType: req.body.transactionType,
        transactionSummary: req.body.transactionSummary,
        orderStatus:req.body.orderStatus,
        image: req.body.image,
        lastUpdatedDate: req.body.lastUpdatedDate,
        creator:req.userData.userId
    })
    Order.updateOne({_id:req.params.id,creator: req.userData.userId}, order)
        .then(result=>{
            console.log("updateOrder")
            console.log(result)
            // if(result.modifiedCount>0)
            // if(result.matchedCount>0)
            // if(result.acknowledged)
            if(result.matchedCount>0){
                res.status(200).json({message:"Order updated successfully!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch(error=>{
            console.log(error)
            res.status(500).json({message:'Updating a Order failed!'})
        });
}

exports.getOrders=(req, res, next)=>{
    
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const orderQuery=Order.find();
    let fetchedOrders;
    if(pageSize && currentPage){
        orderQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize)
    }
    orderQuery
        .then(documents=>{
            fetchedOrders=documents;
            return Order.count();
        })
        .then(count=>{
            res.status(200).json({
                message:"Order fetched successfully", 
                orders:fetchedOrders,
                maxOrders:count
            });
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Orders failed!'})
        });
}

exports.getOrder=(req, res, next)=>{
    Order.findById(req.params.id)
        .then(order=>{
            if(order){ 
                res.status(200).json({order:order})
            }else{
                res.status(404).json({message:"Order not found"});
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Order failed!'})
        });
}


exports.deleteOrder=(req, res, next)=>{
    console.log("inside delete order")
    Order.deleteOne({_id:req.params.id, creator: req.userData.userId})
    .then(result=>{
        // console.log("onDelete")
        // console.log(result);
        if(result.deletedCount>0){
            res.status(200).json({message:"Order Deleted successfully!"});
        }else{
            res.status(401).json({message:"Not Authorized"})
        }
    })
    .catch(error=>{
        res.status(500).json({message:'Deleting the Order failed!'})
    });
}

exports.searchOrder = (req, res, next)=>{

    console.log(req.query)

    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.currentpage;

    const orderedFromDate= req.query.orderedFromDate;
    const orderedToDate= req.query.orderedToDate;
    const orderStatus= req.query.orderStatus;
    const orderType= req.query.orderType;
    const orderModelNo= req.query.orderModelNo;
    const customerPhoneNo= req.query.customerPhoneNo;

    console.log(req.query);
    // console.log(searchText)
            
    let orderQuery=Order.find();
    let fetchedOrders;
    
    if(orderedFromDate!="null" && orderedFromDate!=="" && orderedToDate!="null" && orderedToDate!==""){
        console.log("date")
        orderQuery= Order.find({lastUpdatedDate:{$gte:orderedFromDate, $lte: orderedToDate}})
    }
    if(orderStatus!="null" && orderStatus!==""){
        console.log("status")
        orderQuery=orderQuery.clone().find({orderStatus: new RegExp(".*" + orderStatus.trim() + ".*", "i")})
    }
    if(orderType!="null" && orderType!==""){
        console.log("type")
        orderQuery=orderQuery.clone().find({orderType: new RegExp(".*" + orderType.trim() + ".*", "i")})
    }
    if(orderModelNo!="null" && orderModelNo!==""){
        console.log("modelno")
        orderQuery=orderQuery.clone().find({orderModelNo: new RegExp(".*" + orderModelNo.trim() + ".*", "i")})
    }
    if(customerPhoneNo!="null" && customerPhoneNo!=""){
        console.log("phoneno")
        orderQuery=orderQuery.clone().find({customerPhoneNo: new RegExp(".*" + customerPhoneNo.trim() + ".*", "i")})
    }

    orderQuery.then(documents=>{
        console.log("getting total count");
        ordersCount = documents.length;

        // console.log("inside pagination")
        if (pageSize && currentPage) {
            orderQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }

        //console.log(fetchedOrders.length)
        orderQuery
          .clone()
          .then((orders) => {
            fetchedOrders = orders;
            // console.log("inside orders")
            //console.log(orders.length)
          }).then(()=>{
            res.status(200).json({
                message: "Filtered Orders fetched successfully",
                orders: fetchedOrders,
                maxOrders: ordersCount,
              });
          }) .catch((error) => {
            console.log(error); //console.log("Unable to get filtered orders")
            res.status(500).json({ message: "Failed to fetch filtered Orders!" });
          });

    }).catch((error) => {
        console.log(error);
        console.log("Unable to get ordersCount");
        res.status(500).json({ message: "Failed to fetch Orders Count!"});
      });


    // orderQuery
    //     .then(documents=>{
    //         fetchedOrders=documents;
    //         console.log("fetchedOrders=",fetchedOrders)
    //         return fetchedOrders.length;
    //     })
    //     .then(count=>{
    //         res.status(200).json({
    //             message:"Filtered Order fetched successfully", 
    //             orders:fetchedOrders,
    //             maxOrders:count
    //         });
    //     })
    //     .catch(error=>{
    //         res.status(500).json({message:'Fetching Filtered Orders failed!'})
    //     });

}