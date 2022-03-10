(function(){var e={3481:function(e,i,t){"use strict";var o=t(9242),r=t(3396);function n(e,i,t,o,n,s){const a=(0,r.up)("TronBox");return(0,r.wg)(),(0,r.j4)(a,{"canvas-id":"grid"})}var s=t(7139);const a=e=>((0,r.dD)("data-v-fa9ddcc0"),e=e(),(0,r.Cn)(),e),d={class:"grid-box"},l=a((()=>(0,r._)("div",{class:"header"},[(0,r._)("h1",null,"Battle Tron")],-1))),c={class:"flex-box-row"},h=["id"],u={class:"editor"},f={class:"controls"};function v(e,i,t,n,a,v){return(0,r.wg)(),(0,r.iD)("div",d,[l,(0,r._)("div",c,[(0,r._)("div",null,[(0,r._)("canvas",{id:t.canvasId,class:"canvas-style",width:"500",height:"500"},null,8,h)]),(0,r._)("div",u,[(0,r._)("div",f,[(0,r._)("button",{class:"btn btn-dark",onClick:i[0]||(i[0]=e=>v.addTrail_A())},"ADD [A]"),(0,r._)("button",{class:"btn btn-dark",onClick:i[1]||(i[1]=e=>v.addTrail_B())},"ADD [B]"),(0,r._)("button",{class:"btn btn-dark",onClick:i[2]||(i[2]=e=>v.clear())},"CLEAR"),(0,r._)("button",{class:"btn btn-dark",onClick:i[3]||(i[3]=e=>v.reset())},"RESET"),(0,r._)("button",{class:"btn btn-dark",onClick:i[4]||(i[4]=e=>v.togglePause())},(0,s.zw)(v.pauseBtnText),1)]),(0,r.wy)((0,r._)("textarea",{"onUpdate:modelValue":i[5]||(i[5]=i=>e.aiJs_A=i),class:"code-area"},null,512),[[o.nr,e.aiJs_A]]),(0,r.wy)((0,r._)("textarea",{"onUpdate:modelValue":i[6]||(i[6]=i=>e.aiJs_B=i),class:"code-area"},null,512),[[o.nr,e.aiJs_B]])])])])}t(2262),t(4506);const p=t(5445);class g{constructor(e){this.canvasId=e,this.reset()}reset(){p.project?.activeLayer?.removeChildren(),p.projects.forEach((e=>{console.log("Unexpected project found. Removing..."),e.remove()})),p.setup(this.canvasId),this.grid=void 0,this.trailStuff={},this.colors=["#A72334","#FC7A43","#ECCF39","#6FAF60","#02654B","#188DBF","#22379B","#7209b7","#f72585"],this.colorIndex=0}render(e,i){if(void 0===this.grid){var t=50;this.grid=e.map(((e,i)=>e.map(((e,o)=>{var r=new p.Path.Rectangle(new p.Point(i*t,o*t),new p.Size(t,t));r.strokeColor="#444";let n="#090909";return r.fillColor=n,r}))))}for(let o of i){this.trailStuff[o.id]||(this.trailStuff[o.id]={});let e=this.trailStuff[o.id];for(let r of o.tail){let e=this.grid[r.x][r.y];e.fillColor=o.color,e.strokeWidth=1,e.shadowColor="#000",e.shadowBlur=10}e.wireframe||(e.wireframe=new p.Path([...o.tail,o.head].map((e=>this.grid[e.x][e.y].position))),e.wireframe.strokeColor=new p.Color(0,0,0,.25),e.wireframe.strokeWidth=5),e.wireframe.segments.at(-1).x!=o.head.x&&e.wireframe.segments.at(-1).y!=o.head.y&&e.wireframe.add(this.grid[o.head.x][o.head.y].position);let i=this.grid[o.head.x][o.head.y];i.strokeColor=o.color,i.fillColor=o.color,i.strokeWidth=10,i.shadowColor="#000",i.shadowBlur=20,i.bringToFront();let t=e.headIndicator;if(t||(t=new p.Path.Circle(i.position,15),t.fillColor=o.color,t.strokeColor="#FFF",t.strokeWidth=10,e.headIndicator=t),!o.alive&&!e.deadSymbolHead){t.remove();let o=new p.Path.RegularPolygon(i.position,3,25);o.fillColor="#000",o.position=i.position,e.deadSymbolHead=o}e.wireframe.bringToFront(),t.bringToFront(),t.position=i.position,e.deadSymbolHead?.bringToFront()}}}class w{constructor(e=0,i=0){this.x=e,this.y=i}}const x={colors:["#A72334","#FC7A43","#ECCF39","#6FAF60","#02654B","#188DBF","#22379B","#7209b7","#f72585"],MoveDirection:{UP:new w(0,-1),DOWN:new w(0,1),LEFT:new w(-1,0),RIGHT:new w(1,0)}};var m=t(9782);class y{constructor(){}static isOccupied(e,i){if(e&&e.length&&e[0].length&&!(i.x>=e.length||i.x<0||i.y<0||i.y>=e[i.x].length))return!!e[i.x][i.y].occupied}static flatten(e){return e.map(((e,i)=>e.map(((e,t)=>({occupied:e.occupied,position:new Point(i,t)}))))).flatMap((e=>e))}}class b{constructor(){window.Constants=x,window.Point=m.Point,window.Grid=y,this.paused=!0,this.reset()}reset(){this.path=null,this.point={x:0,y:0},this.grid=void 0,this.trails=[],this.gridWidth=10,this.colorIndex=0,this.createGrid()}createGrid(){this.grid=[];for(var e=0;e<this.gridWidth;e++){this.grid[e]=[];for(var i=0;i<this.gridWidth;i++){var t={id:void 0,get occupied(){return void 0!=this.id}};this.grid[e].push(t)}}}createTrail(e,i,t,o,r){let n={head:new m.Point(e,i),tail:[],color:t,alive:!0,id:o,getMove:r,applyMove(e,i,t,o){if(!o||void 0==o.x||void 0==o.y)return console.log("Error - moveDir is not a valid Point object. Killing trail. moveDir supplied:",o),void(this.alive=!1);if(!Object.keys(x.MoveDirection).map((e=>x.MoveDirection[e])).some((e=>o.x==e.x&&o.y==e.y)))return console.log("Invalid move supplied! Killing trail. Move supplied: ",o),void(this.alive=!1);let r=new m.Point(t.x+o.x,t.y+o.y);if(r.x<0||r.x>=e.length||r.y<0||r.y>=e[0].length)return console.log(`%cTRAIL [${this.id}] %ctried to escape the grid! They failed...`,"color: "+this.color,"color: auto"),void(this.alive=!1);if(e[r.x][r.y].occupied){var s=e[r.x][r.y].id,a=i.find((e=>e.id==s));return console.log(`%cTRAIL [${this.id}] %chit %cTRAIL [${a.id}]`,"color: "+this.color,"color: auto","color: "+a.color),void(this.alive=!1)}this.tail.push(this.head),this.head=r,e[n.head.x][n.head.y].id=n.id}};return n}parseRawJsIntoGetMoveFunction(e){let i=new Function("return getMove; "+e)();return i}addTrail(e){var i=this.grid.map(((e,i)=>e.map(((e,t)=>({occupied:e.occupied,position:new m.Point(i,t)}))))).flatMap((e=>e)).filter((e=>!e.occupied));if(i.length<1)console.log("No open spots to spawn in a tron bike!");else{var t=i[Math.floor(Math.random()*i.length)].position,o=x.colors[this.colorIndex++];if(this.colorIndex>=x.colors.length)console.log("No more colors to create a trail with...");else{var r=this.trails.length,n=this.createTrail(t.x,t.y,o,r,e);this.trails.push(n),this.grid[n.head.x][n.head.y].id=n.id}}}iterateTrails(){for(let t of this.trails.filter((e=>e.alive))){try{var e=t.getMove(this.grid,t.head)}catch(i){console.log("Error executing script: ",i,t.getMove)}t.applyMove(this.grid,this.trails,t.head,e)}}pause(){this.paused=!0}resume(){this.paused=!1}loop(){this.paused||this.iterateTrails()}}var P="// Clockwise bot - Example:\nfunction getMove(grid, headPos) {\n  var dir = Constants.MoveDirection;\n  if (validMove(grid, headPos, dir.RIGHT)) return dir.RIGHT;\n  if (validMove(grid, headPos, dir.DOWN)) return dir.DOWN;\n  if (validMove(grid, headPos, dir.LEFT)) return dir.LEFT;\n  if (validMove(grid, headPos, dir.UP)) return dir.UP;\n  return dir.RIGHT;\n}\n\nfunction validMove(grid, headPos, move) {\n  var nextPos = new Point(headPos.x + move.x, headPos.y + move.y);\n  var isOccupied = Grid.isOccupied(grid, nextPos);\n  return isOccupied == false; // this works because isOccupied is \n  //    exactly false if the square is free, \n  //    true if occupied, \n  //    undefined if out of bounds\n}",T="// Counter-Clockwise bot - Example:\nfunction getMove(grid, headPos) {\n  var dir = Constants.MoveDirection;\n  if (validMove(grid, headPos, dir.LEFT)) return dir.LEFT;\n  if (validMove(grid, headPos, dir.DOWN)) return dir.DOWN;\n  if (validMove(grid, headPos, dir.RIGHT)) return dir.RIGHT;\n  if (validMove(grid, headPos, dir.UP)) return dir.UP;\n  return dir.RIGHT;\n}\n\nfunction validMove(grid, headPos, move) {\n  var nextPos = new Point(headPos.x + move.x, headPos.y + move.y);\n  var isOccupied = Grid.isOccupied(grid, nextPos);\n  return isOccupied == false; // this works because isOccupied is \n  //    exactly false if the square is free, \n  //    true if occupied, \n  //    undefined if out of bounds\n}",_={name:"TronBox",props:{canvasId:{type:String,required:!0}},data:()=>({aiJs_A:"",aiJs_B:"",renderer:void 0,engine:void 0}),computed:{pauseBtnText:function(){return this.engine?.paused?"PLAY":"PAUSE"}},mounted(){this.renderer=new g(this.canvasId),this.engine=new b,this.aiJs_A=P,this.aiJs_B=T,this.start()},methods:{addTrail_A(){let e=this.engine.parseRawJsIntoGetMoveFunction(this.aiJs_A);this.engine.addTrail(e)},addTrail_B(){let e=this.engine.parseRawJsIntoGetMoveFunction(this.aiJs_B);this.engine.addTrail(e)},clear(){this.engine.reset(),this.renderer.reset()},reset(){this.clear(),this.addInitialTrails()},addInitialTrails(){this.addTrail_A(),this.addTrail_B()},start(){this.addInitialTrails(),this.loop()},togglePause(){this.engine.paused?this.engine.resume():this.engine.pause()},loop(){this.engine.loop(),this.renderer.render(this.engine.grid,this.engine.trails),setTimeout(this.loop,50)}}},C=t(89);const M=(0,C.Z)(_,[["render",v],["__scopeId","data-v-fa9ddcc0"]]);var k=M,I={name:"App",components:{TronBox:k}};const O=(0,C.Z)(I,[["render",n]]);var F=O;t(8937);(0,o.ri)(F).mount("#app")},858:function(){},4158:function(){}},i={};function t(o){var r=i[o];if(void 0!==r)return r.exports;var n=i[o]={exports:{}};return e[o].call(n.exports,n,n.exports,t),n.exports}t.m=e,function(){var e=[];t.O=function(i,o,r,n){if(!o){var s=1/0;for(c=0;c<e.length;c++){o=e[c][0],r=e[c][1],n=e[c][2];for(var a=!0,d=0;d<o.length;d++)(!1&n||s>=n)&&Object.keys(t.O).every((function(e){return t.O[e](o[d])}))?o.splice(d--,1):(a=!1,n<s&&(s=n));if(a){e.splice(c--,1);var l=r();void 0!==l&&(i=l)}}return i}n=n||0;for(var c=e.length;c>0&&e[c-1][2]>n;c--)e[c]=e[c-1];e[c]=[o,r,n]}}(),function(){t.n=function(e){var i=e&&e.__esModule?function(){return e["default"]}:function(){return e};return t.d(i,{a:i}),i}}(),function(){t.d=function(e,i){for(var o in i)t.o(i,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:i[o]})}}(),function(){t.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){t.o=function(e,i){return Object.prototype.hasOwnProperty.call(e,i)}}(),function(){t.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){var e={143:0};t.O.j=function(i){return 0===e[i]};var i=function(i,o){var r,n,s=o[0],a=o[1],d=o[2],l=0;if(s.some((function(i){return 0!==e[i]}))){for(r in a)t.o(a,r)&&(t.m[r]=a[r]);if(d)var c=d(t)}for(i&&i(o);l<s.length;l++)n=s[l],t.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return t.O(c)},o=self["webpackChunktronbox"]=self["webpackChunktronbox"]||[];o.forEach(i.bind(null,0)),o.push=i.bind(null,o.push.bind(o))}();var o=t.O(void 0,[998],(function(){return t(3481)}));o=t.O(o)})();
//# sourceMappingURL=app.d60370f1.js.map