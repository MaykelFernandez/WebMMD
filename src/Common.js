// for console debug
// TODO: but some of them are used for work
//       they should be used only for console debug
var __pfp;
var __pmd;
var __pmdView;
var __vfp;
var __vmd;


// for fps calculation
var __oldTime;
var __count = 0;
var __fps_span = 60;


// for work 
var __layer;
var __pmdFileLoaded = false;
var __vmdFileLoaded = false;
var __audioFileLoaded = false;
var __running = false;
var __worker = null;
var __selectedModel;
var __selectedMotion;
var __selectedAudio;
var __selectedPhysics;
var __selectedSkinning;
var __selectedLighting;
var __useWorkers = false;
var __videoEncoder = null;
var __isDragging = false;
var __previousMousePosition = {x:0, y:0};

var __putStatus = function(str) {
	__pmdView.log(str);
};

var __init = function(mmd) {
  __canvas = mmd.canvas;
  __canvas.onblur =  __mouseUpHandler;
  __canvas.onmousedown = __mouseDownHandler;
  __canvas.onmouseup = __mouseUpHandler;
  __canvas.onmousemove = __mouseMoveHandler;
  __canvas.oncontextmenu = __contextMenuHandler;
  __canvas.addEventListener('mousewheel', __wheelHandler, false);

  __layer = new Layer(__canvas);

  var pmdView = mmd;
  pmdView.layer = __layer;
  __pmdView = pmdView;  // for console debug

  pmdView.setPhysicsType(PMDView._PHYSICS_OFF);
  pmdView.setIKType(PMDView._IK_ON);
  pmdView.setMorphType(PMDView._MORPH_ON);
  pmdView.setStageType(PMDView._STAGE_3);
  pmdView.setSphereMapType(PMDView._SPHERE_MAP_ON);
  pmdView.setRunType(PMDView._RUN_REALTIME_ORIENTED);
  pmdView.setShadowMappingType(PMDView._SHADOW_MAPPING_OFF);
  pmdView.setEdgeType(PMDView._EDGE_ON);
  pmdView.setSkinningType(PMDView._SKINNING_CPU_AND_GPU);
  pmdView.setLightingType(PMDView._LIGHTING_ON);
  
  __putStatus("init mmd");
  
};

var __startPMDFileParse = function(buffer) {
  __putStatus('parsing PMD file...');
  // Note: async call to update status area now.
  requestAnimationFrame(function(){__analyzePMD(buffer);});
};


var __analyzePMD = function(buffer) {
  var pfp = new PMDFileParser(buffer);
  __pfp = pfp; // for console debug.

  if(! pfp.valid()) {
    __putStatus('this file seems not a PMD file...');
    __initState();
    return;
  }

  var pmd = pfp.parse();
  __pmd = pmd; // for console debug.

  pmd.setup();

  __loadImages(pmd);
};


var __loadImages = function(pmd) {
  var url = __selectedModel.url;
  var imageBaseURL = url.substring(0, url.lastIndexOf('/'));
  pmd.loadImages(imageBaseURL, __imagesLoaded);
  __putStatus('loading images...');
};


var __imagesLoaded = function(pmd) {
  var pmdView = __pmdView;

  __putStatus('PMD is ready.');

  __pmdFileLoaded = true;

  var pmdModelView = new PMDModelView(__layer, pmd, pmdView);
  pmdModelView.setup();

  pmdView.addModelView(pmdModelView);
  __setModelsBasePosition(pmdView.modelViews);

  if(pmdView.getModelNum() == 1) {
    pmdView.setEye(__selectedModel.eye);
  }
};


var __setModelsBasePosition = function(pmdModelViews) {
  switch(pmdModelViews.length) {
    case 1:
      pmdModelViews[0].setBasePosition(0, 0, 0);
      break;
    case 2:
      pmdModelViews[0].setBasePosition(-10, 0, 0);
      pmdModelViews[1].setBasePosition( 10, 0, 0);
      break;
    case 3:
      pmdModelViews[0].setBasePosition(  0, 0,  0);
      pmdModelViews[1].setBasePosition( 10, 0, 10);
      pmdModelViews[2].setBasePosition(-10, 0, 10);
      break;
    case 4:
      pmdModelViews[0].setBasePosition(  5, 0,  0);
      pmdModelViews[1].setBasePosition( -5, 0,  0);
      pmdModelViews[2].setBasePosition( 15, 0, 10);
      pmdModelViews[3].setBasePosition(-15, 0, 10);
      break;
    case 5:
      pmdModelViews[0].setBasePosition(  0, 0,  0);
      pmdModelViews[1].setBasePosition( 10, 0, 10);
      pmdModelViews[2].setBasePosition(-10, 0, 10);
      pmdModelViews[3].setBasePosition( 20, 0, 20);
      pmdModelViews[4].setBasePosition(-20, 0, 20);
      break;
    default:
      break;
  }
};


// TODO: load in parallel if file# become many.
var __loadVMDFiles = function(urls, index, buffers) {
  var url = urls[index];
  var request = new XMLHttpRequest();
  request.responseType = 'arraybuffer';
  request.onload = function() {
    buffers.push(request.response);
    if(index+1 >= urls.length)
      __startVMDFilesParse(buffers);
    else
      __loadVMDFiles(urls, index+1, buffers);
  };
  request.onerror = function(error) {
    var str = '';
    for(var key in error) {
      str += key + '=' + error[key] + '\n';
    }
    console.log('ERROR: could not load motion: '+url);
    __putStatus('ERROR: could not load motion: '+url);
  };
  request.open('GET', url, true);
  request.send(null);
  __putStatus('loading VMD file ' + (index+1) + ' ...');
};


var __startVMDFilesParse = function(buffers) {
  __putStatus('parsing VMD files...');
  // Note: async call to update status area now.
  requestAnimationFrame(function(){__analyzeVMD(buffers);});
};


var __analyzeVMD = function(buffers) {
  var vmds = [];
  var vfps = [];
  for(var i = 0; i < buffers.length; i++) {
    vfps[i] = new VMDFileParser(buffers[i]);

    if(! vfps[i].valid()) {
      __putStatus('file ' + (i+1) + ' seems not a VMD file...');
      return;
    }

    vmds[i] = vfps[i].parse();
  }

  var vmd = vmds[0];
  var vfp = vfps[0];
  __vfp = vfps[0]; // for console debug.
  __vmd = vmds[0]; // for console debug.

  for(var i = 1; i < buffers.length; i++) {
    vmd.merge(vmds[i]);
  }

  // TODO: has accessed __pmdView
  __pmdView.setVMD(vmd);
  __pmdView.setEye(__selectedMotion.eye);

  __vmdFileLoaded = true;
  if(__selectedMotion.music) {
    __loadMusicFile();
  } else {
    __audioFileLoaded = true;
  }
};


var __loadMusicFile = function() {
  var url = __selectedMotion.music.url;
  var audio = new Audio(url);
  audio.addEventListener('canplaythrough', function() {
    __audioFileLoaded = true;
  });
  __pmdView.setAudio(audio, __selectedMotion.music.offset);
  __putStatus('loading wave file...');
};


var __startDance = function() {
  __pmdView.startDance();
  __putStatus('starts dance.');
};

var __loadModelFile = function(mmd,config) {
  __selectedModel = {
  	name: config.name||'Miku',
  	url: mmd.modelsFolder+config.url||mmd.modelsFolder+'default/miku.pmd',
  	eye: config.eyePos||mmd.defaultEyePos
  };
  var modelURL = __selectedModel.url;
  var request = new XMLHttpRequest();
  request.responseType = 'arraybuffer';
  request.onload = function() {
    __startPMDFileParse(request.response);
  };
  request.onerror = function(error) {
    var str = '';
    for(var key in error) {
      str += key + '=' + error[key] + '\n';
    }
	console.log('ERROR: could not load model: '+url);
	__putStatus('ERROR: could not load model: '+url);
  };
  request.open('GET', modelURL, true);
  request.send(null);
  __putStatus('loading model file: '+__selectedModel.url);
};


var __loadMotionFiles = function(mmd,config) {
  __selectedMotion = {
  	name: config.name||'Toki No Kakera',
  	url:  config.url||[
  		mmd.motionsFolder+'tokino_kakera.vmd',
  		mmd.motionsFolder+'tokino_kakera_cam.vmd'
  	],
  	music: config.music||undefined,
  	eye: config.eye||mmd.defaultEyePos
  };
  var motionURLs = __selectedMotion.url;
  __loadVMDFiles(motionURLs, 0, []);
};








var __runStep = function(pmdView) {
  pmdView.update();
  pmdView.draw();
  requestAnimationFrame(function() {__runStep(pmdView);});
  __calculateFps();
  __count++;
};

var __runStepManually = function(pmdView) {
  pmdView.update();
  pmdView.draw();
  __calculateFps();
  __count++;
};

var __calculateFps = function() {
  if((__count % __fps_span) != 0)
    return;

  var newTime = Date.now();
  var fps = 0;
  if(__oldTime !== undefined) {
    fps = parseInt(1000*__fps_span / (newTime - __oldTime));
    __pmdView.fpsDebug(fps + 'fps');
	__pmdView.fps = fps;
  }
  __oldTime = newTime;
  return fps;
};


var __wheelHandler = function(e) {
  if(! __pmdFileLoaded)
    return;

  var d = ((e.detail || e.wheelDelta) > 0) ? 1 : -1;
  __pmdView.moveCameraForward(d);
  e.preventDefault();
};


var __mouseDownHandler = function(e) {
  if(! __pmdFileLoaded)
    return;

  __isDragging = true;

  __previousMousePosition.x = e.clientX;
  __previousMousePosition.y = e.clientY;
};


var __mouseUpHandler = function(e) {
  if(! __pmdFileLoaded)
    return;

  __isDragging = false;
};


var __contextMenuHandler = function(e) {
  if(! __pmdFileLoaded)
    return;

  __pmdView.resetCameraMove();
  e.preventDefault();
};


var __mouseMoveHandler = function(e) {
  if(! __pmdFileLoaded)
    return;

  if(! __isDragging)
    return;

  var dx = (__previousMousePosition.x - e.clientX) / __canvas.width;
  var dy = (__previousMousePosition.y - e.clientY) / __canvas.height;

  if(e.shiftKey) {
    __pmdView.moveCameraTranslation(dx, dy);
  } else {
    __pmdView.moveCameraQuaternionByXY(dx, dy);
  }

  __previousMousePosition.x = e.clientX;
  __previousMousePosition.y = e.clientY;
};