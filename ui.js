const UI_BUTTON_WIDTH = 100;
const UI_BUTTON_HEIGHT = 40;

var ui = {
   "buttons": [],
   "click_listeners": []
}

function ui_init() {
   ui_add_click_handler( process_button_click );
}

function ui_add_click_handler( handler ) {
   ui.click_listeners.push( handler );
}

function ui_register_handlers() {
   canvas.addEventListener("click", canvas_onclick, false);
}

function canvas_onclick(e) {
    var element = canvas;
    var offsetX = 0, offsetY = 0

  if (element.offsetParent) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    x = e.pageX - offsetX;
    y = e.pageY - offsetY;

    const p = P(x,y);
    console.log(ui.click_listeners);
    ui.click_listeners.forEach( l => l(p) );
}

function process_button_click( p ) {
   console.log(p);
   
   const button = ui.buttons.find( b => p.x >= b.loc.x && p.x < (b.loc.x+UI_BUTTON_WIDTH) && p.y >= b.loc.y && p.y < (b.loc.y + UI_BUTTON_HEIGHT));
   if( button != undefined ) {
      console.log(button);
      button.callback();
   }
}

function create_button( top_left, text, callback ) {
   
   const b = {
      "loc": top_left,
      "text": text,
      "callback": callback
   }
   
   ui.buttons.push( b );
}



function ui_draw() {
   
   ui_buttons_draw();
      
}

function ui_text( p, text ) {
   ctx.fillStyle = 'black';
   ctx.fillText( text, p.x, p.y );
}

function ui_buttons_draw() {
      
   // render_shadow( true );
   ctx.fillStyle = 'black';

   ui.buttons.forEach( b => {
      fill_rect( b.loc, UI_BUTTON_WIDTH, UI_BUTTON_HEIGHT, 'silver' );
      ctx.fillStyle = 'black';
      ctx.fillText( b.text, b.loc.x + 10, b.loc.y + 30 );
      
   });
   
}
