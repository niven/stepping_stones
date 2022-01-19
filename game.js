var DEBUG = true;
var SHOW_FPS = true;
var SHOW_OBJECT_COUNT = true;

let CANVAS_WIDTH = 1200;
let CANVAS_HEIGHT = 600;

var ctx, canvas;

var running = true;
var frame_render_time_ms = new Array(1);

var world = {
   "width": CANVAS_WIDTH,
   "height": CANVAS_HEIGHT,
   "debug": {},
};

// control values for playing around, read from the DOM, but set a global to
// avoid reading world.controls.smoke_density.value every frame a billion times
var control_values_need_update = true;
var controls = {

	"debug_toggle": { "dom_id": "debug_toggle", "var": "DEBUG" },
	"fps_toggle": { "dom_id": "fps_toggle", "var": "SHOW_FPS" },
	"object_count_toggle": { "dom_id": "object_count_toggle", "var": "SHOW_OBJECT_COUNT" },

}


function create_initial_objects() {
   
   map_init();
   
}


function main() {

	canvas = document.createElement("canvas");

   // setup_input( c );

	canvas.setAttribute("width", CANVAS_WIDTH);
	canvas.setAttribute("height", CANVAS_HEIGHT);
	canvas.setAttribute("id", "scene");
	document.body.appendChild(canvas);

   ui_init();
   create_initial_objects();
   calculate_tile_values(); // sets all to 0
   ui_register_handlers();
   
	let trigger_reread_control_values =function() { control_values_need_update = true };
	Object.keys(controls).forEach( name => document.getElementById( controls[name].dom_id ).onchange = trigger_reread_control_values );

	ctx = document.getElementById("scene").getContext("2d", { alpha: false });
	ctx.font = "10px Menlo";



	world.time_at_frame_end = Date.now();
	world.last_time_ms = 0;

	window.requestAnimationFrame( draw );
}

function read_control_values() {

	for( var key in controls ) {
		let el = document.getElementById( controls[key].dom_id );
		var new_value = null;
		switch( el.type ) {
			case "checkbox": {
				new_value = el.checked;
				break;
			}
			default:
				new_value = Number.parseFloat( el.value );
		}
		
		// console.log( key + " from " + window[controls[key].var] + " to " + new_value );
		window[ controls[key].var ] = new_value;
	}

	control_values_need_update = false;
}

function draw_debug() {
   
	map_debug_draw();

}

function draw( time_since_start_rendering_ms ) {

	let time_delta_ms = time_since_start_rendering_ms - world.last_time_ms;
	world.last_time_ms = time_since_start_rendering_ms;
	
	let time_start = Date.now();

	let time_delta_seconds = time_delta_ms / 1000;

	if( !running ) {
		window.requestAnimationFrame( draw );
		return;
	}

	if( control_values_need_update ) {
		read_control_values();		
	}

	ctx.clearRect(0 ,0, CANVAS_WIDTH, CANVAS_HEIGHT);

	// set background
	ctx.fillStyle = 'palegreen';
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	map_draw();
   ui_draw();
 
	if( DEBUG ) {
		draw_debug();
	}
   
	let time_end = Date.now();
	frame_render_time_ms.push( time_end - time_start );
	frame_render_time_ms.shift();
	
   if( SHOW_FPS ) {
      const avg_time_ms = frame_render_time_ms.reduce( (sum, c) => sum + c , 0 ) / frame_render_time_ms.length;
      const fps = Math.floor(1000 / avg_time_ms);
      ui_text( P(CANVAS_WIDTH - 100,20), "FPS: " + fps);
   }
   if( SHOW_OBJECT_COUNT ) {
      ui_text( P(CANVAS_WIDTH - 100, 40), "Tiles: " + world.map.tiles.length );
   }
   
	window.requestAnimationFrame( draw );
}

function select_disk( disk ) {
	world.selected_disk = disk;





	// We want to highlight all possible tiles for this disk
	// map disks to locations
	let disk_locations = world.map.disks.map( d => d.loc.x + "_" + d.loc.y );
	console.log( disk_locations);
	// get empty tiles
	let tiles_empty = world.map.tiles.filter( t => !disk_locations.includes( t.loc.x + "_" + t.loc.y ) );

	world.map.possible_tiles = tiles_empty;
	console.log( world.map.possible_tiles );

	// Brown disks can go in any free tile
	if( world.selected_disk.number == 1 ) {
		return;
	}

	// get the ones with a value equal to the lowest next number
	let suitable = world.map.possible_tiles.filter( t => world.tile_values[ t.loc.x + "_" + t.loc.y ] == world.selected_disk.number  );
	console.log( suitable );
	world.map.possible_tiles = suitable;
}


function move_disk_to_tile( disk, tile ) {

   disk.loc = tile.loc;
   disk.center = tile.center;

   // make a new brown disk
   if( disk.number == 1 ) {
      Disk( wxh+1, 0, 1 );
   } else {
   	// make the next white disk
   	Disk( wxh+2, 0, disk.number + 1 );
   }

	calculate_tile_values();
	world.map.possible_tiles = [];
}

function calculate_tile_values() {

   tile_values = {};
   world.map.tiles.forEach( t => tile_values[ t.loc.x + "_" + t.loc.y ] = 0 );
   for( var i = 0; i < world.map.disks.length; i++ ) {
      var d = world.map.disks[i];
      tile_values[ (d.loc.x + -1) + "_" + (d.loc.y + -1) ] += d.number;
      tile_values[ (d.loc.x +  0) + "_" + (d.loc.y + -1) ] += d.number;
      tile_values[ (d.loc.x +  1) + "_" + (d.loc.y + -1) ] += d.number;
      tile_values[ (d.loc.x + -1) + "_" + (d.loc.y +  0) ] += d.number;
      tile_values[ (d.loc.x +  1) + "_" + (d.loc.y +  0) ] += d.number;
      tile_values[ (d.loc.x + -1) + "_" + (d.loc.y +  1) ] += d.number;
      tile_values[ (d.loc.x +  0) + "_" + (d.loc.y +  1) ] += d.number;
      tile_values[ (d.loc.x +  1) + "_" + (d.loc.y +  1) ] += d.number;
   }
   world.tile_values = tile_values;

}


