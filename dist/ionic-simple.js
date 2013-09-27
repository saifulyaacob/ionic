
(function(window, document, ionic) {

  ionic.simple = {

    

  };

  function initalize() {
    // remove the ready listeners
    document.removeEventListener( "DOMContentLoaded", initalize, false );
    window.removeEventListener( "load", initalize, false );

    // trigger that the DOM is ready
    ionic.trigger("domready");
  }

  // When the DOM is ready, initalize the webapp
  if ( document.readyState === "complete" ) {
    // DOM is already ready
    setTimeout( initalize );
  } else {
    // DOM isn't ready yet, add event listeners
    document.addEventListener( "DOMContentLoaded", initalize, false );
    window.addEventListener( "load", initalize, false );
  }

})(this, document, ionic);;
(function(window, document, ionic) {

  function initalize() {
    
    ionic.on("swipe", swipe, document.body)
    
  }

  function swipe(e) {
    alert(e.target.tagName)
  }

  ionic.on("domready", initalize);

})(window, document, ionic);