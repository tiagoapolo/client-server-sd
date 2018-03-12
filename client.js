var net = require('net');
var session_id = null
var client = new net.Socket();


var stdin = process.stdin;
stdin.resume();
stdin.setEncoding( 'utf8' );



client.connect(8124, '127.0.0.1', function() {
	console.log('Connected');
	// client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
	console.log('Received: ' + data.toString());

	 if (data && data.toString().includes('ID')){
		
		session_id = data.toString().split(' ')[1]
		console.log('My ID is: ', session_id)

		stdin.on( 'data', function( key ){
			// ctrl-c ( end of text )
			if ( key === '\u0003' ) {
				client.end()
				process.exit();
			}

			client.write(JSON.stringify({id: session_id, data: key, role: 'user'}))
			// write the key to stdout all normal like
			// process.stdout.write( key );
		});

	}
	// client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
	process.exit();

});

client.on('error', (err) => {
    throw err;
});

