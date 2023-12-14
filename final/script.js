//noise generate
// https://noisehack.com/generate-noise-web-audio-api/
var supportsES6 = function() {
    try {
      new Function("(a = 0) => a");
      return true;
    }
    catch (err) {
      return false;
    }
  }();
  
var Noise = (function () {

  "use strict";
  
  if (!supportsES6) {return;}

  const audioContext = new(window.AudioContext || window.webkitAudioContext);
  
  let fadeOutTimer;
  
  function createNoise(track) {
    var colorInput = document.getElementById("pickedColor");
    
    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
      } : null;
    }

    var mappingColor = hexToRgb(colorInput.value);
    
    var input = [mappingColor.r, mappingColor.g, mappingColor.b];
    
    var randomColor=(input[0]+input[1]+input[2])/765;
    
    var lastOut = 0.0;
    var b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    

    const bufferSize = 4096;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    //white noise
    if(input[0]>=input[1]&&input[0]>=input[2]){
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (1-randomColor) * Math.random() * 2 - 1;
      }}else{//pink noise
        if(input[1]>=input[2]){for (let i = 0; i < bufferSize; i++) {
          var white = (1-randomColor) * Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11; 
                b6 = white * 0.115926;}
        }else{//brownian noise
          for (let i = 0; i < bufferSize; i++) {
          var white = (1-randomColor) * Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5;}
        }
      }
    
    track.audioSource.buffer = noiseBuffer;
  }
  
  function fadeNoise(track) {
    if (track.fadeOut) {
      track.fadeOut = (track.fadeOut >= 0) ? track.fadeOut : 0.5;
    } else {
      track.fadeOut = 0.5;
    }

    if (track.canFade) {
      track.gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + track.fadeOut);

      track.canFade = false;

      fadeOutTimer = setTimeout(() => {
      }, track.fadeOut * 1000);
    } else {
      stopNoise(track);
    }

  }

  function buildTrack(track) {
    track.audioSource = audioContext.createBufferSource();
    track.gainNode = audioContext.createGain();
    track.audioSource.connect(track.gainNode);
    track.gainNode.connect(audioContext.destination);
    track.canFade = true; 
  }
  
  function setGain(track) {
    track.volume = (track.volume >= 0) ? track.volume : 0.5;
    
    if (track.fadeIn) {
      track.fadeIn = (track.fadeIn >= 0) ? track.fadeIn : 0.5;
    } else {
      track.fadeIn = 0.5;
    }

    track.gainNode.gain.setValueAtTime(0, audioContext.currentTime);

    track.gainNode.gain.linearRampToValueAtTime(track.volume / 4, audioContext.currentTime + track.fadeIn / 2);

    track.gainNode.gain.linearRampToValueAtTime(track.volume, audioContext.currentTime + track.fadeIn);

  }

  function stopNoise(track) {
    if (track.audioSource) {
      clearTimeout(fadeOutTimer);
      track.audioSource.stop();
    }
  }

  function playNoise(track) {
    stopNoise(track);
    buildTrack(track);
    createNoise(track);
    setGain(track);
    track.audioSource.loop = true;
    track.audioSource.playbackRate.value = 0.05;
    track.audioSource.start();
  }

  return {
    play : playNoise,
    fade : fadeNoise
  }

}());

var noise = {
  volume: 0.05, 
  fadeIn: 2.5, 
  fadeOut: 1.3, 
};


//breathe animation
const breathCircle = document.getElementById('breathCircleBig');
const breathWord = document.getElementById('breathWord');
const breathCircle1 = document.getElementById('breathCircle1');
const breathCircle2 = document.getElementById('breathCircle2');
const breathCircle3 = document.getElementById('breathCircle3');
const backShape1 = document.getElementById('backShape1');
const backShape2 = document.getElementById('backShape2');

function breatheAnimation() {
    breathCircle.style.transform = 'scale(1)';
    breathCircle.style.backgroundColor = '#3E97B0';

    // Inhale
    setTimeout(() => {
      breathCircle.style.transform = 'scale(1.8)';
      breathCircle.style.transition = '4s';
      breathCircle.style.background = getColor();
      breathCircle1.style.background = getColor();
      breathCircle2.style.background = getColor();
      breathCircle3.style.background = getColor();
      backShape1.style.background = getColor();
      backShape2.style.background = getColor();
      breathWord.textContent = 'Breathe In';
      breathWord.style.position = 'relative';
      breathWord.style.font = '10em';
    }, 0);

    // Hold breath
    setTimeout(() => {
      breathCircle.style.transform = 'scale(1.8)';
      breathCircle.style.transition = '6s';
      breathCircle.style.background = getColor();
      breathCircle1.style.background = getColor();
      breathCircle2.style.background = getColor();
      breathCircle3.style.background = getColor();
      backShape1.style.background = getColor();
      backShape2.style.background = getColor();
      breathWord.textContent = 'Hold';
      breathWord.style.position = 'relative';
    }, 4000);

    // Exhale
    setTimeout(() => {
      breathCircle.style.transform = 'scale(1)';
      breathCircle.style.transition = '8s';
      breathCircle.style.background = getColor();
      breathCircle1.style.background = getColor();
      breathCircle2.style.background = getColor();
      breathCircle3.style.background = getColor();
      backShape1.style.background = getColor();
      backShape2.style.background = getColor();
      breathWord.textContent = 'Breathe Out';
      breathWord.style.position = 'relative';
    }, 10000 - increment * 1000);
}

function getColor(){
  var colorInput = document.getElementById("pickedColor");
  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
    } : null;
  }

  var mappingColor = hexToRgb(colorInput.value);

  var input = [
  mappingColor.r, mappingColor.g, mappingColor.b];
  
  return colorString = 'linear-gradient(rgba(' + String(input[0]) +','+ String(input[1]) +','+ String(input[2]) +',1), rgba(0,0,255,0.2))';
}
  
var increment = 0
function addSecond(n){
    if(typeof n != "number"){
        increment = 0
    }else{
        if (increment + n > 0 && increment + n < 4){
            increment = increment + n
        }else{
            increment = 0
        }
    }
    clearInterval(breatheHandler);
    breatheHandler = setInterval(() => breatheAnimation(), 18000 - increment*2000);
}


breatheAnimation();

let breatheHandler;

addSecond(0);



