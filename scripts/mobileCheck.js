// Function to check for platform - source: https://jsperf.com/mobile-simple-detection
var ios, android, blackBerry, windows, smartphone, tablet, all;
var mobileCheck = {
  ios: (function(){
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  }()),
  android: (function(){
    return navigator.userAgent.match(/Android/i);
  }()),
  blackBerry: (function(){
    return navigator.userAgent.match(/BB10|Tablet|Mobile/i);
  }()),
  windows: (function(){
    return navigator.userAgent.match(/IEMobile/i);
  }()),
  smartphone: (function(){
    return (window.innerWidth <= 384 && window.innerHeight <= 640);
  }()),
  tablet: (function(){
    return (navigator.userAgent.match(/Tablet|iPad|iPod/i) && window.innerWidth <= 1280 && window.innerHeight <= 800);
  }()),
  all: (function(){
    return navigator.userAgent.match(/Android|BlackBerry|Tablet|Mobile|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
  }())
};
