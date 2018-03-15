var db = {}
var fs = require('fs');

const net = require('net');
const crypto = require('crypto')

var id_counter = 0;

function isJSON(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

function reverse(str){
  return str.split("").reverse().join("");
}

// readDB()

const server = net.createServer((c) => {
  // 'connection' listener
  console.log('client connected');

  // const hsh = id_counter;

  // saveInDB(hsh, {
  //   data: '',
  //   balance: 100,
  //   role: 'user'
  // }).then(() => {
    readDB()
    .then(dbdata => {
      db = dbdata
      console.log('DB update 1: ', db)
      
    })
  // })



  // id_counter = id_counter + 1

  // c.write('ID '+hsh+'\r\n');

  c.on('end', () => {
    console.log('client disconnected');
  });

  c.on('data', (data) => {

    console.log('DATA 1: ', data.toString())

    if(!isJSON(data.toString())){
      console.log('is not json')
      c.write('Send only JSON')
      c.end()

      return
    }

    

    const cadeia = data.toString()
    const dados = JSON.parse(cadeia)
    console.log('DB Incoming Data: ', dados)

    const id = dados['id'].replace(/(\r\n|\n|\r)/gm,"")
    // let connection = dados['connection'] ? dados['connection'] : false
    if(db[id] && db[id].role === "admin") {

      if(dados && dados.remove === true){

        delete db[parseInt(dados.data).toString()]

          
        deleteInDB(parseInt(dados.data))
        .then(() =>{
          c.write("Deleted")
          c.end()
        })
        .catch(err => {
          c.write(err)
          c.end()
        })

      } else {

        db[parseInt(dados.data).toString()] = {
          data: "",
          balance: parseInt(dados.balance),
          role: dados.role
        }
        
        console.log('BASE: ', db)
  
        saveInDB(parseInt(dados.data), {
          data: "",
          balance: parseInt(dados.balance),
          role: dados.role
        })
        .then(() =>{
          c.write("Added")
          c.end()
        })
        .catch(err => {
          c.write(err)
          c.end()
        })

      }
      


      

    } else if(db[id]){            
      
      if(dados && dados['data'].replace(/(\r\n|\n|\r)/gm,"") === '') {

        saveInDB(id, {
          data: "",
          balance: db[id].balance,
          role: db[id].role
        }).then(() => {
          c.write(reverse(db[id].data))
          c.end()
        })
        
        
      } else if (dados && dados['id'] && id) {
  
        let message = dados['data'].replace(/(\r\n|\n|\r)/gm,"")
        
        if(db[id].balance < message.length){
          c.write('Saldo insuficiente')
          c.end()
        } else {
          
          db[id].data = db[id].data + dados['data'].replace(/(\r\n|\n|\r)/gm,"")
          db[id].balance = db[id].balance - message.length >= 0 ? db[id].balance - message.length : 0
          
          console.log('DB: ', db)

          saveInDB(id, {
            data: db[id].data,
            balance: db[id].balance,
            role: db[id].role
          })
                          
        }
        
      }

    } else {
      c.write('no user')
      c.end()
      return
    }

  });
})


server.on('error', (err) => {
  throw err;
});
server.listen(8081, () => {
  console.log('server bound');
});



// fs.writeFile('db.json', json, 'utf8', callback);


function saveInDB(hash, info){

  return new Promise(resolve => {
  fs.readFile('db.json', 'utf8', (err, data)=>{
      if (err){
          console.log(err);
      } else {

      try {

        obj = JSON.parse(data); //now it an object

        obj[hash] = info; //add some data

        json = JSON.stringify(obj); //convert it back to json

        fs.writeFile('db.json', json, 'utf8',() => {
          resolve()
          
        }); // write it back       

      } catch (err) {
        console.log('err: ',err)
        return
      }
      
    }
  });

  })
}


function deleteInDB(hash){

  return new Promise(resolve => {
  fs.readFile('db.json', 'utf8', (err, data)=>{
      if (err){
          console.log(err);
      } else {

      try {

        obj = JSON.parse(data); //now it an object

        delete obj[hash] //add some data

        json = JSON.stringify(obj); //convert it back to json

        fs.writeFile('db.json', json, 'utf8',() => {
          resolve()
          
        }); // write it back       

      } catch (err) {
        console.log('err: ',err)
        return
      }
      
    }
  });

  })
}



function readDB() {

  return new Promise((resolve, reject) => {

  
  fs.readFile('db.json', 'utf8', (err, data)=> {
      if (err) {
        console.log(err);
        reject(err)
      } else {

        obj = JSON.parse(data);

        console.log('REad: ', obj)

        resolve(obj)
      }
    })

  })
}

