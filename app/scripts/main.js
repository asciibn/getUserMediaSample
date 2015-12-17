'use strict';

(function(){
  document.addEventListener('DOMContentLoaded', onContentLoaded);
  var startButton, stopButton, uploadButton, getUM , audoContext, recorderDiv, recorderObject, isRecording, wavDataContainer;

  if (Modernizr.getusermedia) {
      getUM = Modernizr.prefixed('getUserMedia', navigator);
      audoContext = new AudioContext();
  }

function onContentLoaded(e){
  document.getElementById('startButton').addEventListener('click', onButtonEvent),
  document.getElementById('stopButton').addEventListener('click', onButtonEvent),
  document.getElementById('uploadButton').addEventListener('click', onButtonEvent);

  recorderDiv = document.getElementById('recorder');
  wavDataContainer = document.getElementById('dataUrlcontainer');
}


function onButtonEvent(e){
  switch(e.target.id){
    case 'startButton': startRecording();
     break;
    case 'stopButton': stopRecording();
     break;
    case 'uploadButton': uploadFile();
    break;
  }

  function startRecording(){
    getUM({audio: true}, onStartRecording, onRecordingFallback);
  }

  function onStartRecording(stream){
    if(isRecording === undefined || isRecording == false){
      recorderObject = new MP3Recorder(audoContext, stream);
      //recorderDiv.dataset.recorderObject = recorderObject;
      recorderObject.start();
      isRecording = true;
    }
  }

  function onRecordingFallback(e){
    console.log(e);
  }


  function stopRecording(){
    if(isRecording == true){
      recorderObject.stop();
      recorderObject.exportWAV(function(base64_wav_data){
        var url = 'data:audio/wav;base64,' + base64_wav_data;
        wavDataContainer.innerHTML = url;
        var au  = document.createElement('audio');
        au.controls = true;
        au.src = url;
        document.getElementById('playbackContainer').appendChild(au);
        recorderObject.logStatus('');
      });
      isRecording = false;
    }
  }

  function uploadFile(){
    if(isRecording == false){

        var httpRequest = new XMLHttpRequest();
        httpRequest.addEventListener('load', onLoadFile);
        httpRequest.addEventListener('progress', onProgressFile);
        httpRequest.addEventListener('error', onErrorFile);

        httpRequest.open('POST', 'http://localhost:8888/upload.php', true);
        httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        httpRequest.send({wavBase64:wavDataContainer.innerHTML});

	    }
  }

  function onLoadFile(e){
    console.log(e.target.response);
  }

  function onProgressFile(e){
    console.log(e.target.response);
  }

  function onErrorFile(e){
    console.log(e.target.response);
  }
}
})()
