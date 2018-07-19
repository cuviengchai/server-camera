/*
Copyright 2017 Google Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

var constraints = {
  video: {
    width: 1280,
    height: 720
    }
};

navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia;
let supported = navigator.mediaDevices.getSupportedConstraints();

var video = document.querySelector('video');
const button = document.querySelector('.player-buttons');
var img = document.querySelector('img');
const canvas = document.createElement('canvas');
const canvas2 = document.createElement('canvas');
var imgJa = document.getElementById("imgJa");
var context = canvas.getContext('2d');

function handleSuccess(stream) {
  // window.stream = stream; // only to make stream available to console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('getUserMedia error: ', error);
}
button.onclick = video.onclick = function() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.className = 'grayscale';
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0);
    context.drawImage(imgJa, 20,30);


    var img_data = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = img_data.data;
    for (var i=0; i<data.length; i+=4) {
        // YCbCr Luma = 0.299*r + 0.587*g + 0.114*b
        var brightness = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
        data[i] = brightness;
        data[i+1] = brightness;
        data[i+2] = brightness;
    }

    context.putImageData(img_data, 0, 0);

    var dataURL21 = canvas.toDataURL('image/png');
    // var dataURL_jpg = canvas.toDataURL('image/jpeg');
    var ImageURL = dataURL21;
    // console.log("PNG == " + dataURL21);
    // console.log("JPG == " + dataURL_jpg);
    

// you can even pass a <form> in this constructor to add other fields
var block = ImageURL.split(";");
// var block2 = dataURL_jpg.split(";");

// console.log("Block == "+ block);
// var contentType = block[0].split(":")[1];// In this case "image/gif"
var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
// var realData2 = block2[1].split(",")[1];
// console.log("realData == "+ realData);


    var formData = new FormData(); 
    formData.append('file', realData);

    var xhr = new XMLHttpRequest();
    xhr.open('post', 'http://localhost:3000/pngUpload');
    xhr.send(formData);

    // var formData2 = new FormData(); 
    // formData2.append('file', realData2);

    // var xhr2 = new XMLHttpRequest();
    // xhr2.open('post', 'http://localhost:3000/jpgUpload');
    // xhr2.send(formData2);

    img.src = ImageURL;


  };



navigator.mediaDevices.getUserMedia(constraints).
  then(handleSuccess).catch(handleError);




function upload(){
  var fileVal=document.getElementById("uploadID");
  alert(fileVal.value);

}