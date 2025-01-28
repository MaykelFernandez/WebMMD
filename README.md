# Web MMD
Display and animate PMD models from MikuMikuDance.

This is an embeddable and compact adaptation of [mmd-viewer-js](https://github.com/takahirox/mmd-viewer-js) by [@superhoge](https://twitter.com/superhoge)

## Usage Example
```
<canvas id="mmd"></canvas>
```
```
var mmd = new MMD('mmd',320,240);
mmd.init();
mmd.loadModel({
	name: 'Miku',
	url: 'model/default/miku.pmd'
});
mmd.loadMotions({
	url: [
		'motion/wavefile_v2.vmd',
		'motion/wavefile_camera.vmd',
	],
	music: {
		url: 'music/wavefile_short.mp3',
		offset: 300
	}
});
mmd.log = console.log;
mmd.onload = mmd.start;
```
## MMD: ```class```
```
var mmd = new MMD('canvas',320,240);
```

## Properties

### canvas: ```HTMLCanvasElement```
The canvas where the animation will be shown.

### modelsFolder: ```string```
Folder for the models.
It must end with ```'/'```, For example: ```'assets/models/'```

### defaultEyePos: ```array```
Default eye position ```[0,10,-22]```.
Models that are loaded will take the value of this property.

### defaultAudioOffset: ```float | number```
Default audio offset for the songs being played.

### autoUpdate: ```boolean```
Defines if the scene should be rendered after loading the models.
Set this property to ```false``` to update the scene manually.

```
mmd.autoUpdate = false;
function render() {
	requestAnimationFrame(render);
	mmd.animate();
}
```

### onload: ```function```
This function is called when the program has finished loading the first model and vmd files.

### log: ```function```
This function is called when an important event occurs providing a description of what is happening in its argument.

```javascript
// Example
mmd.log = function (message) {
	console.log(message)
}
```

### fps: ```number```
Current frames per second.

### fpsDebug: ```function```
This function is called in each update cycle.
```javascript
// Example
mmd.fpsDebug = function (message) {
	console.log(message)
}
```

## Methods

### ```init()```
Initialize the program.

### ```loadModel(config)```
Load a model, up to five models can be loaded.

```
// Example
mmd.loadModel({
	name: 'Miku',
	url: 'model/default/miku.pmd',
	eye: [0,10,-22]
});
```

### ```loadMotion(config)```
Load motion files.

```
mmd.loadMotions({
	url: [
		'motion/wavefile_v2.vmd',
		'motion/wavefile_camera.vmd',
	],
	music: {
		url: 'music/wavefile_short.mp3',
		offset: 300
	}
});
```

### ```start(autoUpdate)```
Starts the scene. The ```autoUpdate``` argument defines if the scene should be rendered after loading the models.
Set this property to ```false``` to update the scene manually.

### ```setPhysics(mode)```
Enable or disable complex physics. Physics can be too heavy so it is important to test the performance when using it. Physics requires [ammo.js](https://cdn.jsdelivr.net/npm/ammo.js) to work.

###### 0: disabled, 1: enabled

### ```setIK(mode)```
Enable or disable IK-based animation.

###### 0: disabled, 1: enabled


### ```setMorph(mode)```
Enable or disable facial animation.

###### 0: disabled, 1: enabled


### ```setShadows(mode)```
Enable or disable shadows projected by the models.

###### 0: disabled, 1: enabled


### ```setEdges(mode)```
Enable or disable edge tracing on the models.

###### 0: disabled, 1: enabled


### ```setLights(mode)```
Enable or disable lights.

###### 0: disabled, 1: enabled, 2: enabled with toon

### ```setEffect(mode)```
Enable or disable screen effects.

###### 0: disabled, 1: blur, 2: gaussian blur, 3: diffusion, 4: low-reso, 5: face mosaic
