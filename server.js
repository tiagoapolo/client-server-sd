var db = {}

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

const server = net.createServer((c) => {
  // 'connection' listener
  console.log('client connected');

  const hsh = id_counter;
  db[hsh] = {
    data: '',
    balance: 100,
    role: 'user'
  }

  id_counter = id_counter + 1

  c.write('ID '+hsh+'\r\n');

  c.on('end', () => {
    console.log('client disconnected');
  });

  c.on('data', (data) => {


    if(!isJSON(data.toString())){
      console.log('is not json')
      c.write('Send only JSON')
      c.end()

      return
    }

    const cadeia = data.toString()
    const dados = JSON.parse(cadeia)
    const id = dados['id'].replace(/(\r\n|\n|\r)/gm,"")

    
    if(dados && dados['data'].replace(/(\r\n|\n|\r)/gm,"") === '') {
      c.write(reverse(db[id].data))
      c.end()
      
    } else if (dados && dados['id'] && id){

      let message = dados['data'].replace(/(\r\n|\n|\r)/gm,"")
      
      if(db[id].balance < message.length){
        c.write('Saldo insuficiente')
        c.end()
      } else {
        db[id].data = db[id].data + dados['data'].replace(/(\r\n|\n|\r)/gm,"")
        db[id].balance = db[id].balance - message.length >= 0 ? db[id].balance - message.length : 0
        c.write(JSON.stringify(db[id]))
        
      }
      
    }

  });
})


server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});

