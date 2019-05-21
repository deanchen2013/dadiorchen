import * as THREE from 'three';
if(process.browser){
	window.THREE = THREE;
	require('three/examples/js/controls/OrbitControls');
}

global.THREE		= THREE

export default THREE;
