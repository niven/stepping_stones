function stroke_line( from, to, color ) {
   ctx.strokeStyle = color;

   ctx.beginPath();
   ctx.moveTo( from.x, from.y);
   ctx.lineTo( to.x, to.y );
   ctx.stroke();
   
}

function stroke_path( vertices, color ) {

   ctx.strokeStyle = color;

   ctx.beginPath();
   ctx.moveTo( vertices[0].x, vertices[0].y );
   for( var i=1; i<vertices.length; i++ ) {
      ctx.lineTo( vertices[i].x, vertices[i].y );
   }
   ctx.lineTo( vertices[0].x, vertices[0].y );
   ctx.stroke();
   
}

function fill_circle( center, radius, color, border ) {

   ctx.fillStyle = color;
   ctx.strokeStyle = border;
   ctx.beginPath();
   ctx.arc( center.x, center.y, radius, 0, 2 * Math.PI);
   ctx.stroke();
   ctx.fill();
}



function stroke_rect( top_left, width, height, color ) {
   
   ctx.strokeStyle = color;
   ctx.strokeRect( top_left.x, top_left.y, width, height );
}


function fill_rect( top_left, width, height, color ) {
   
   ctx.fillStyle = color;
   ctx.fillRect( top_left.x, top_left.y, width, height );
}

function fill_path( vertices, color ) {
   ctx.fillStyle = color;

   ctx.beginPath();
   ctx.moveTo(vertices[0].x, vertices[0].y);
   for( var i=1; i<vertices.length; i++ ) {
      ctx.lineTo( vertices[i].x, vertices[i].y );
   }
   ctx.fill();

}

function render_shadow( on ) {
   
   if( on ) {
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 3;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
   } else {
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;
   }
   
}


function P(x, y) {
   return {
      "x": x,
      "y": y
   };
}

function distance_p2p( a, b ) {

   const distance_x = a.x - b.x;
   const distance_y = a.y - b.y;
   
   const distance = Math.sqrt( distance_x*distance_x + distance_y*distance_y );
   return distance;
}

function hit_triangle(a,b,c,p) {
	var planeAB = (a.x - p.x) * (b.y - p.y) - (b.x - p.x) * (a.y-p.y);
	var planeBC = (b.x - p.x) * (c.y - p.y) - (c.x - p.x) * (b.y-p.y);
	var planeCA = (c.x - p.x) * (a.y - p.y) - (a.x - p.x) * (c.y-p.y);
   
	return sign(planeAB) == sign(planeBC) && sign(planeBC) == sign(planeCA);
}

function sign(n) {
   return Math.abs(n)/n;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
