var db = ' your uri';
var utils = require('./utils.js');
var srcTable = 'collection name';
var destTable = 'collection name';
var findCondition = {....}; //example {employeeId: empId}
var operation = 'move'; //should be either move or copy
var utilObject = utils.base(db, srcTable, destTable, findCondition, operation);

utilObject.validateInputs(function(err, result) {
    if (err) {
        console.log("Some problem with the inputs.Fix and rerun");
        console.log(err);
    } else {
        console.log("No problem found with inputs.Starting operation now");
        utilObject.moveOrCopy(function(err, result) {
            if (err) {
                console.log("Some problem With operation.Please check");
                console.log(err);
            } else {
                console.log("Success!!!");
            }

        });
    }


});