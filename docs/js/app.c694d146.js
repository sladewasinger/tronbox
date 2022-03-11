(function(){var e={3695:function(e,o,t){"use strict";var i=t(9242),r=t(3396);function n(e,o,t,i,n,s){const a=(0,r.up)("TronBox");return(0,r.wg)(),(0,r.j4)(a,{"canvas-id":"grid"})}var s=t(7139);const a=e=>((0,r.dD)("data-v-63964429"),e=e(),(0,r.Cn)(),e),d={class:"grid-box"},l=a((()=>(0,r._)("div",{class:"header"},[(0,r._)("h1",null,"Battle Tron")],-1))),c={class:"flex-box-row"},h=a((()=>(0,r._)("p",{class:"tip"}," Press 'a' or 'b' on the keyboard to place a bot at your mouse position! ",-1))),u=["id"],v={key:0},f=a((()=>(0,r._)("h2",null,"Winners:",-1))),p={class:"editor"},g={class:"controls"},b={class:"multi-control"},y={class:"multi-control"};function m(e,o,t,n,a,m){return(0,r.wg)(),(0,r.iD)("div",d,[l,(0,r._)("div",c,[(0,r._)("div",null,[h,(0,r._)("canvas",{id:t.canvasId,ref:"canvas",width:"500",class:"canvas-style",height:"500",onMousemove:o[0]||(o[0]=(...e)=>m.mouseMove&&m.mouseMove(...e)),onMouseenter:o[1]||(o[1]=(...e)=>m.canvasMouseEnter&&m.canvasMouseEnter(...e)),onMouseleave:o[2]||(o[2]=(...e)=>m.canvasMouseLeave&&m.canvasMouseLeave(...e))},null,40,u),m.showWinnerText?((0,r.wg)(),(0,r.iD)("div",v,[f,(0,r._)("ol",null,[((0,r.wg)(!0),(0,r.iD)(r.HY,null,(0,r.Ko)(e.engine.winners,(e=>((0,r.wg)(),(0,r.iD)("li",{key:e.id},[(0,r._)("b",{style:(0,s.j5)(`color: ${e.color}`)},"TRAIL ["+(0,s.zw)(e.id)+"]",5),(0,r.Uk)(" - POINTS: "+(0,s.zw)(e.points),1)])))),128))])])):(0,r.kq)("",!0)]),(0,r._)("div",p,[(0,r._)("div",g,[(0,r._)("div",b,[(0,r._)("button",{class:"btn btn-dark",onClick:o[3]||(o[3]=o=>m.addBot(e.botA))},"ADD [A]"),(0,r.wy)((0,r._)("input",{id:"colorPickerA","onUpdate:modelValue":o[4]||(o[4]=o=>e.botA.color=o),type:"color"},null,512),[[i.nr,e.botA.color]])]),(0,r._)("div",y,[(0,r._)("button",{class:"btn btn-dark",onClick:o[5]||(o[5]=o=>m.addBot(e.botB))},"ADD [B]"),(0,r.wy)((0,r._)("input",{id:"colorPickerB","onUpdate:modelValue":o[6]||(o[6]=o=>e.botB.color=o),type:"color"},null,512),[[i.nr,e.botB.color]])]),(0,r._)("button",{class:"btn btn-dark",onClick:o[7]||(o[7]=(...e)=>m.clear&&m.clear(...e))},"CLEAR"),(0,r._)("button",{class:"btn btn-dark",onClick:o[8]||(o[8]=(...e)=>m.reset&&m.reset(...e))},"RANDOM"),(0,r._)("button",{class:"btn btn-dark",onClick:o[9]||(o[9]=(...e)=>m.togglePause&&m.togglePause(...e))},(0,s.zw)(m.pauseBtnText),1),(0,r._)("button",{class:"btn btn-dark",onClick:o[10]||(o[10]=(...e)=>m.step&&m.step(...e))},"STEP")]),(0,r.wy)((0,r._)("textarea",{"onUpdate:modelValue":o[11]||(o[11]=o=>e.botA.js=o),class:"code-area",style:(0,s.j5)(`border-color: ${e.botA.prevColor}`)},null,4),[[i.nr,e.botA.js]]),(0,r.wy)((0,r._)("textarea",{"onUpdate:modelValue":o[12]||(o[12]=o=>e.botB.js=o),class:"code-area",style:(0,s.j5)(`border-color: ${e.botB.prevColor}`)},null,4),[[i.nr,e.botB.js]])])])])}t(2262),t(4506);var w=t(9782);class P{constructor(){}static isOccupied(e,o){if(e&&e.length&&e[0].length&&!(o.x>=e.length||o.x<0||o.y<0||o.y>=e[o.x].length))return!!e[o.x][o.y].occupied}static flatten(e){return e.map(((e,o)=>e.map(((e,t)=>(e.gridPosition=new Point(o,t),e))))).flatMap((e=>e))}}const x=t(5445);class M{constructor(e){this.canvasId=e,this.reset()}reset(){x.project?.activeLayer?.removeChildren(),x.projects.forEach((e=>{console.log("Unexpected project found. Removing..."),e.remove()})),x.setup(this.canvasId),this.grid=void 0,this.trailStuff={},this.colors=["#A72334","#FC7A43","#ECCF39","#6FAF60","#02654B","#188DBF","#22379B","#7209b7","#f72585"],this.colorIndex=0}convertMousePosToGridPos(e){if(this.grid){var o=P.flatten(this.grid).find((o=>o.hitTest(new w.Point(e.x,e.y))));return o?o.gridPosition:void 0}}render(e,o){if(void 0===this.grid){var t=50;this.grid=e.map(((e,o)=>e.map(((e,i)=>{var r=new x.Path.Rectangle(new x.Point(o*t,i*t),new x.Size(t,t));return r.strokeColor="#444",r.fillColor="#090909",r}))))}for(let i of o){this.trailStuff[i.id]||(this.trailStuff[i.id]={});let e=this.trailStuff[i.id];for(let r of i.tail){let e=this.grid[r.x][r.y];e.fillColor=i.color,e.strokeWidth=1,e.shadowColor="#000",e.shadowBlur=10}e.wireframe||(e.wireframe=new x.Path([...i.tail,i.head].map((e=>this.grid[e.x][e.y].position))),e.wireframe.strokeColor=new x.Color(0,0,0,.25),e.wireframe.strokeWidth=5),e.wireframe.segments.at(-1).x!=i.head.x&&e.wireframe.segments.at(-1).y!=i.head.y&&e.wireframe.add(this.grid[i.head.x][i.head.y].position);let o=this.grid[i.head.x][i.head.y];o.strokeColor=i.color,o.fillColor=i.color,o.strokeWidth=10,o.shadowColor="#000",o.shadowBlur=20,o.bringToFront();let t=e.headIndicator;if(t||(t=new x.Path.Circle(o.position,15),t.fillColor=i.color,t.strokeColor="#FFF",t.strokeWidth=10,e.headIndicator=t),!i.alive&&!e.deadSymbolHead){t.remove();let i=new x.Path.RegularPolygon(o.position,3,25);i.fillColor="#000",i.position=o.position,e.deadSymbolHead=i}e.wireframe.bringToFront(),t.bringToFront(),t.position=o.position,e.deadSymbolHead?.bringToFront()}}}class T{constructor(e=0,o=0){this.x=e,this.y=o}}const k={colors:["#A72334","#FC7A43","#ECCF39","#6FAF60","#02654B","#188DBF","#22379B","#7209b7","#f72585"],MoveDirection:{UP:new T(0,-1),DOWN:new T(0,1),LEFT:new T(-1,0),RIGHT:new T(1,0)}};class C{constructor(){window.Constants=k,window.Point=w.Point,window.Grid=P,this.reset()}reset(){this.path=null,this.point={x:0,y:0},this.grid=void 0,this.trails=[],this.gridWidth=10,this.colorIndex=0,this.winners=[],this.createGrid()}get allBotsDead(){return this.trails.length&&this.trails.every((e=>!e.alive))}createGrid(){this.grid=[];for(var e=0;e<this.gridWidth;e++){this.grid[e]=[];for(var o=0;o<this.gridWidth;o++){var t={id:void 0,get occupied(){return void 0!=this.id}};this.grid[e].push(t)}}}createTrail(e,o,t,i,r){let n={head:new w.Point(e,o),tail:[],color:t,alive:!0,id:i,getMove:r,applyMove(e,o,t,i){if(!i||void 0==i.x||void 0==i.y)return console.log("Error - moveDir is not a valid Point object. Killing trail. moveDir supplied:",i),void(this.alive=!1);if(!Object.keys(k.MoveDirection).map((e=>k.MoveDirection[e])).some((e=>i.x==e.x&&i.y==e.y)))return console.log("Invalid move supplied! Killing trail. Move supplied: ",i),void(this.alive=!1);let r=new w.Point(t.x+i.x,t.y+i.y);if(r.x<0||r.x>=e.length||r.y<0||r.y>=e[0].length)return console.log(`%cTRAIL [${this.id}] %ctried to escape the grid! They failed...`,"color: "+this.color,"color: auto"),void(this.alive=!1);if(e[r.x][r.y].occupied){var s=e[r.x][r.y].id,a=o.find((e=>e.id==s));return console.log(`%cTRAIL [${this.id}] %chit %cTRAIL [${a.id}]`,"color: "+this.color,"color: auto","color: "+a.color),void(this.alive=!1)}return this.tail.push(this.head),this.head=r,e[n.head.x][n.head.y].id=n.id,!0}};return n}parseRawJsIntoGetMoveFunction(e){let o=new Function("return getMove; "+e)();return o}getRandomValidPos(){var e=P.flatten(this.grid).filter((e=>!e.occupied));if(!(e.length<1)){var o=e[Math.floor(Math.random()*e.length)].gridPosition;return o}console.log("No open spots to spawn in a tron bike!")}getRandomColor(){var e=k.colors[this.colorIndex++];if(!(this.colorIndex>=k.colors.length))return e;console.log("No more colors to create a trail with...")}addTrail(e,o,t){if(this.allBotsDead)console.log("All bots are dead - please reset before addinga new bot.");else if(t=t||this.getRandomValidPos(),t){o=o||this.getRandomColor();var i=this.trails.length,r=this.createTrail(t.x,t.y,o,i,e);this.trails.push(r),this.grid[r.head.x][r.head.y].id=r.id}}getRandomColor(){const e=(e,o)=>Math.floor(Math.random()*(o-e+1))+e;function o(e,o,t){t/=100;const i=o*Math.min(t,1-t)/100,r=o=>{const r=(o+e/30)%12,n=t-i*Math.max(Math.min(r-3,9-r,1),-1);return Math.round(255*n).toString(16).padStart(2,"0")};return`#${r(0)}${r(8)}${r(4)}`}var t=e(0,360),i=e(50,100),r=e(30,70);return o(t,i,r)}determineWinners(){if(this.trails.length<1)return;var e=P.flatten(this.grid).filter((e=>e.occupied)).reduce(((e,o)=>(e[o.id]||(e[o.id]={points:0,id:o.id}),e[o.id].points+=1,e)),{});if(Object.keys(e).length<1)return;let o=Object.keys(e).map((o=>e[o])).sort(((e,o)=>o.points-e.points))[0].points,t=Object.keys(e).map((o=>e[o])).filter((e=>e.points==o));for(var i of Object.keys(e).map((o=>e[o])))console.log(`TRAIL [${i.id}] has ${i.points} points.`);console.log("\n\n\n"),console.log("#############################"),console.log("##         WINNERS         ##"),console.log("#############################");var r="WON";for(var n of(t.length>1&&(console.log(" -- IT'S A TIE! -- "),r="TIED"),t)){let e=this.trails.find((e=>e.id==n.id));e.points=n.points,console.log(`%c!!!! %cTRAIL [${e.id}] %c${r} WITH ${n.points} POINTS!!!!`,"color: auto",`color: ${e.color};`,"color: auto"),this.winners.push(e)}}iterateTrails(){let e=!1;for(let i of this.trails.filter((e=>e.alive))){try{var o=i.getMove(this.grid,i.head)}catch(t){console.log("Error executing script: ",t,i.getMove)}let r=i.applyMove(this.grid,this.trails,i.head,o)||!1;r&&(e=!0)}this.allBotsDead&&this.determineWinners()}step(){this.allBotsDead||this.iterateTrails()}}var I="// Clockwise bot - Example:\nfunction getMove(grid, headPos) {\n  var dir = Constants.MoveDirection;\n  if (validMove(grid, headPos, dir.RIGHT)) return dir.RIGHT;\n  if (validMove(grid, headPos, dir.DOWN)) return dir.DOWN;\n  if (validMove(grid, headPos, dir.LEFT)) return dir.LEFT;\n  if (validMove(grid, headPos, dir.UP)) return dir.UP;\n  return dir.RIGHT;\n}\n\nfunction validMove(grid, headPos, move) {\n  var nextPos = new Point(headPos.x + move.x, headPos.y + move.y);\n  var isOccupied = Grid.isOccupied(grid, nextPos);\n  return isOccupied == false; // this works because isOccupied is \n  //    exactly false if the square is free, \n  //    true if occupied, \n  //    undefined if out of bounds\n}",O="// Counter-Clockwise bot - Example:\nfunction getMove(grid, headPos) {\n  var dir = Constants.MoveDirection;\n  if (validMove(grid, headPos, dir.LEFT)) return dir.LEFT;\n  if (validMove(grid, headPos, dir.DOWN)) return dir.DOWN;\n  if (validMove(grid, headPos, dir.RIGHT)) return dir.RIGHT;\n  if (validMove(grid, headPos, dir.UP)) return dir.UP;\n  return dir.RIGHT;\n}\n\nfunction validMove(grid, headPos, move) {\n  var nextPos = new Point(headPos.x + move.x, headPos.y + move.y);\n  var isOccupied = Grid.isOccupied(grid, nextPos);\n  return isOccupied == false; // this works because isOccupied is \n  //    exactly false if the square is free, \n  //    true if occupied, \n  //    undefined if out of bounds\n}",B={name:"TronBox",props:{canvasId:{type:String,required:!0}},data:()=>({botA:{js:void 0,color:"#FF0000",prevColor:"#FF0000"},botB:{js:void 0,color:"#0000FF",prevColor:"#0000FF"},renderer:void 0,engine:void 0,paused:!0,mousePos:{x:0,y:0},mouseIsOnCanvas:!1,lastKeyPressed:void 0}),computed:{pauseBtnText:function(){return this.paused?"PLAY":"PAUSE"},showWinnerText:function(){return this.engine?.winners?.length>0}},mounted(){window.addEventListener("keydown",this.keyDown),window.addEventListener("keyup",this.keyUp),this.renderer=new M(this.canvasId),this.engine=new C,this.botA.js=I,this.botB.js=O,this.start()},methods:{addBot(e,o){let t=this.engine.parseRawJsIntoGetMoveFunction(e.js);this.engine.addTrail(t,e.color,o),e.prevColor=e.color,e.color=this.engine.getRandomColor()},clear(){this.engine.reset(),this.renderer.reset()},step(){this.engine.step()},reset(){this.clear(),this.addInitialTrails()},addInitialTrails(){this.addBot(this.botA),this.addBot(this.botB)},start(){this.addInitialTrails(),this.loop()},togglePause(){this.paused=!this.paused},canvasMouseEnter(){this.mouseIsOnCanvas=!0},canvasMouseLeave(){this.mouseIsOnCanvas=!1},addBotAtMousePos(e){if(this.mouseIsOnCanvas){var o=this.renderer.convertMousePosToGridPos(this.mousePos);o&&!Grid.isOccupied(this.engine.grid,o)&&this.addBot(e,o)}},keyDown(e){this.lastKeyPressed!=e.key&&(this.lastKeyPressed=e.key,"a"==e.key?this.addBotAtMousePos(this.botA):"b"==e.key&&this.addBotAtMousePos(this.botB))},keyUp(e){this.lastKeyPressed=void 0},mouseMove(e){var o=this.$refs.canvas.getBoundingClientRect();this.mousePos={x:Math.floor(e.clientX-o.left),y:Math.floor(e.clientY-o.top)}},loop(){this.paused||this.engine.step(),this.renderer.render(this.engine.grid,this.engine.trails),setTimeout(this.loop,50)}}},A=t(89);const F=(0,A.Z)(B,[["render",m],["__scopeId","data-v-63964429"]]);var D=F,j={name:"App",components:{TronBox:D}};const _=(0,A.Z)(j,[["render",n]]);var R=_;t(8937);(0,i.ri)(R).mount("#app")},858:function(){},4158:function(){}},o={};function t(i){var r=o[i];if(void 0!==r)return r.exports;var n=o[i]={exports:{}};return e[i].call(n.exports,n,n.exports,t),n.exports}t.m=e,function(){var e=[];t.O=function(o,i,r,n){if(!i){var s=1/0;for(c=0;c<e.length;c++){i=e[c][0],r=e[c][1],n=e[c][2];for(var a=!0,d=0;d<i.length;d++)(!1&n||s>=n)&&Object.keys(t.O).every((function(e){return t.O[e](i[d])}))?i.splice(d--,1):(a=!1,n<s&&(s=n));if(a){e.splice(c--,1);var l=r();void 0!==l&&(o=l)}}return o}n=n||0;for(var c=e.length;c>0&&e[c-1][2]>n;c--)e[c]=e[c-1];e[c]=[i,r,n]}}(),function(){t.n=function(e){var o=e&&e.__esModule?function(){return e["default"]}:function(){return e};return t.d(o,{a:o}),o}}(),function(){t.d=function(e,o){for(var i in o)t.o(o,i)&&!t.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:o[i]})}}(),function(){t.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){t.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)}}(),function(){t.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){var e={143:0};t.O.j=function(o){return 0===e[o]};var o=function(o,i){var r,n,s=i[0],a=i[1],d=i[2],l=0;if(s.some((function(o){return 0!==e[o]}))){for(r in a)t.o(a,r)&&(t.m[r]=a[r]);if(d)var c=d(t)}for(o&&o(i);l<s.length;l++)n=s[l],t.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return t.O(c)},i=self["webpackChunktronbox"]=self["webpackChunktronbox"]||[];i.forEach(o.bind(null,0)),i.push=o.bind(null,i.push.bind(i))}();var i=t.O(void 0,[998],(function(){return t(3695)}));i=t.O(i)})();
//# sourceMappingURL=app.c694d146.js.map