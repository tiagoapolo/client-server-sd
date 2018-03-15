var fs = require('fs');
// fs.writeFile('db.json', json, 'utf8', callback);




fs.readFile('db.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); //now it an object
    console.log('File data: ', obj)
    // obj.table.push({id: 2, square:3}); //add some data
    // json = JSON.stringify(obj); //convert it back to json
    // fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back 
}});

