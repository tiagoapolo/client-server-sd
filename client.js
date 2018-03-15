var net = require('net');
var session_id = null
var client = new net.Socket();


var stdin = process.stdin;
stdin.resume();
stdin.setEncoding( 'utf8' );



client.connect(8124, '127.0.0.1', function() {
	console.log('Connected');

	// client.write(JSON.stringify({ id: process.argv[2]}));

	// session_id = process.argv[2]

	if(process.argv[2] === "admin"){
		
		if(!process.argv[3]){
			console.log('Parametro ID')
			process.exit()
		}

		if(!process.argv[4]){
			console.log('Parametro Balance')
			process.exit()
		} else if (process.argv[4] === "remove") {

			client.write(JSON.stringify({id: process.argv[2], data: process.argv[3], balance: process.argv[4], remove: true, role: 'user'}))
		
		} else {
			
			client.write(JSON.stringify({id: process.argv[2], data: process.argv[3], balance: process.argv[4], role: 'user'}))
		}

		
									
			// write the key to stdout all normal like
			// process.stdout.write( key );
		

	} else {

		stdin.on( 'data', function( key ){
			// ctrl-c ( end of text )
			if ( key === '\u0003' ) {
				client.end()
				process.exit();
			}
			// process.stdout.write( key )
			client.write(JSON.stringify({id: process.argv[2], data: key, role: 'user'}))
			// write the key to stdout all normal like
			// process.stdout.write( key );
		});
	}


});

client.on('data', function(data) {
	console.log('Received: ' + data.toString());
	if(data.toString() === "no user") {
		console.log('Access denied')
		client.end()
		process.exit()
	}

});

client.on('close', function() {
	console.log('Connection closed');
	process.exit();

});

client.on('error', (err) => {
    throw err;
});

