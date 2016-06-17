function base(db,srcTable,destTable,findCondition,operation,callback){
var db = db;
var srcTable = srcTable;
var destTable = destTable;
var findCondition = findCondition;
var operation = operation;
var isValid = 0;

return {
	
 moveOrCopy: function(callback){
     //db: a connection uri initialized at app level
     //srcTable and destTable: name of collections 
     //findCondition any noSQL compatible syntax like {employeeId:employeeID} kind 
     //operation can be either move or copy
     //move additionally deletes from source table after successful copying
  if(isValid == 0){
	 console.log("Run validate first") ;
	 callback(6,null);
  }
  else {
	  
  switch(operation)	{
     case 'move':
        moveRow(db,srcTable,destTable,findCondition,callback);
		break;
     case 'copy':
	    copyRow(db,srcTable,destTable,findCondition,callback);
		break;
   }
  }
 },

validateInputs: function(callback) {
	var isError = 0;
	//If DB is not alive or error in srcTable or findCondition 6 will be returned
	//If there are more than 1 rows in source table then 5 will be returned
	//If operation is not specified as either move or copy then 4 will be returned
    //If destination table not specified then 3 will be returned	
	//This can be captured in calling program to show corresponding messages
	//Or implement try-catch here
	var promise = db.get(srcTable).count(findCondition);
	 promise.on('complete', function (err, doc) {
		           if(doc != 1){      				 
					isError = 1;
					isValid = 0;
					callback(5,null);  
				   }
				  if(!(operation == 'move' || operation == 'copy')){
				    isError = 1;
					isValid = 0;
				    callback(4,null);
				  }
                  if(destTable.length == 0){				
					 isError = 1;
					 isValid = 0;
				     callback(3,null);
				  }
				  if(isError == 0){
                   isValid = 1;
                   callback(null,null);				   
				  }
				 });
	 promise.on('error', function (err, doc) {
        callback(6, null);
    });
   }
  }
}

function moveRow(db,srcTable, destTable,findCondition, callback) {
   var promise1 = db.get(destTable).remove(findCondition);
   promise1.on('success', function (err, doc) {
        var promise2 = db.get(srcTable).find(findCondition);
        promise2.on('complete', function (err, doc) {
              delete doc[0]._id;
              var promise3 = db.get(destTable).insert(doc);
              promise3.on('success', function (err, doc) {
                    var promise4 = db.get(srcTable).remove(findCondition);
                    promise4.on('success', function (err, doc) {
                        callback(null, null);
                    });
                    promise4.on('error', function (err, doc) {
                    callback(6, null);
                    });
              });
              promise3.on('error', function (err, doc) {
                 callback(6, null);
              });
        });
        promise2.on('error', function (err, doc) {
            callback(6, null);
        });
    });
    promise1.on('error', function (err, doc) {
        callback(6, null);
    });
}


function copyRow(db,srcTable, destTable,findCondition, callback) {
  var promise1 = db.get(destTable).remove(findCondition);
  promise1.on('success', function (err, doc) {
        var promise2 = db.get(srcTable).find(findCondition);
        promise2.on('complete', function (err, doc) {
			  delete doc[0]._id;
			  var promise3 = db.get(destTable).insert(doc);
              promise3.on('success', function (err, doc) {
				  callback(null, null);
              });
              promise3.on('error', function (err, doc) {
			      callback(6, null);
              });
        });
        promise2.on('error', function (err, doc) {
            callback(6, null);
        });
    });
    promise1.on('error', function (err, doc) {
        callback(6, null);
    });
 }



exports.base = base;
