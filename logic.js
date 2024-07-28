// variables are storage of values; reusable names with values
let board;
let score = 0;
let rows = 4;
let columns = 4;

// variables to ensure player is congratulated for only one time after reaching 2048, 4096, or 8192
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// for phone touch compatibility (swiping)
let startX = 0;
let startY = 0;

// functions are reusable tasks
// to create and display the tile
function setGame(){

	board = [
		 [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
	]; // Goal, to use this back-end board to create our front-end board.

	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			// create and design a tile

			// create tile using div
			let tile = document.createElement("div");
			// assign an invisible id name to each tile
			tile.id = r.toString() + "-" + c.toString();
			// number value stored in the tile
			let num = board[r][c];
			updateTile(tile, num);

			document.getElementById("board").append(tile);
		}
	}

	setTwo();
	setTwo();
}

// updates the appearance of the tile (with the correct tile number and background color)
function updateTile(tile, num){
	tile.innerText = "";
	tile.classList.value = "";

	tile.classList.add("tile");

	// updateTile() uses our prepared styles in style.css
	if(num > 0){
		tile.innerText = num.toString();

		if(num <= 4096){
			tile.classList.add("x" + num.toString());
		}
		else{
			tile.classList.add("x8192");
		}
	}
}

window.onload = function(){
	setGame();
}

function handleSlide(event){
	// to get the button/key pressed by the player
	// console.log = displays output in console tab when pressing a key
	// event.code represents the pressed key
	console.log(event.code);

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)){
		// to prevent default behavior of browser when pressing arrow keys where the page is scrolled on pressed direction
		event.preventDefault();

		if(event.code == "ArrowLeft"){
			slideLeft();
		} else if(event.code == "ArrowRight"){
			slideRight();
		} else if(event.code == "ArrowUp"){
			slideUp();
		} else if(event.code == "ArrowDown"){
			slideDown();
		}

		setTwo();
	}
	document.getElementById("score").innerText = score;
	checkWin();

	if(hasLost()==true){
		alert("Game Over! You have lost the game. Game will restart.");
		restartGame();
		alert("Click any arrow key to restart.");
	}
}

document.addEventListener("keydown", handleSlide);

function slideLeft(){
	//console.log("You pressed left.")
	for(let r=0; r<rows; r++){
		let row = board[r];
		let originalRow = row.slice();
		row = slide(row);
		board[r] = row;

		for(let c=0; c<columns; c++){
			// retrieve tile id name
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			// update number value in the tile
			let num = board[r][c];

			// animation
			if(originalRow[c] !== num && num!==0){
				tile.style.animation = "slide-from-right 0.3s";
				setTimeout(()=> {
					tile.style.animation = "";
				}, 300);
			}
			// update the appearance and text of the tile
			updateTile(tile, num);
		}
	}
}
function slideRight(){
	//console.log("You pressed right.")
	for(let r=0; r<rows; r++){
		let row = board[r];
		let originalRow = row.slice();
		row.reverse(); // slideRight is reverse of slideLeft
		row = slide(row);
		row.reverse();
		board[r] = row;

		for(let c=0; c<columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			if(originalRow[c] !== num && num!==0){
				tile.style.animation = "slide-from-left 0.3s";
				setTimeout(()=> {
					tile.style.animation = "";
				}, 300);
			}

			updateTile(tile, num);
		}
	}
}
function slideUp(){
	//console.log("You pressed up.")
	for(let c=0; c<columns; c++){
		let col = [board[0][c],board[1][c],board[2][c],board[3][c]];
		let originalCol = col.slice();
		let changeIndices = [];
		col = slide(col);

		for(let r=0; r<rows; r++){
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			if(originalCol[r] !== col[r]){
				changeIndices.push(r);
			}
			if(changeIndices.includes(r) && num!==0){
				tile.style.animation = "slide-from-bottom 0.3s";
				setTimeout(()=> {
					tile.style.animation = "";
				}, 300);
			}

			updateTile(tile, num);
		}
	}
}
function slideDown(){
	//console.log("You pressed down.")
	for(let c=0; c<columns; c++){
		let col = [board[0][c],board[1][c],board[2][c],board[3][c]];
		let originalCol = col.slice();
		let changeIndices = [];
		col.reverse(); // slideDown is reverse of slideUp
		col = slide(col);
		col.reverse();
		
		for(let r=0; r<rows; r++){
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			if(originalCol[r] !== col[r]){
				changeIndices.push(r);
			}
			if(changeIndices.includes(r) && num!==0){
				tile.style.animation = "slide-from-top 0.3s";
				setTimeout(()=> {
					tile.style.animation = "";
				}, 300);
			}

			updateTile(tile, num);
		}
	}
}

// slide() merges the same adjacent tiles; core function in sliding & merging tiles
function slide(row){
	row = filterZero(row);
	for(let i=0; i<row.length - 1; i++){
		if(row[i] == row[i+1] || row[i] == 0){
			score += row[i]*2;
			row[i] = row[i] + row[i+1];
			row[i+1] = 0;
		}
	}

	// Add zeroes back
	while(row.length < columns){
		row.push(0);
	}
	return row;
}

// filterZero - removes the zeroes
function filterZero(row){
	// filter() - creates new function with elements that passes the given condition
	return row.filter(num => num != 0);
}

function hasEmptyTile(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			if(board[r][c]==0){
				return true;
			}
		}
	}
	return false;
}

function setTwo(){
	if(hasEmptyTile() == false){
		return;
	}

	let found = false;
	while(!found){
		// to generate a random row & column position of new 2 value
		let r = Math.floor(Math.random()*rows);
		let c = Math.floor(Math.random()*columns);

		if(board[r][c]==0){
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");

			found = true;
		}
	}
}

function checkWin(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			if(board[r][c]==2048 && is2048Exist == false){
				alert("You Win! You got 2048.");
				is2048Exist = true;
			} else if(board[r][c]==4096 && is4096Exist == false){
				alert("You are unstoppable at 4096!");
				is4096Exist = true;
			} else if(board[r][c]==8192 && is8192Exist == false){
				alert("Victory! You have reached 8192! You are incredibly awesome.");
				is8192Exist = true;
			}
		}
	}
}

function hasLost(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			// if there is an empty tile, player has not yet lost
			if(board[r][c]==0){
				return false;
			}

			const currentTile = board[r][c];

			// check if current tile is has possible merge in adjacent tile
			if(r>0 && board[r-1][c]==currentTile || 
			r<(rows-1) && board[r+1][c]==currentTile || 
			c>0 && board[r][c-1] == currentTile || 
			c<(columns-1) && board[r][c+1] == currentTile){
				return false;
			}
		}
	}
	return true;
}

function restartGame(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			board[r][c]=0;
		}
	}
	score = 0;
	setTwo();
}

document.addEventListener('touchstart', (event) =>{
	startX = event.touches[0].clientX;
	startY = event.touches[0].clientY;
})

document.addEventListener('touchend', (event) =>{
	if(!event.target.className.includes("tile")){
		return;
	}

	let diffX = startX - event.changedTouches[0].clientX;
	let diffY = startY - event.changedTouches[0].clientY;

	if(Math.abs(diffX) > Math.abs(diffY)){
		if(diffX > 0){
			slideLeft();
			setTwo();
		} else{
			slideRight();
			setTwo();
		}
	} else{
		if(diffY > 0){
			slideUp();
			setTwo();
		} else{
			slideDown();
			setTwo();
		}
	}

	document.getElementById("score").innerText = score;
	checkWin();

	if(hasLost()==true){
		alert("Game Over! You have lost the game. Game will restart.");
		restartGame();
		alert("Click any arrow key to restart.");
	}
})

// to prevent shaking of screen durign swiping
document.addEventListener('touchmove', (event)=>{
	if(!event.target.className.includes("tile")){
		return;
	}
	event.preventDefault();
}, {passive: false}); // passive: false, to make preventDefault() work