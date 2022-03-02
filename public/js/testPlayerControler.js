// character
export class BasicCharacterControls {
	constructor(params) {
		this._Init(params);
	}

	_Init(params) {
		this._params = params;
		this._move = {
			forward: false,
			backward: false,
			left: false,
			right: false,
		};
		this._turn = {
			left: false,
			right: false,
		}

		this.rotating = false;

		this.targetRotationX = 0;
		this.targetRotationY = 0;
		this.targetRotationOnMouseDownX = 0;
		this.targetRotationOnMouseDownY = 0;
		this.mouseX = 0;
		this.mouseY = 0;
		this.mouseXOnMouseDown = 0;
		this.mouseYOnMouseDown = 0;
		this.windowHalfX = window.innerWidth / 2;
		this.windowHalfY = window.innerHeight / 2;

		document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
		document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
		document.addEventListener('mousedown', (e) => this._onMouseDown(e), false);
		document.addEventListener('mousemove', (e) => this._onMouseMove(e), false);
		document.addEventListener('mouseup', (e) => this._onMouseUp(), false);
		
	}

	_onKeyDown(event) {
		switch (event.keyCode) {
			case 87: // w
				this._move.forward = true;
				break;
			case 65: // a
				this._move.left = true;
				break;
			case 83: // s
				this._move.backward = true;
				break;
			case 68: // d
				this._move.right = true;
				break;
			case 38: // up
				this._move.forward = true;
				break;
			case 37: // left
				this._turn.left = true;
				break;
			case 40: // down
				this._move.backward = true;
				break;
			case 39: // right
				this._turn.right = true;
				break;
		}
	}

	_onKeyUp(event) {
		switch(event.keyCode) {
			case 87: // w
				this._move.forward = false;
				break;
			case 65: // a
				this._move.left = false;
				break;
			case 83: // s
				this._move.backward = false;
				break;
			case 68: // d
				this._move.right = false;
				break;
			case 38: // up
				this._move.forward = false;
				break;
			case 37: // left
				this._turn.left = false;
				break;
			case 40: // down
				this._move.backward = false;
				break;
			case 39: // right
				this._turn.right = false;
				break;
		}
	}

	_onMouseDown(event) {
		event.preventDefault();

		this.rotating = true;

		this.mouseXOnMouseDown = event.clientX - this.windowHalfX;
		this.targetRotationOnMouseDownX = this.targetRotationX;

		this.mouseYOnMouseDown = event.clientY - this.windowHalfY;
		this.targetRotationOnMouseDownY = this.targetRotationY;
	}
	_onMouseMove(event) {
		if (this.rotating) {
			this.mouseX = event.clientX - this.windowHalfX;
			this.mouseY = event.clientY - this.windowHalfY;

			this.targetRotationY = this.targetRotationOnMouseDownY + (this.mouseY - this.mouseYOnMouseDown) * 0.02;
			this.targetRotationX = this.targetRotationOnMouseDownX + (this.mouseX - this.mouseXOnMouseDown) * 0.02;
		}
		
	}

	_onMouseUp() {
		this.rotating = false;
	}

	Update(timeInSeconds){
		const controlObject = this._params.target;
		const camera = this._params.camera;
		const speed = 0.5;
		const rotationSpeed = 0.02;
		if (this._move.forward) {
			controlObject.position.x += Math.sin(controlObject.rotation.y) * speed;
			controlObject.position.z += Math.cos(controlObject.rotation.y) * speed;
		}
		if (this._move.backward) {
			controlObject.position.x -= Math.sin(controlObject.rotation.y) * speed;
			controlObject.position.z -= Math.cos(controlObject.rotation.y) * speed;
		}
		if (this._move.left) {
			controlObject.position.z -= Math.sin(controlObject.rotation.y) * speed;
			controlObject.position.x += Math.cos(controlObject.rotation.y) * speed;
		}
		if (this._move.right) {
			controlObject.position.z += Math.sin(controlObject.rotation.y) * speed;
			controlObject.position.x -= Math.cos(controlObject.rotation.y) * speed;
		}
		if (this._turn.left) {
			controlObject.rotation.y += Math.PI * rotationSpeed;
		}
		if (this._turn.right) {
			controlObject.rotation.y -= Math.PI * rotationSpeed;
		}
		if (this.rotating) {
			controlObject.rotation.y += ( -this.targetRotationX - controlObject.rotation.y ) * 0.01;
 
			if (camera.rotation.x  <= 1 && camera.rotation.x >= -1 ) {
				camera.rotation.x += (this.targetRotationY - camera.rotation.x) * 0.01;
			}
			if (camera.rotation.x  > 1 ) {
				camera.rotation.x = 1
			}
			if (camera.rotation.x  < -0.4 ) {
				camera.rotation.x = -0.4
			}
		}
		
	}
}