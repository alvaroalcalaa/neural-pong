const canvas = document.querySelector("#game"), ctx = canvas.getContext("2d");
const keys = new Set(), scoreEl = ["playerScore","aiScore"].map(id=>document.getElementById(id));
const readEl = document.getElementById("read"), confidenceEl = document.getElementById("confidence");
const W=canvas.width,H=canvas.height,pad={w:14,h:90,speed:7}, player={x:32,y:H/2-pad.h/2}, ai={x:W-46,y:H/2-pad.h/2};
let ball, score=[0,0], model={bias:0,speed:0,samples:0};

function serve(direction=Math.random()>.5?1:-1){
  ball={x:W/2,y:H/2,r:8,vx:direction*5,vy:(Math.random()-.5)*5};
}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function updateModel(){
  if(ball.vx<0) return;
  const alpha=.16, normalized=(ball.y-H/2)/(H/2);
  model.bias=model.samples ? model.bias*(1-alpha)+normalized*alpha : normalized;
  model.speed=model.samples ? model.speed*(1-alpha)+Math.abs(ball.vy)*alpha : Math.abs(ball.vy);
  model.samples++;
}
function resetPoint(winner){
  score[winner]++; scoreEl.forEach((el,i)=>el.textContent=score[i]);
  if(score[winner]===7){ alert((winner?"AI":"YOU")+" WIN"); score=[0,0]; scoreEl.forEach(el=>el.textContent=0); model={bias:0,speed:0,samples:0}; }
  serve(winner?1:-1);
}
function collide(p){
  return ball.x-ball.r<p.x+pad.w && ball.x+ball.r>p.x && ball.y+ball.r>p.y && ball.y-ball.r<p.y+pad.h;
}
function step(){
  if(keys.has("w")||keys.has("arrowup")) player.y-=pad.speed;
  if(keys.has("s")||keys.has("arrowdown")) player.y+=pad.speed;
  player.y=clamp(player.y,0,H-pad.h);

  // Explainable adaptive policy: aim towards the learned vertical bias.
  const target=H/2 + model.bias*(H*.28) - pad.h/2;
  const aiSpeed=3.1+Math.min(model.samples*.035,2.4);
  ai.y+=clamp(target-ai.y,-aiSpeed,aiSpeed); ai.y=clamp(ai.y,0,H-pad.h);

  ball.x+=ball.vx; ball.y+=ball.vy;
  if(ball.y<ball.r||ball.y>H-ball.r){ball.vy*=-1;ball.y=clamp(ball.y,ball.r,H-ball.r)}
  if(collide(player)&&ball.vx<0){ball.vx=Math.abs(ball.vx)*1.04;ball.vy+=(ball.y-(player.y+pad.h/2))*.09; updateModel();}
  if(collide(ai)&&ball.vx>0){ball.vx=-Math.abs(ball.vx)*1.04;ball.vy+=(ball.y-(ai.y+pad.h/2))*.06;}
  if(ball.x<-20) resetPoint(1); if(ball.x>W+20) resetPoint(0);

  const confidence=Math.min(96,Math.round(model.samples*8));
  readEl.textContent=model.samples<3?"CALIBRATING":model.bias>.12?"EXPECTING HIGH RETURNS":model.bias<-.12?"EXPECTING LOW RETURNS":"EXPECTING CENTER";
  confidenceEl.textContent=confidence+"%";
}
function draw(){
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle="#7cffcb33";ctx.setLineDash([10,14]);ctx.beginPath();ctx.moveTo(W/2,0);ctx.lineTo(W/2,H);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle="#7cffcb";ctx.fillRect(player.x,player.y,pad.w,pad.h);
  ctx.fillStyle="#ff4d9d";ctx.fillRect(ai.x,ai.y,pad.w,pad.h);
  ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();
  ctx.fillStyle="#a8b6cc";ctx.font="12px ui-monospace";ctx.fillText("MODEL SAMPLES: "+model.samples,14,22);
}
function loop(){step();draw();requestAnimationFrame(loop)}
addEventListener("keydown",e=>keys.add(e.key.toLowerCase()));
addEventListener("keyup",e=>keys.delete(e.key.toLowerCase()));
document.querySelector("#restart").onclick=()=>{score=[0,0];model={bias:0,speed:0,samples:0};scoreEl.forEach(el=>el.textContent=0);serve()};
serve();loop();
