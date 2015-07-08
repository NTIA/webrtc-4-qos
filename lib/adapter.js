var call_token; // unique token for this call
var signaling_server; // signaling server for this call
var peer_connection; // peer connection object

function start() {
  // create the WebRTC peer connection object
  peer_connection = new rtc_peer_connection({ // RTCPeerConnection configuration
    "iceServers": [ // information about ice servers
      { "url": "stun:"+stun_server }, // stun server info
    ]
  });

  // generic handler that sends any ice candidates to the other peer
  peer_connection.onicecandidate = function (ice_event) {
    if (ice_event.candidate) {
      signaling_server.send(
        JSON.stringify({
          type: "new_ice_candidate",
          candidate: ice_event.candidate ,
        })
      );
    }
  };

  // display remote video streams when they arrive using local <video> MediaElement
  peer_connection.onaddstream = function (event) {
    connect_stream_to_src(event.stream, document.getElementById("remote_video"));
    // hide placeholder and show remote video
    document.getElementById("loading_state").style.display = "none";
    document.getElementById("open_call_state").style.display = "block";
  };

  // setup stream from the local camera
  setup_video();

  // setup generic connection to the signaling server using the WebSocket API
  signaling_server = new WebSocket("ws://10.7.7.121:3000");

  if (document.location.hash === "" || document.location.hash === undefined) { // you are the Caller

    // create the unique token for this call
    var token = Date.now()+"-"+Math.round(Math.random()*10000);
    call_token = "#"+token;

    // set location.hash to the unique token for this call
    document.location.hash = token;

    signaling_server.onopen = function() {
      // setup caller signal handler
      signaling_server.onmessage = caller_signal_handler;

      // tell the signaling server you have joined the call
      signaling_server.send(
        JSON.stringify({
          token:call_token,
          type:"join",
        })
      );
    }

    document.title = "You are the Caller";
    document.getElementById("loading_state").innerHTML = "Ready for a call...ask your friend to visit:<br/><br/>"+document.location;

  } else { // you have a hash fragment so you must be the Callee

    // get the unique token for this call from location.hash
    call_token = document.location.hash;

    signaling_server.onopen = function() {
      // setup caller signal handler
      signaling_server.onmessage = callee_signal_handler;

      // tell the signaling server you have joined the call
      signaling_server.send(
        JSON.stringify({
          token:call_token,
          type:"join",
        })
      );

      // let the caller know you have arrived so they can start the call
      signaling_server.send(
        JSON.stringify({
          token:call_token,
          type:"callee_arrived",
        })
      );
    }

    document.title = "You are the Callee";
    document.getElementById("loading_state").innerHTML = "One moment please...connecting your call...";
  }

}

/* functions used above are defined below */

// handler to process new descriptions
function new_description_created(description) {
  peer_connection.setLocalDescription(
    description,
    function () {
      signaling_server.send(
        JSON.stringify({
          token:call_token,
          type:"new_description",
          sdp:description
        })
      );
    },
    log_error
  );
}

// handle signals as a caller
function caller_signal_handler(event) {
  var signal = JSON.parse(event.data);
  if (signal.type === "callee_arrived") {
    peer_connection.createOffer(
      new_description_created,
      log_error
    );
  } else if (signal.type === "new_ice_candidate") {
    peer_connection.addIceCandidate(
      new RTCIceCandidate(signal.candidate)
    );
  } else if (signal.type === "new_description") {
    peer_connection.setRemoteDescription(
      new rtc_session_description(signal.sdp),
      function () {
        if (peer_connection.remoteDescription.type == "answer") {
          // extend with your own custom answer handling here
        }
      },
      log_error
    );
  } else {
    // extend with your own signal types here
  }
}

// handle signals as a callee
function callee_signal_handler(event) {
  var signal = JSON.parse(event.data);
  if (signal.type === "new_ice_candidate") {
    peer_connection.addIceCandidate(
      new RTCIceCandidate(signal.candidate)
    );
  } else if (signal.type === "new_description") {
    peer_connection.setRemoteDescription(
      new rtc_session_description(signal.sdp),
      function () {
        if (peer_connection.remoteDescription.type == "offer") {
          peer_connection.createAnswer(new_description_created, log_error);
        }
      },
      log_error
    );
  } else {
    // extend with your own signal types here
  }
}

// setup stream from the local camera
function setup_video() {
  get_user_media(
    {
      "audio": true, // request access to local microphone
      "video": true  // request access to local camera
    },
    function (local_stream) { // success callback
      // display preview from the local camera & microphone using local <video> MediaElement
      connect_stream_to_src(local_stream, document.getElementById("local_video"));
      // add local camera stream to peer_connection ready to be sent to the remote peer
      peer_connection.addStream(local_stream);
    },
    log_error
  );
}

// generic error handler
function log_error(error) {
  console.log(error);
}
