const min = 60;
const size = 60;
const t = 30;//text size
const r = size / 2;
const wxh = 8;

const Color = {
   "light": "moccasin",
   "dark": "deepskyblue",
   "brown": "peru",
   "white": "oldlace",
   "border": "maroon",
   "highlight": "rgba(250, 100, 100, 50)",
   "transparant": "rgba(0,0,0,0)",
   "number": "slategrey",
   "highlight_possible_tile": "rgba(50,255,50,0.4)",
};



function map_debug_draw_text() {


   ctx.fillStyle = "black";
   ctx.font = ((4*t)/12) + 'px serif';
   world.debug.map.text.forEach( i => {
      ctx.fillText( i[1], i[0].x, i[0].y );
   });



}

function map_debug_draw_lines() {
   
   ctx.lineWidth = "2";
   ctx.setLineDash([5, 1]);

   world.debug.map.lines.forEach( l => stroke_line( ...l) );
}

function map_debug_draw_highlight_tiles() {
   
   ctx.lineWidth = "2";
   ctx.setLineDash([5, 1]);

   world.debug.map.highlight_tiles.forEach( t => fill_path( t.vertices, Color.highlight ) );

}


function map_init() {

   ui_add_click_handler( process_tile_click );

   world.map = {
      "tiles": [],      
      "disks": [],      
      "selected_disk": null,
      "possible_tiles": [],
   };
   world.debug.map = {
      "lines": [],
      "highlight_tiles": [],
      "text": []
   }

   for( var i=0; i<wxh; i++ ) {
      for( var j=0; j<wxh; j++ ) {
         Tile(i,j, ((i+j) % 2 == 0) ? Color.light : Color.dark );
      }
   }

   // Make the brown disk with value 1
   Disk( wxh+1, 0, 1 );
   // Make the first white disk with value 2
   Disk( wxh+2, 0, 2 );

}

function Disk( x, y, n ) {

   const origin = {
      "x": min + x*size,
      "y": min + y*size
   };


   const disk = {
      "id": world.map.disks.length + 1, // avoid ID 0
      "loc": P(x,y),
      "center": P( origin.x + r, origin.y + r ),
      "color": n == 1 ? Color.brown : Color.white,
      "number": n
   };
   
   world.debug.map.text.push( [ P(origin.x, origin.y), "[" + disk.loc.x + "," + disk.loc.y + "]"] );

   world.map.disks.push( disk );

   return disk;

}

function Tile(x, y, color ) {

   // coords to px. r is "radius", size is size of tile
   const origin = {
      "x": min + x*size,
      "y": min + y*size
   };
   
   const tile = {
      "id": world.map.tiles.length + 1, // avoid ID 0
      "loc": P(x,y),
      "center": P( origin.x + r, origin.y + r ),
      "vertices": [
         P(origin.x,       origin.y),
         P(origin.x+size,  origin.y),
         P(origin.x+size,  origin.y+size),
         P(origin.x,    origin.y+size),
      ],
      "color": color
   };
   
   world.debug.map.text.push( [ P(origin.x + r, origin.y + r), "[" + tile.loc.x + "," + tile.loc.y + "]"] );

   world.map.tiles.push( tile );

   return tile;
}


function process_tile_click( p ) {
   
   world.debug.map.lines = [];
   world.debug.map.highlight_tiles = [];
   world.map.highlight_disks = [];

   var closest_distance = 1000000;
   var closest_tile = null;
   world.map.tiles.forEach( t => {

      const d = distance_p2p( p, t.center );
      if( d <  closest_distance ) {
         closest_tile = t;
         closest_distance = d;
      }

      world.debug.map.lines.push( [p, t.center, "yellow" ] );
   });

   // select the tile if we are within a circle with radius t from the center of the square
   // this means sometimes you select when you are just outside (but only if there are no adjacent tiles)
   if( closest_distance <= r ) {
      world.debug.map.highlight_tiles.push( closest_tile ); 

      if( world.selected_disk != null ) {
         move_disk_to_tile(world.selected_disk, closest_tile);
         world.selected_disk = null;
      }

      return;
   }

   // same for disks
   closest_distance = 1000000;
   closest_disk = null;
   world.map.disks.forEach( i => {

      const d = distance_p2p( p, i.center );
      if( d <  closest_distance ) {
         closest_disk = i;
         closest_distance = d;
      }

      world.debug.map.lines.push( [p, i.center, "pink" ] );
   });
   if( closest_distance <= r ) {
      select_disk( closest_disk );
      return;
   }


}


function map_draw() {

   render_shadow( false );
   world.map.tiles.forEach( t => draw_tile( t ) );
   
   render_shadow( true );

   if( world.selected_disk != null ) {
      ctx.save();
      ctx.lineWidth = "2";
      ctx.setLineDash([5, 1]);
      fill_circle( world.selected_disk.center, r * 0.95, Color.transparant, Color.border );
      ctx.restore();
   }

   world.map.disks.forEach( d => draw_disk( d ) );

   world.map.possible_tiles.forEach( d => highlight_tile( d ) );

   render_shadow( false );
   
}

function highlight_tile( tile ) {

   fill_path( tile.vertices, Color.highlight_possible_tile );

}

function map_debug_draw() {

   map_debug_draw_lines();

   map_debug_draw_highlight_tiles();

   map_debug_draw_text();

}


function draw_tile( tile ) {

   fill_path( tile.vertices, tile.color );
   ctx.fillStyle = Color.number;
   ctx.font = ((10*t)/12) + 'px serif';
   ctx.fillText( world.tile_values[ tile.loc.x + "_" + tile.loc.y ], tile.center.x - 5, tile.center.y + 5 );

}


function draw_disk( disk ) {

   fill_circle( disk.center, r * 0.9, disk.color, Color.border );
   ctx.fillStyle = "black";
   ctx.font = ((10*t)/12) + 'px serif';
   ctx.fillText( disk.number, disk.center.x - 5, disk.center.y + 5 );

}









