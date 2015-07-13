# webrtc-4-qos
WebRTC code used for Public Safety Communications Research

## Getting Started
I will describe the setup of my development environment on OSX:

1. Download the .zip or clone this repository onto your local machine.
2. Set up the Apache server on your Mac, here is what I used: [Apache server setup for OSX](http://getgrav.org/blog/mac-os-x-apache-setup-multiple-php-versions)
3. Go to where you downloaded or cloned the code. Open the Terminal and `cd` into the `webrtc-4-qos` directory, then select all the files and folders in this directory, copy them and then paste directly into the `Sites` folder you created when setting up the Apache server. If you `cd` into the `Sites` folder you should see `index.html`, `serve_index.js`, `twoWayVideoWithChat.html`, `_assets` folder, `css` folder etc.
4. Download [Node.js](https://nodejs.org/).
5. `cd` into your `Sites` folder and type: 
   + `npm install socket.io`
   + `npm install node-static`
   + `npm install websocket`
   + `npm install express`
   

## Run The Code
Open the Terminal and `cd` into the `Sites` folder.

1. Start the Apache server by typing: `sudo apachectl start`
2. Open a new tab or window for the Terminal, `cd` into the `Sites` folder and type: `node serve_index.js`
3. Open your browser (preferably Chrome or Firefox) and type `localhost` in the url bar at the top.
4. Explore the webpage and click on the **WebRTC Demos** tab and pick a demo!
5. Learn and Enjoy!

We now have Apache serving the main index page and Node will be serving all the WebRTC pages and signaling.
   + Don't forget to kill the servers when you are done. Type `sudo apachectl stop` to kill the Apache server, and type **Ctrl-C** to kill the node server.
   

![My image](https://github.com/PSCR-Boulder-Labs/webrtc-4-qos/images/webrtc_vid2.tiff)
