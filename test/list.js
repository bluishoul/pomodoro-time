// ### RatchetTemplate
// This is just a template that shows different UI elements that you can use from the Ratchet project

var RatchetTemplate = [
  '<header class="bar-title">',
  ' <div class="header-animated">',
  '   <a href="#" class="button">三</a>',
  '   <h1 class="title">Task List</h1>',
  '   <a href="#" class="button">+</a>',
  '</header>',
  '<div class="content ratchet-content">',
  ' <p>Jr. was inspired by Ratchet and pulls in their gorgeous styles.</p>',
  ' <p>Here are some examples:</p>',
  '  <ul class="list inset">',
  '   <li>',
  '     <a href="#">',
  '       List item 1',
  '       <span class="chevron"></span>',
  '       <span class="count">4</span>',
  '     </a>',
  '   </li>',
  '  </ul>',
  '  <div class="button-block button-main">Block button</div>',
  '  <a class="button">Mini</a> <a class="button-main">buttons</a> <a class="button-positive">are</a> <a class="button-negative">awesome!</a>',
  '  <div class="toggle active example-toggle"><div class="toggle-handle"></div></div>',
  '  <div class="example-cnts"><span class="count">1</span><span class="count-main">2</span><span class="count-positive">3</span><span class="count-negative">4</span></div>',
  '  <input type="search" placeholder="Search">',
  ' <p>For more examples checkout the <a href="http://maker.github.com/ratchet/">ratchet project.</a></p>',
  '</div>'
].join('\n');

// ### RatchetView

var RatchetView = Jr.View.extend({
  render: function(){
    this.$el.html(RatchetTemplate);
    return this;
  },

  events: {
    'click .button-prev': 'onClickButtonPrev',
    'click .button-next': 'onClickButtonNext',
    'click .example-toggle': 'onClickExampleToggle'
  },

  onClickButtonPrev: function() {
    // Trigger the animation for the back button on the toolbar

    Jr.Navigator.navigate('home',{
      trigger: true,
      animation: {
        // This time slide to the right because we are going back
        type: Jr.Navigator.animations.SLIDE_STACK,
        direction: Jr.Navigator.directions.RIGHT
      }
    });
  },

  onClickButtonNext: function() {
    Jr.Navigator.navigate('pushstate',{
      trigger: true,
      animation: {
        type: Jr.Navigator.animations.SLIDE_STACK,
        direction: Jr.Navigator.directions.LEFT
      }
    });
  },

  onClickExampleToggle: function() {
    // Simple example of how the on/off toggle switch works.
    this.$('.example-toggle').toggleClass('active');
  }
});

var AppRouter = Jr.Router.extend({
  routes: {
    'home': 'ratchet'
  },

  ratchet: function() {
    var ratchetView = new RatchetView();
    this.renderView(ratchetView);
  }

});


var appRouter = new AppRouter();
Backbone.history.start();
Jr.Navigator.navigate('home',{
  trigger: true
});

