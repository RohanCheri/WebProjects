var canvasElem, canvas, addCircle, connection, clearButton, startDFS, next, instructionText, resetBtn;
// var nextCycle;
var hotCircleClick = false, connActive = false, finished = false, activeDFS = false, inDFS = false;
var grabbed = -1, startNode = -1, cActive = -1;

document.addEventListener('DOMContentLoaded', domLoaded);

function domLoaded(){
	// Initializing Canvas
	canvasElem = document.getElementById('canvas');
	canvas = canvasElem.getContext('2d');

	// Initialize Header Buttons
	clearButton = document.getElementById('clearGraph');

	// Initialize Text
	instructionText = document.getElementById('instText');

	// Initialize Draw Buttons
	addCircle = document.getElementById('New_Circle');
	connection = document.getElementById("Connection");
	startDFS = document.getElementById('startDFS');

	next = document.getElementById('next');
	// nextCycle = document.getElementById('nextCycle');
	resetBtn = document.getElementById('reset');

	//Adjust window size on screen resize
	window.addEventListener('resize', function(){
		resizeScreen();
	});

	// Adding event listeners for creating and moving nodes
	canvasElem.addEventListener('mousedown', function(e){
		screenClicked(e);
	});

	canvasElem.addEventListener('mouseup', function(e){
		if(((connActive == false || finished) && grabbed != -1) && !inDFS){
			circles[grabbed][2] = false;
		}
		
		grabbed = -1;
		inDFS = false;
		canvasElem.style.cursor = "default";
		refreshScreen();
	});

	canvasElem.addEventListener('mousemove', function(e){
		if(grabbed != -1){
			dragging(e);
		}
	});

	// Top Control Buttons
	clearButton.addEventListener('click', function(e){
		edges = [];
		circles = [];
		graph = [];

		connActive = false;
		hotCircleClick = false;
		activeDFS = false;

		resetDFS();
		updateAll();
	});

	// Formatting for button to work properly

	// Add Circle Button
	addCircle.addEventListener('click', function(e){
		hotCircleClick = !hotCircleClick;
		connActive = false;
		activeDFS = false;

		updateAll();
	});

	addCircle.addEventListener('mouseenter', function(e){
		addCircle.style.backgroundColor = "#1a75ff";
	});

	addCircle.addEventListener('mouseleave', function(e){
		updateAdd();
	});

	// Connections Button
	connection.addEventListener('click', function(e){
		connActive = !connActive;
		hotCircleClick = false;
		activeDFS = false;

		updateAll();
	});

	connection.addEventListener('mouseenter', function(e){
		connection.style.backgroundColor = "#1a75ff";
	});

	connection.addEventListener('mouseleave', function(e){
		updateConn();
	});

	// DFS Starting Buttons
	startDFS.addEventListener('click', function(e){
		connActive = false;
		hotCircleClick = false;
		activeDFS = !activeDFS;

		updateAll();
		refreshScreen();
	});

	startDFS.addEventListener('mouseenter', function(){
		startDFS.style.backgroundColor = "#1a75ff";
	});

	startDFS.addEventListener('mouseleave', function(){
		updateDFS();
	});

	//DFS Control Buttons
	next.addEventListener('click', function(){
		nextClicked();
	});

	resetBtn.addEventListener('click', function(){
		resetDFS();
		updateDFS();
	})

	resizeScreen();
	refreshScreen();
	updateAll();
}

function resizeScreen(){
	canvasElem.width = window.innerWidth * 0.97;
	canvasElem.height = window.innerHeight * 0.77;
	refreshScreen();
}

// Updating Button States
function updateAll(){
	updateConn();
	updateAdd();
	updateDFS();
}

function updateConn(){
	cConnection = false;

	if(!activeDFS){
		for(var i = 0; i < circles.length; i++){
			circles[i][2] = false;
		}

		refreshScreen();
	}
	

	if(connActive){
		connection.style.backgroundColor = "#63f70c";
		instructionText.innerHTML = "Click On Two Different Nodes To Connect Them";
	}
	else{
		connection.style.backgroundColor = "#99c2ff";
		resetText();
	}
}

function updateAdd(){
	if(hotCircleClick){
		addCircle.style.backgroundColor = "#63f70c";
		instructionText.innerHTML = "Click Below to Add A Node";
	}
	else{
		addCircle.style.backgroundColor = "#99c2ff";
		resetText();
	}
}

function updateDFS(){
	if(activeDFS){
		startDFS.style.backgroundColor = "#63f70c";
		next.style.display = "block";
		// nextCycle.style.display = "block";
		instructionText.innerHTML = "Click A Node To Start A DFS From";
		createGraph();
	}
	else{
		startDFS.style.backgroundColor = "#99c2ff";
		next.style.display = "none";
		// nextCycle.style.display = "none";
		resetDFS();
		resetText();
	}
}

function createGraph(){
	startNode = -1;
	graph = [];
	for(var i = 0; i < circles.length; i++){
		graph.push([]);
		visited.push(false);
	}

	for(var i = 0; i < edges.length; i++){
		var curr = edges[i];

		var f = curr[0], o = curr[1];

		graph[f].push(o);
		graph[o].push(f);
	}
}

function resetDFS(){
	resetBtn.style.display = "none";
	queue = [];
	visited = [];
	cActive = -1;
	starNome = -1;

	for(var i = 0; i < edges.length; i++){
		edges[i][2] = false;
	}

	for(var i = 0; i < circles.length; i++){
		circles[i][2] = false;
	}

	refreshScreen();
}

function resetText(){
	if(!activeDFS && !hotCircleClick && !connActive){
		instructionText.innerHTML = "";
	}
}

var lightOrange = "#fc6b03";
var circles = []; //x, y, selected
var universalRadius = 20;

var cConnection = false;

var edges = [];

var graph = [];

var queue = [];
var visited = [];

function screenClicked(e){
	finished = false;

	var click = [];
	click.push(e.clientX - canvasElem.offsetLeft);
	click.push(e.clientY - canvasElem.offsetTop);

	if(hotCircleClick){
		circles.push([click[0], click[1], false]);
	}
	else if(connActive){
		var clickPos = -1;

		for(var i = 0; i < circles.length; i++){
			var c = circles[i];

			if(checkWithinCircle(c, click)){
				clickPos = i;
				break;
			}
		}

		if(clickPos != -1){
			if(cConnection === false){
				cConnection = clickPos;
				circles[clickPos][2] = true;
			}
			else{
				if(clickPos != cConnection){
					var found = true;
					for(var q = 0; q < edges.length; q++){
						if((edges[q][0] == clickPos && edges[q][1] == cConnection) || (edges[q][1] == clickPos && edges[q][0] == cConnection)){
							found = false;
							break;
						}
					}

					if(found){
						edges.push([clickPos, cConnection, false]);
					}
				}

				circles[cConnection][2] = false;
				cConnection = false;
				finished = true;
			}
		}
	}
	else if(activeDFS){
		if(startNode == -1){
			for(var i = 0; i < circles.length; i++){
				var c = circles[i];

				if(checkWithinCircle(c, click)){
					startNode = i;
					break;
				}
			}

			if(startNode != -1){
				instructionText.innerHTML = "Hit Next To Step Through The DFS In Action";
				circles[startNode][2] = true;
				queue.push(i);
			}
		}
	}

	for(var i = 0; i < circles.length; i++){
		var c = circles[i];

		if(checkWithinCircle(c, click)){
			grabbed = i;
			if(visited[i]){
				inDFS = true;
			}

			break;
		}
	}
	refreshScreen();
}

function nextClicked(){
	if(startNode == -1){
		return;
	}

	if(queue.length <= 0){
		instructionText.innerHTML = "The DFS Has Been Completed";
		cActive = -1;
		resetBtn.style.display = "block";
		refreshScreen();
		return;
	}

	var nextVal = queue.shift();

	if(!nextVal.length == 1){ //Node
		if(!visited[nextVal]){
			visited[nextVal] = true;

			cActive = nextVal;
			circles[nextVal][2] = true;

			for(var i = 0; i < graph[nextVal].length; i++){
				queue.push([nextVal, graph[nextVal][i]]);
			}
		}
		else{
			nextClicked();
			return;
		}
	}
	else{ //Edge
		if(visited[nextVal[1]] === false){
			cActive = nextVal;

			var found = -1;
			for(var q = 0; q < edges.length; q++){
				if((edges[q][0] == nextVal[0] && edges[q][1] == nextVal[1]) || (edges[q][1] == nextVal[0] && edges[q][0] == nextVal[1])){
					found = q;
					break;
				}
			}


			edges[found][2] = true;
			queue.unshift(nextVal[1]);
		}
		else{
			nextClicked();
			return;
		}
	}

	console.log(cActive);
	refreshScreen();
}

function refreshScreen(){
	canvas.clearRect(0, 0, canvasElem.width, canvasElem.height);
	drawAllLines();
	drawAllCircles();
}

function drawAllLines(){
	for(var i = 0; i < edges.length; i++){
		var c1 = circles[edges[i][0]], c2 = circles[edges[i][1]];

		canvas.beginPath();
		canvas.lineWidth = 2 + activeDFS * 1.5;

		if((edges[i][0] == cActive[0] && edges[i][1] == cActive[1]) || (edges[i][0] == cActive[1] && edges[i][1] == cActive[0])){
			canvas.strokeStyle = "green";
			canvas.lineWidth = 7;
		}
		else{
			canvas.shadowBlur = 0;

			if(edges[i][2]){
				canvas.strokeStyle = "purple";
			}
			else{
				canvas.strokeStyle = "black";
			}
		}
		
		canvas.moveTo(c1[0], c1[1]);
		canvas.lineTo(c2[0], c2[1]);;
		canvas.stroke();
	}
}

function drawAllCircles(){
	for(var i = 0; i < circles.length; i++){
		var c = circles[i];
		drawCircle(c[0], c[1], universalRadius, c[2], i);
	}
}

function drawCircle(x, y, radius, useBlur, index){
	canvas.beginPath();

	if(useBlur){
		if(index === cActive){
			canvas.fillStyle = "green";
			canvas.shadowBlur = 30;
			canvas.shadowColor = "red";
		}
		else if(cActive != -1){
			canvas.fillStyle = "blue";
		}
		else{
			canvas.shadowBlur = 25;
			canvas.shadowColor = "red";
			canvas.fillStyle = lightOrange;
		}
	}
	else{
		canvas.fillStyle = lightOrange;
	}

	canvas.arc(x, y, radius, 0, 2 * Math.PI);
	canvas.fill();

	if(useBlur){
		canvas.shadowBlur = 0;
	}
}

function checkWithinCircle(circle, click){
	var dist = calcDistance(circle[0], click[0], circle[1], click[1]);

	if(dist < universalRadius){
		return true;
	}
	return false;
}


function calcDistance(x1, x2, y1, y2){
	return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
}

function dragging(e){
	var click = [];
	click.push(e.clientX - canvasElem.offsetLeft);
	click.push(e.clientY - canvasElem.offsetTop);

	canvasElem.style.cursor = "move";
	circles[grabbed][0] = click[0];
	circles[grabbed][1] = click[1];
	circles[grabbed][2] = true;
	refreshScreen();
}