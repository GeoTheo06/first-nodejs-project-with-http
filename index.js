const http = require('http');
const path = require('path');
const fs = require('fs');

//in this example, i have 2 html files which i want them to be loaded if the user visits each url.
const server = http.createServer((req, res) => {
	//build file path
	var filePath = path.join(
		__dirname,
		'public',
		req.url === '/' ? 'homepage.html' : req.url //i will take as file whatever the user puts in the url subdomain. If they leave it as it is, it will load the homepage.html.
	);
	var extension_name = path.extname(filePath);

	//initial content type
	var contentType = 'text/html';

	//check extension_name and set content type
	switch (extension_name) {
		case '.html':
			contentType = 'text/html';
			break;
		case '.json':
			contentType = 'application/JSON';
			break;
		case '.css':
			contentType = 'text/css';
			break;
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.png':
			contentType = 'image/png';
			break;
		case '.jpg':
			contentType = 'image/jpg';
			break;
	}

	//read file
	fs.readFile(filePath, (err, content) => {
		if (err) {
			if (err.code == 'ENOENT') {
				//page not found
				fs.readFile(
					path.join(__dirname, 'public', '404.html'),
					(err, content) => {
						res.writeHead(200, { 'Content-Type': 'text/html' });
						res.write(content, 'utf8');
						res.end();
					}
				);
			} else {
				//probably some other (server) error
				fs.readFile(
					path.join(__dirname, 'public', '500.html'),
					(err, content) => {
						res.writeHead(500, { 'Content-Type': 'text/html' });
						res.write(content);
						res.end();
					}
				);
			}
		} else {
			//Success! it found an actually existing page.
			res.writeHead(200, { 'Content-Type': contentType });
			res.write(content);
			res.end();
		}
	});
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
