const board = document.getElementById("board");

let cells = [];
var matrix = [];
let rows,cols;
let source_cord,target_cord;

/*
FIX #1:
Only render after DOM is loaded.
Removed extra renderBoard() call.
*/
document.addEventListener("DOMContentLoaded", () => {
    renderBoard();
    // generateMaze(false);
});

function renderBoard(cellWidth = 22) {
    const root = document.documentElement;
    root.style.setProperty('--cell-width',`${cellWidth}px`)
    /*
    FIX #2:
    Clear previous board before rendering.
    */
    board.innerHTML = "";

    rows = Math.floor(board.clientHeight / cellWidth);
    cols = Math.floor(board.clientWidth / cellWidth);


    cells = [];
    matrix = [];

    for (let i = 0; i < rows; i++) {

        const rowElement = document.createElement("div");
        const rowArr = [];

        rowElement.classList.add("row");
        rowElement.id = `row-${i}`;

        for (let j = 0; j < cols; j++) {

            const cellElement = document.createElement("div");

            /*
            FIX #3:
            You were using class="row"
            instead of class="cell"
            */
            cellElement.classList.add("cell");

            cellElement.id = `${i}-${j}`;

            cells.push(cellElement);
            rowArr.push(cellElement);

            rowElement.appendChild(cellElement);
        }
        matrix.push(rowArr);
        board.appendChild(rowElement);
    }
    source_cord = set('source');
    target_cord = set('target');
    
    console.log(matrix);
    console.log("Total Cells:", cells.length);

}
// generateMaze(false);
/* =========================
   NAVIGATION CODE
   ========================= */

const navOptions = document.querySelectorAll(".nav-menu > li > a");

let dropOptions = null;

const removeActive = (elements, parent = false) => {
    elements.forEach(el => {
        if (parent) {
            el.parentElement.classList.remove("active");
        } else {
            el.classList.remove("active");
        }
    });
};

navOptions.forEach((navOption) => {

    navOption.addEventListener("click", () => {

        const li = navOption.parentElement;

        if (li.classList.contains("active")) {
            li.classList.remove("active");
            return;
        }

        removeActive(navOptions, true);

        li.classList.add("active");

        if (li.classList.contains("drop-box")) {

            dropOptions = li.querySelectorAll(".drop-menu > li");

            toggleDropOptions(navOption.innerText);
        }
    });
});

let pixelSize = 22;
let speed = 'normal';
let algorithms = 'BFS';
const visualizeBtn = document.getElementById('visualize');

function toggleDropOptions(target) {
    target = target.toLowerCase();
    if (!dropOptions) return;

    dropOptions.forEach((dropOption) => {
        console.log("listner attached");
        if (dropOption.dataset.listenerAttached) return; 
        dropOption.dataset.listenerAttached = 'true';

        dropOption.addEventListener("click", () => {
            // e.stopPropagation(); 
            removeActive(dropOptions);

            dropOption.classList.add("active");

            if(target === 'pixel'){
                pixelSize = +dropOption.innerText.replace('px','');
                renderBoard(pixelSize);
                console.log(pixelSize);
            }
            else if(target === 'speed'){
                speed = dropOption.innerText.toLowerCase();
            }
            else{
                algorithms = dropOption.innerText.split(' ')[0];
                // console.log(dropOption.innerText);
                visualizeBtn.innerText = `Visualize ${algorithms}`;
            }
            removeActive(navOptions,true);
        });
    });
}

document.addEventListener('click', (e) => {
    const navMenu = document.querySelector('.nav-menu');

    if (!navMenu.contains(e.target)) {
        removeActive(navOptions, true);
    }
});




// BOARD INTERACTION

// let isDrawing = false;
// let isDragging = false;
// cells.forEach((cell)=>{
//     const pointerdown = (e)=>{

//         if(e.target.classList.contains('source') || e.target.classList.contains('target')){
//             isDragging = true;
//         }
//         else{
//             isDrawing = true;
//         }
//     }
//     const pointermove = (e)=>{
//         console.log(e.target);
//         if(isDrawing){
//             e.target.classList.add('wall');
//         }
//         else{

//         }
//     }
//     const pointerup = ()=>{
//         isDragging = false;
//         isDrawing = false;
//     }

//     cell.addEventListener('pointerdown', pointerdown);
//     cell.addEventListener('pointermove', pointermove);
//     cell.addEventListener('pointerup', pointerup);
// })

// =========================
// BOARD INTERACTION
// =========================
function isValid(x,y){
    return (x>=0 && y>=0 &&x<rows&&y<cols);
}
function set(className,x=-1,y=-1){
    if(isValid(x,y)){
        matrix[x][y].classList.add(className);
    }
    else{
        x= Math.floor(Math.random()*rows);
        y= Math.floor(Math.random()*cols);
        matrix[x][y].classList.add(className);
    }

    return {x,y};
}

// let source = set('source');
// let target = set('target');


let isDrawing = false;
let isDragging = false;
let dragPoint = null;

// 1. Listen on the whole board, not individual cells
board.addEventListener('pointerdown', (e) => {
    // Only do something if the user actually touched a cell
    if (!e.target.classList.contains('cell')) return;

    if (e.target.classList.contains('source') ) {
        isDragging = true;
        dragPoint = `source`;
        
    }
    else if(e.target.classList.contains('target')){
        isDragging = true;
        dragPoint = `target`;
        
    }
     else {
        isDrawing = true;
        // Instantly toggle a wall on the cell we just clicked
        e.target.classList.toggle('wall'); 
    }
});

// 2. Listen for dragging across the board
board.addEventListener('pointermove', (e) => {
    // Make sure we are only interacting with cells
    if (!e.target.classList.contains('cell')) return;

    if (isDrawing) {
        // Use 'add' instead of toggle so we don't erase walls by wiggling the mouse
        e.target.classList.add('wall');
    }
    else if(dragPoint && isDragging){
        // cells.forEach(cell=>{
        //     cell.classList.add(`${dragPoint}`);
        // })
        const oldCell = document.querySelector(`.${dragPoint}`);
        if (oldCell) {
            oldCell.classList.remove(dragPoint);
        }

        e.target.classList.add(`${dragPoint}`);
        // e.target.classList.add
        cordinate = (e.target.id.split('-'));

        if(dragPoint=== 'source'){
            source_cord.x = +cordinate[0];
            source_cord.y = +cordinate[1];
        }
        else if(dragPoint === 'target'){
            target_cord.x = +cordinate[0];
            target_cord.y = +cordinate[1];
        }
    }
});

// 3. Listen for releasing the mouse ANYWHERE on the screen
document.addEventListener('pointerup', () => {
    isDrawing = false;
    isDragging = false;
    dragPoint = null;
    matrix[source_cord.x][source_cord.y].classList.remove('wall');
    matrix[target_cord.x][target_cord.y].classList.remove('wall');
});

const clearPath =()=>{
    cells.forEach(cell=>{
        cell.classList.remove('path');
        cell.classList.remove('visited');
    })
}
const clearwall =()=>{
    cells.forEach(cell=>{
        cell.classList.remove('wall');
    })
}

const clearBoard =()=>{
    cells.forEach(cell=>{
        cell.classList.remove('wall');
        cell.classList.remove('visited');
        cell.classList.remove('path');

    })
}

const clearBoardBtn = document.getElementById("clear-board");
// 2. Attach the click event
clearBoardBtn.addEventListener("click", () => {

    clearBoard();
});


const clearPathBtn = document.getElementById("clear-path");
// 2. Attach the click event
clearPathBtn.addEventListener("click", () => {

    clearPath();
});



////////////////////////////////////////
/////////   MAGE GENERATION   //////////
////////////////////////////////////////


// const generateMazeBtn = document.querySelector('#generate-maze');
const generateMazeBtn = document.getElementById("generate-maze-btn");
let wallToAnimate;

generateMazeBtn.addEventListener('click', () => {
    clearBoard();
    wallToAnimate = [];
    
    recursiveDivisionMaze(0, rows - 1, 0, cols - 1, 'horizontal', false);
    createSafeZone(source_cord);
    createSafeZone(target_cord);
    animate(wallToAnimate, 'wall');
    
});

function recursiveDivisionMaze(rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls) {
    if (rowEnd < rowStart || colEnd < colStart) {
        return;
    }

    if (!surroundingWalls) {
        //Drawing top & bottom Boundary Wall
        for (let i = 0; i < cols; i++) {
            if (matrix[0][i].classList.contains('source') || matrix[0][i].classList.contains('target'))
                continue;

            wallToAnimate.push(matrix[0][i]);

            if (matrix[rows - 1][i].classList.contains('source') || matrix[rows - 1][i].classList.contains('target'))
                continue;
            wallToAnimate.push(matrix[rows - 1][i]);
        }

        //Drawing left & right Boundar wall
        for (let i = 0; i < rows; i++) {
            if (matrix[i][0].classList.contains('source') || matrix[i][0].classList.contains('target'))
                continue;
            wallToAnimate.push(matrix[i][0]);

            if (matrix[i][cols - 1].classList.contains('source') || matrix[i][cols - 1].classList.contains('target'))
                continue;
            wallToAnimate.push(matrix[i][cols - 1]);
        }
        surroundingWalls = true;
    }

    //=========== horizontal ======
    if (orientation === "horizontal") {
        let possibleRows = [];
        for (let i = rowStart; i <= rowEnd; i += 2) {
            if (i == 0 || i == rows - 1) continue;
            possibleRows.push(i);
        }
        let possibleCols = [];
        for (let i = colStart - 1; i <= colEnd + 1; i += 2) {
            if (i <= 0 || i >= cols - 1) continue;
            possibleCols.push(i);
        }

        let currentRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
        let colRandom = possibleCols[Math.floor(Math.random() * possibleCols.length)];

        //drawing horizontal wall
        for (i = colStart - 1; i <= colEnd + 1; i++) {
            const cell = matrix[currentRow][i];
            if (!cell || i === colRandom || cell.classList.contains('source') || cell.classList.contains('target'))
                continue;

            wallToAnimate.push(cell)
        }


        if (currentRow - 2 - rowStart > colEnd - colStart) {
            recursiveDivisionMaze(rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls);
        } else {
            recursiveDivisionMaze(rowStart, currentRow - 2, colStart, colEnd, "vertical", surroundingWalls);
        }
        if (rowEnd - (currentRow + 2) > colEnd - colStart) {
            recursiveDivisionMaze(currentRow + 2, rowEnd, colStart, colEnd, orientation, surroundingWalls);
        } else {
            recursiveDivisionMaze(currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls);
        }
    }

    //=========== vertical ======
    else if (orientation === 'vertical') {
        let possibleCols = [];
        for (let i = colStart; i <= colEnd; i += 2) {
            possibleCols.push(i);
        }
        let possibleRows = [];
        for (let i = rowStart - 1; i <= rowEnd + 1; i += 2) {
            if (i <= 0 || i >= rows - 1) continue;
            possibleRows.push(i);
        }

        let currentCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];
        let rowRandom = possibleRows[Math.floor(Math.random() * possibleRows.length)];

        //drawing vertical wall
        for (i = rowStart - 1; i <= rowEnd + 1; i++) {
            if (!matrix[i]) continue;

            const cell = matrix[i][currentCol];
            if (i === rowRandom || cell.classList.contains('source') || cell.classList.contains('target'))
                continue;
            wallToAnimate.push(cell)
        }

        if (rowEnd - rowStart > currentCol - 2 - colStart) {
            recursiveDivisionMaze(rowStart, rowEnd, colStart, currentCol - 2, "horizontal", surroundingWalls);
        } else {
            recursiveDivisionMaze(rowStart, rowEnd, colStart, currentCol - 2, orientation, surroundingWalls);
        }
        if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
            recursiveDivisionMaze(rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", surroundingWalls);
        } else {
            recursiveDivisionMaze(rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls);
        }
    }
};

//extrafeature

function createSafeZone(nodeCord) {
    const r = nodeCord.x;
    const c = nodeCord.y;

    // The 4 neighbors: Up, Down, Left, Right
    const neighbors = [
        { x: r - 1, y: c },
        { x: r + 1, y: c },
        { x: r, y: c - 1 },
        { x: r, y: c + 1 }
    ];

    neighbors.forEach(neighbor => {
        // If the neighbor is inside the grid, remove the wall!
        if (isValid(neighbor.x, neighbor.y)) {
            matrix[neighbor.x][neighbor.y].classList.remove('wall');
        }
    });
}

// 1. Grab the specific button from the HTML
// const generateMazeBtn = document.getElementById("generate-maze-btn");
// let wallToAnimate;

// // 2. Attach the click event
// generateMazeBtn.addEventListener("click", () => {

   
//     // We pass 'horizontal' as a string (with quotes!)
//     // renderBoard();
//     clearBoard();
//     wallToAnimate = [];
//     recursiveDivisionMaze(0, rows - 1, 0, cols - 1, 'horizontal', false);

//     createSafeZone(source_cord);
//     createSafeZone(target_cord);
    
//     // Optional: You can also print a message to confirm it clicked
//     animate(wallToAnimate, 'wall');
//     console.log("Generating maze...");
// });


// function generateMaze(rowStart, rowEnd, colStart, colEnd, surroundingWall, orientation){
//     if(rowStart>rowEnd || colStart>colEnd){
//         return;
//     }
    
//     if(!surroundingWall){
//         for(let i =0;i<cols;i++){
//             if(!matrix[0][i].classList.contains('source') && !matrix[0][i].classList.contains('target')){

//                 matrix[0][i].classList.add('wall');
//             }
//             if(!matrix[rows-1][i].classList.contains('source') && !matrix[rows-1][i].classList.contains('target')){

//                 matrix[rows-1][i].classList.add('wall');
//             }
            
//         }
//         for(let i =0;i<rows;i++){
//             if(!matrix[i][0].classList.contains('source') && !matrix[i][0].classList.contains('target')){

//                 matrix[i][0].classList.add('wall');
//             }
//             if(!matrix[i][cols-1].classList.contains('source') && !matrix[i][cols-1].classList.contains('target')){

//                 matrix[i][cols-1].classList.add('wall');
//             }
//         }
//         surroundingWall = true;
//     }

//     if(orientation === 'horizontal'){
//         let possibleRows = [];
//         // let possibleRows = [];
//         for(let i = rowStart;i<=rowEnd;i+=2){
//             possibleRows.push(i);
//         }
//         let possibleCols = [];
//         for(let i =colStart-1;i<=colEnd+1;i+=2){
//             if(i>0&&i<cols-1){

//                 possibleCols.push(i);
//             }
//         }
//         const currentRow = possibleRows[Math.floor(Math.random()*possibleRows.length)];
//         const randomCol = possibleCols[Math.floor(Math.random()*possibleCols.length)];

//         for(let i =colStart-1;i<=colEnd+1;i++){
//             const cell = matrix[currentRow][i];
//             if(!cell || i=== randomCol ||cell.classList.contains('source') ||cell.classList.contains('target')) continue;
//             cell.classList.add('wall');
//         }
        
//         //upper subdivision
//         generateMaze(rowStart,currentRow-2,colStart,colEnd,surroundingWall,((currentRow-1-rowStart)<(colEnd-colStart))? 'horizontal':'vertical');
        
//         //lower subdivision
//         generateMaze(currentRow+2,rowEnd,colStart,colEnd,surroundingWall,((rowEnd-(currentRow+2))>(colEnd-colStart)? 'horizontal':'vertical'));

//     }

//     else{
//         let possibleRows = [];
//         // let possibleRows = [];
//         for(let i = rowStart-1;i<=rowEnd+1;i+=2){
//             if(i>0 && i<rows-1){

//                 possibleRows.push(i);
//             }
//         }
//         let possibleCols = [];
//         for(let i =colStart;i<=colEnd;i+=2){
//                 possibleCols.push(i);
//         }

//         const currentCol = possibleCols[Math.floor(Math.random()*possibleCols.length)];
//         const randomRow = possibleRows[Math.floor(Math.random()*possibleRows.length)];

//         for(let i =rowStart-1;i<=rowEnd+1;i++){
//             if(!matrix[i]) continue;
//             const cell = matrix[i][currentCol];
//             if(!cell || i=== randomRow ||cell.classList.contains('source') ||cell.classList.contains('target')) continue;
//             cell.classList.add('wall');
//         }

//         generateMaze(rowStart,rowEnd,colStart,currentCol-2,surroundingWall,((rowEnd-rowStart)>(currentCol-2-colStart))? 'horizontal':'vertical');
//         generateMaze(rowStart,rowEnd,currentCol+2,colEnd,surroundingWall,((rowEnd-rowStart)>(colEnd-(currentCol+2)))? 'horizontal':'vertical');

//     }

// };






///////////////////////////////////////
////// PATH FINDING ALGO  /////////////
///////////////////////////////////////


///////////////  BFS  /////////////////

var visitedCell ;
var pathToAnimate;
let pathTimeouts = [];

visualizeBtn.addEventListener('click',()=>{

    // 1. Clear old timeouts so animations don't overlap
    pathTimeouts.forEach(timerId => clearTimeout(timerId));
    pathTimeouts = [];

    // 2. Clear old paths and visited cells from the board
    cells.forEach(cell => {
        cell.classList.remove('visited');
        cell.classList.remove('path');
    });

    clearPath();
    visitedCell = [];
    pathToAnimate = [];
    console.log('button');
    switch (algorithms) {
        case 'BFS':
            BFS();
            break;
        case 'A*':
            Astar();
            break;
        case 'Greedy':
            greedy();
            break;
        case 'Dijkstra':
            dijkstra();
            break;
        case 'Bi-Directional':
            biDirectional();
            break;
        default:
            break;
    }
    // BFS();
    // dijkstra();
    // greedy();
    // Astar();
    // biDirectional();
    console.log('button');
    
    animate(visitedCell, 'visited');

})

function BFS(){
    const queue = [];
    const visited = new Set();
    const parent = new Map();

    queue.push(source_cord);
    visited.add(`${source_cord.x}-${source_cord.y}`);

    while(queue.length > 0){
        const current = queue.shift();

        // Don't color the source/target blue
        if (!matrix[current.x][current.y].classList.contains('source') && 
            !matrix[current.x][current.y].classList.contains('target')) {
                visitedCell.push(matrix[current.x][current.y]);
            }
            
        if(current.x === target_cord.x && current.y === target_cord.y){
            getPath(parent,target_cord);
            return;
        }

        const r = current.x;
        const c = current.y;

        // The 4 neighbors: Up, Down, Left, Right
        const neighbors = [
            { x: r - 1, y: c },
            { x: r + 1, y: c },
            { x: r, y: c - 1 },
            { x: r, y: c + 1 }
        ];

        for(const neighbour of neighbors){
            const key = `${neighbour.x}-${neighbour.y}`;

            if(isValid(neighbour.x,neighbour.y) 
                && !visited.has(key)
            && !matrix[neighbour.x][neighbour.y].classList.contains('wall')){
                queue.push(neighbour);
                visited.add(key);
                parent.set(key,current);
            }
        }
    }
}

/////////////  ANIMATE  ///////////////

function animate(elements,className){
    let delay;
    switch (speed) {
        case "slow":
            delay = 20;
            break;
        case "normal":
            delay = 10;
            break;
        case "fast":
            delay = 5;
            break;
        default:
            break;
    }
    if( className === 'path'){
        delay *= 3;
    }
    for(let i = 0;i<elements.length;i++){
        let timerId = setTimeout(()=>{
            // elements.classList.remove('visited');
            elements[i].classList.add(className);
            if(i === elements.length-1 &&className ===  'visited'){
                pathToAnimate.reverse();
                animate(pathToAnimate,'path');
                console.log('search finished');
            }
        }, delay*i);
        pathTimeouts.push(timerId);
    }
}

function getPath(parent,target){
    if(!target) return;

    pathToAnimate.push(matrix[target.x][target.y]);

    const p = parent.get(`${target.x}-${target.y}`);

    getPath(parent,p);
}


//////////////   PRIORITY QUEUE   /////////////

// console.log('pq');
class PriorityQueue{
    constructor(){
        this.elements = [];
        this.length = 0;
    }
    swap(x,y){
        [this.elements[x],this.elements[y]] = [this.elements[y],this.elements[x]];
    }
    push(data){
        this.elements.push(data);
        this.length++;
        this.upHeapify(this.length-1);
    }
    pop(){
        this.swap(0,this.length-1);
        const popped = this.elements.pop();
        this.length--;
        this.downHeapify(0);
        return popped;
    }
    upHeapify(i){
        // node ko higher priority dena ho
        // use in push
        if(i===0)return;
        const parent = Math.floor((i-1)/2);
        if(this.elements[i].cost < this.elements[parent].cost){
            // if present element is smaller than swap with its parent
            this.swap(parent, i);
            this.upHeapify(parent);
        }

    }
    downHeapify(i){
        // use in pop
        let minNode = i;
        const leftChild = (2*i) + 1;
        const rightChild = (2*i) + 2;

        if(leftChild < this.length && this.elements[leftChild].cost < this.elements[minNode].cost){
            minNode = leftChild;
        }
        if(rightChild < this.length && this.elements[rightChild].cost < this.elements[minNode].cost){
            minNode = rightChild;
        }

        if(minNode !== i){
            this.swap(minNode,i);
            this.downHeapify(minNode);
        }
    }
    isEmpty(){
        return this.length === 0;
    }
    
}

//////////////   DIJKSTRA'S ALGO   /////////////

function dijkstra(){
    console.log('pq start');
    const pq = new PriorityQueue();
    const parent = new Map();
    const distance = [];
    
    // 1. Initialize distance array with Infinity
    for(let i = 0; i < rows; i++){
        const INF = [];
        for(let j = 0; j < cols; j++){
            INF.push(Infinity);
        }
        distance.push(INF);
    }

    // 2. Set source distance to 0 and push to queue
    distance[source_cord.x][source_cord.y] = 0;
    pq.push({cordinate: source_cord, cost: 0});

    // FIX: Added parentheses to call the function! 
    while(!pq.isEmpty()){ 
        
        // Wait, did your PriorityQueue use pop() or dequeue()? Assuming pop() based on your code:
        const {cordinate: current, cost: distanceSoFar} = pq.pop();

        // Don't color the source/target blue
        if (!matrix[current.x][current.y].classList.contains('source') && 
            !matrix[current.x][current.y].classList.contains('target')) {
            visitedCell.push(matrix[current.x][current.y]);
        }
            
        // Did we reach the target?
        if(current.x === target_cord.x && current.y === target_cord.y){
            getPath(parent, target_cord);
            return;
        }

        const r = current.x;
        const c = current.y;

        // The 4 neighbors: Up, Down, Left, Right
        const neighbors = [
            { x: r - 1, y: c },
            { x: r + 1, y: c },
            { x: r, y: c - 1 },
            { x: r, y: c + 1 }
        ];

        for(const neighbour of neighbors){
            const key = `${neighbour.x}-${neighbour.y}`;

            // Check if valid and NOT a wall
            if(isValid(neighbour.x, neighbour.y) && 
               !matrix[neighbour.x][neighbour.y].classList.contains('wall')){
                
                const edgewt = 1; // Since it's a grid, distance is always 1
                const distanceToNeighbour = distanceSoFar + edgewt;
                
                // If we found a SHORTER path to this neighbor
                if(distanceToNeighbour < distance[neighbour.x][neighbour.y]){
                    
                    // Update the shortest distance
                    distance[neighbour.x][neighbour.y] = distanceToNeighbour;
                    
                    // Push to priority queue
                    pq.push({cordinate: neighbour, cost: distanceToNeighbour});
                    
                    // Remember where we came from for the yellow path
                    parent.set(key, current);
                }
            }
        }
    }
    console.log('end');
}


//////////////   GREEDY ALGORITHM   //////////

function heuristicValue(node){
    // return dx + dy ;
    return Math.abs((node.x - target_cord.x) + node.y - target_cord.y);
}

function greedy(){
    const queue = new PriorityQueue();
    const visited = new Set();
    const parent = new Map();

    queue.push({cordinate: source_cord,cost:heuristicValue(source_cord)} );
    visited.add(`${source_cord.x}-${source_cord.y}`);

    while(queue.length > 0){
        const {cordinate: current} = queue.pop();

        // Don't color the source/target blue
        if (!matrix[current.x][current.y].classList.contains('source') && 
            !matrix[current.x][current.y].classList.contains('target')) {
                visitedCell.push(matrix[current.x][current.y]);
            }
            
        if(current.x === target_cord.x && current.y === target_cord.y){
            getPath(parent,target_cord);
            return;
        }

        const r = current.x;
        const c = current.y;

        // The 4 neighbors: Up, Down, Left, Right
        const neighbors = [
            { x: r - 1, y: c },
            { x: r + 1, y: c },
            { x: r, y: c - 1 },
            { x: r, y: c + 1 }
        ];

        for(const neighbour of neighbors){
            const key = `${neighbour.x}-${neighbour.y}`;

            if(isValid(neighbour.x,neighbour.y) 
                && !visited.has(key)
            && !matrix[neighbour.x][neighbour.y].classList.contains('wall')){
                queue.push({cordinate: neighbour, cost : heuristicValue(neighbour)});
                visited.add(key);
                parent.set(key,current);
            }
        }
    }
}

/////////////// A STAR ALGO  /////////
//Astar = dijkstra + greedy
            // dist      hv

function Astar(){
    const queue = new PriorityQueue();
    const visited = new Set(); // closed set
    const queued = new Set(); // opened set
    const parent = new Map();
    const distance = [];
    
    // 1. Initialize distance array with Infinity
    for(let i = 0; i < rows; i++){
        const INF = [];
        for(let j = 0; j < cols; j++){
            INF.push(Infinity);
        }
        distance.push(INF);
    }
    distance[source_cord.x][source_cord.y] = 0;
    queue.push({cordinate: source_cord,cost: heuristicValue(source_cord)} );
    queued.add(`${source_cord.x}-${source_cord.y}`);

    while(queue.length > 0){
        const {cordinate: current} = queue.pop();

        // Don't color the source/target blue
        if (!matrix[current.x][current.y].classList.contains('source') && 
            !matrix[current.x][current.y].classList.contains('target')) {
                visitedCell.push(matrix[current.x][current.y]);
            }
            
        if(current.x === target_cord.x && current.y === target_cord.y){
            getPath(parent,target_cord);
            return;
        }
        // push into visited
        visited.add(`${current.x}-${current.y}`); // finalize

        const r = current.x;
        const c = current.y;

        // The 4 neighbors: Up, Down, Left, Right
        const neighbors = [
            { x: r - 1, y: c },
            { x: r + 1, y: c },
            { x: r, y: c - 1 },
            { x: r, y: c + 1 }
        ];

        for(const neighbour of neighbors){
            const key = `${neighbour.x}-${neighbour.y}`;

            if(isValid(neighbour.x,neighbour.y) 
                && !visited.has(key)&&
            !queued.has(key)
            && !matrix[neighbour.x][neighbour.y].classList.contains('wall')){
                const edgewt = 1; // Since it's a grid, distance is always 1
                const distanceToNeighbour = distance[current.x][current.y] + edgewt;
                
                // If we found a SHORTER path to this neighbor
                if(distanceToNeighbour < distance[neighbour.x][neighbour.y]){
                    
                    // Update the shortest distance
                    distance[neighbour.x][neighbour.y] = distanceToNeighbour;
                    
                    // Push to priority queue
                    queue.push({cordinate: neighbour, cost: distanceToNeighbour + heuristicValue(neighbour)});
                    queued.add(key);
                    // Remember where we came from for the yellow path
                    parent.set(key, current);
                }
            }
        }
    }
}


