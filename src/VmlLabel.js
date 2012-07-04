pv.VmlScene.label = function(scenes) {
  var e = scenes.$g.firstChild,
      round = Math.round;
  for (var i = 0; i < scenes.length; i++) {
    var s = scenes[i];

    // visible
    if (!s.visible) continue;
    var fill = s.textStyle;
    if (!fill.opacity || !s.text) continue;

    var attr = {};
    if ( s.cursor ) { attr.cursor = s.cursor; }

    // measure text
    var txt = s.text.replace( /\s+/g, '\xA0' )
      , label = vml.text_dims( txt, s.font )
      , dx1 = 0
      , dx2 = 100
      , dy = 0
      , vTextAlign = 'left'
      ;
      ;

    // rotated text
    if ( s.textAngle ) {

      if ( s.textBaseline === 'top' ) {
        dy += s.textMargin + ( label.fontsize * 0.4 );
      }
      else if ( s.textBaseline === 'bottom' ) {
        dy -= s.textMargin + ( label.fontsize * 0.33 );
      }

      if ( s.textAlign === 'center' ) {
        dx1 = -label.width / 2;
        dx2 = label.width;
      }
      else if ( s.textAlign === 'right' ) {
        dx1 = -s.textMargin;
        dx2 = -( s.textMargin + label.width );
        vTextAlign = 'right';
      }
      else if ( s.textAlign === 'left' ) {
        dx1 = s.textMargin;
        dx2 = s.textMargin + label.width;
      }

      // create element
      var rot = ( s.textAngle ) ? " rotate(" + 180 * s.textAngle / Math.PI + ")" : "";
      e = this.expect(e, "path", {
        "pointer-events": s.events,
        "cursor": s.cursor,
        "transform": "translate(" + s.left + "," + s.top + ")" + rot,
        "d": "M" + dx1 + "," + dy + " L" + dx2 + "," + dy + " Z",
        "fill": fill.color,
        "fill-rule": "evenodd",
        "fill-opacity": fill.opacity || null,
      });

      // bind text to path
      var p = e.getElementsByTagName( 'path' )[0];
      if ( p ) {
        p.textpathok = true;
        var tp = e.getElementsByTagName( 'textpath' )[0];
        if ( !tp ) {
          tp = document.createElement( vml.pre + 'textpath' + vml.post );
          e.appendChild( tp );
          tp.on = true;
          tp.style["v-text-kern"] = true;
        }
        tp.string = txt;
        tp.style.font = s.font;
        tp.style["v-text-align"] = vTextAlign;
      }

    }
    // non-rotated text
    else {

      if ( s.textBaseline === 'middle' ) {
        dy -= label.fontsize / 2;
      }
      else if ( s.textBaseline === 'top' ) {
        dy += s.textMargin;
      }
      else if ( s.textBaseline === 'bottom' ) {
        dy -= s.textMargin + label.fontsize;
      }

      if ( s.textAlign === 'center' ) {
        dx1 -= label.width / 2;
      }
      else if ( s.textAlign === 'right' ) {
        dx1 -= label.width + s.textMargin;
      }
      else if ( s.textAlign === 'left' ) {
        dx1 += s.textMargin;
      }

      e = this.expect(e, "text", attr, {
        "font": s.font,
        // "text-shadow": s.textShadow,
        "textDecoration": s.textDecoration,
        'top': Math.round( s.top + dy ) + 'px',
        'left': Math.round( s.left + dx1 ) + 'px',
        'position': 'absolute',
        'display': 'block',
        'lineHeight': 1,
        'whiteSpace': 'nowrap',
        'zoom': 1,
        'cursor': 'default',
        'color': vml.color( fill.color ) || 'black'
      });
      e.innerText = txt;

    }

    e = this.append(e, scenes, i);
  }
  return e;
};
