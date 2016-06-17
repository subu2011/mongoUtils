# README #

There is many a times requirement to move or copy rows between one collection/table to another in applications
While this can be done easily in RDBMS I was not able to found a simple utility to do the same in MongoDB,
mainly due to _id handling. 

So this is a generic utility to do either move or copy in MongoDB using single command

I had tested this with Node 12, MongoDB 3.2 and Monk driver, but should work mostly with any recent version of 
node/noSQL i think. Basic validations are done and using closure  to prevent different validate and operation inputs

Please feel free to customize,add validations exception handling etc to suit your needs

Utility handles only single row per call, use async arrays in calling program to handle multiple rows