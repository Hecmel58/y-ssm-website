export function drawDonutChart(ctx, data){
  const w=ctx.canvas.width;const h=ctx.canvas.height;const cx=w/2;const cy=h/2;const r=Math.min(cx,cy)-10;let angle=-Math.PI/2;const total=data.reduce((s,i)=>s+i.value,0);
  data.forEach(d=>{const a=(d.value/total)*Math.PI*2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,angle,angle+a);ctx.closePath();ctx.fillStyle=d.color;ctx.fill();angle+=a});
}
export function drawLineChart(ctx, arr){const w=ctx.canvas.width;const h=ctx.canvas.height;const max=Math.max(...arr);ctx.beginPath();arr.forEach((v,i)=>{const x=(i/(arr.length-1))*(w-40)+20;const y=h-20-(v/max)*(h-40);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)});ctx.strokeStyle='#667eea';ctx.lineWidth=2;ctx.stroke()}
export function drawBarChart(ctx, arr){const w=ctx.canvas.width;const h=ctx.canvas.height;const max=Math.max(...arr);const bw=(w-40)/arr.length*0.6;arr.forEach((v,i)=>{const x=20+i*((w-40)/arr.length)+( ( (w-40)/arr.length - bw)/2 );const barH=(v/max)*(h-40);ctx.fillStyle='#667eea';ctx.fillRect(x,h-20-barH,bw,barH)})}
