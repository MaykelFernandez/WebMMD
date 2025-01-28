// MMD Class

class MMD extends PMDView {
	constructor(id, width, height){
		super();
		this.canvas = document.getElementById(id) || document.createElement('canvas');
		this.canvas.width = width||640;
		this.canvas.height = height||480;
		this.modelsFolder = '';
		this.motionsFolder = '';
		this.musicFolder = '';
		this.defaultEyePos = [0,10,-22];
		this.defaultAudioOffset = 0;
		this.autoUpdate = true;
		this.fps = 0;
		this.physicsContants = [
			PMDView._PHYSICS_OFF,
			PMDView._PHYSICS_ON
		];
		this.ikConstants = [
			PMDView._IK_OFF,
			PMDView._IK_ON
		];
		this.morphConstants = [
			PMDView._MORPH_OFF,
			PMDView._MORPH_ON
		];
		this.stageContants = [
			PMDView._STAGE_OFF,
			PMDView._STAGE_1,
			PMDView._STAGE_2,
			PMDView._STAGE_3
		];
		this.sphereMapConstants = [
			PMDView._SPHERE_MAP_OFF,
			PMDView._SPHERE_MAP_ON
		];
		this.edgeContants = [
			PMDView._EDGE_OFF,
			PMDView._EDGE_ON
		];
		this.lightingConstants = [
			PMDView._LIGHTING_OFF,
			PMDView._LIGHTING_ON,
			PMDView._LIGHTING_ON_WITH_TOON
		];
		this.effectConstants = [
			PMDView._EFFECT_OFF,
			PMDView._EFFECT_BLUR,
			PMDView._EFFECT_GAUSSIAN,
			PMDView._EFFECT_DIFFUSION,
			PMDView._EFFECT_DIVISION,
			PMDView._EFFECT_LOW_RESO,
			PMDView._EFFECT_FACE_MOSAIC
		];
	}
	init() {
		__init(this);
		var ths = this;
		setInterval(function(){
			ths.check.call(ths)
		});
	}
	loadModel(config) {
		__loadModelFile(this,config);
	}
	loadMotions(config) {
		__loadMotionFiles(this,config);
	}
	onload() {
	}
	log() {
	}
	fpsDebug() {
	}
	check() {
		if (__pmdFileLoaded && __vmdFileLoaded && __audioFileLoaded && !__running) {
			__running = true;
			this.onload();
		}
	}
	start (auto) {
		this.autoUpdate = auto||this.autoUpdate;
		if (this.autoUpdate) {
			__runStep(this);
		}
		__startDance();
	}
	animate() {
		if (this.autoUpdate) return;
		__runStepManually(this);
	}
	setPhysics(type) {
		/*
		 * 0 - off
		 * 1 - on
		 */
		this.setPhysicsType(this.physicsContants[type]);
	}
	setIK(type) {
		/*
		 * 0 - off
		 * 1 - on
		 */
		this.setIKType(this.ikContants[type]);
	}
	setMorph(type) {
		/*
		 * 0 - off
		 * 1 - on
		 */
		this.setMorphType(this.morphContants[type]);
	}
	setStage(type) {
		/*
		 * 0 - off
		 * 1 - stage 1
		 * 2 - stage 2
		 * 3 - stage 3
		 */
		this.setStageType(this.stageContants[type]);
	}
	setShadows(type) {
		/*
		 * IT IS SPHERE MAP!
		 * 0 - off
		 * 1 - on
		 */
		this.setSphereMapType(this.sphereMapConstants[type]);
	}
	setEdges(type) {
		/*
		 * 0 - off
		 * 1 - on
		 */
		this.setEdgeType(this.edgeContants[type]);
	}
	setLights(type) {
		/*
		 * 0 - off
		 * 1 - on
		 * 2 - on (toon)
		 */
		this.setLightingType(this.lightingConstants[type]);
	}
	setEffect(type) {
		this.setEffectFlag(this.effectConstants[type]);
	}
}