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
		this.mouse_rotating = false;
		this.mouse_start = {
			x: 0,
			y: 0
		}
		this.rotation_modifier = 1;

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
		this.mouse_rotating = true;
		this.mouse_start.x = event.clientX;
	}
	_onMouseMove(event) {
		if (this.mouse_rotating) {
			if(event.clientX < this.mouse_start.x){
				this._turn.left = true;
				this._turn.right = false;
				this.rotation_modifier = -(event.clientX - this.mouse_start.x) / window.innerWidth;
			}else{
				this._turn.left = false;
				this._turn.right = true;
				this.rotation_modifier =  -(this.mouse_start.x - event.clientX)  / window.innerWidth;
			}
			if (event.clientX > window.innerWidth - 10 || event.clientX == 0) {
				this.rotation_modifier = 1;
			}
		}

		
	}

	_onMouseUp() {
		this.mouse_rotating = false;
		this._turn.right = false;
		this._turn.left = false;
	}

	Update(timeInSeconds){
		const controlObject = this._params.target;
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
			controlObject.rotation.y += Math.PI * rotationSpeed * this.rotation_modifier;
		}
		if (this._turn.right) {
			controlObject.rotation.y -= Math.PI * rotationSpeed * this.rotation_modifier;
		}
	}
}