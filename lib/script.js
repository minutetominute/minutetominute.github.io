(function () {

  if (typeof Triangles === "undefined") {
    window.Triangles = {};
  }

  if (typeof Content === "undefined") {
    window.Content = {};
  }

  if (typeof Projects === "undefined") {
    window.Projects = {};
  }

  Content.views = {
                    "about-me": -1,
                    "projects": 0,
                    "contact": 1
                  }

  Content.currentView = "projects"

  Projects.transitioning = false;

  Triangles.create = function () {
    var defaults = {
      cell_size: 100,
      variance: 0.8,
      x_colors: 'PuBu',
      y_colors: 'match_x',
      palette: Trianglify.colorbrewer,
      color_space: 'lab',
      color_function: false,
      stroke_width: 1.51,
      width: window.innerWidth,
      height: window.innerHeight,
      seed: "20"
    };
    var pattern = Trianglify(defaults);

    $(".hero-image").html(pattern.canvas());
  }

  Content.listen = function () {
    $("a#about-me").click(Content.changeView.bind(this, "about-me"));
    $("a#projects").click(Content.changeView.bind(this, "projects"));
    $("a#contact").click(Content.changeView.bind(this, "contact"));
  }

  Content.changeView = function (newView) {
    $("li.tab a").removeClass("selected");
    $("a#" + newView).addClass("selected");
    var oldView = Content.currentView;
    var delta = Content.views[newView] - Content.views[oldView];
    var direction = null;
    if (delta === 0) {
      return;
    }
    else if (delta === -1) {
      direction = "up";
    }
    else if (delta === 1) {
      direction = "down";
    }
    Content.views[newView] = 0;
    Content.views[oldView] = Content.views[oldView] - delta;
    $(".tab-content").removeClass("in-view");
    $(".tab-content#" + oldView).addClass(direction + "-view");
    $(".tab-content#" + newView).removeClass("down-view up-view");
    $(".tab-content#" + newView).addClass("in-view");
    Content.currentView = newView;
  }

  Projects.rightView = function (event) {
    Projects.changeView(event, "right");
  }

  Projects.leftView = function (event) {
    Projects.changeView(event, "left");
  }

  Projects.changeView = function (event, direction) {
    event.preventDefault();

    if (Projects.transitioning) {
      return;
    }
    Projects.transitioning = true;
    var oldProject = $(".project-view-container > li.visible");

    if (direction === "left") {
      var newProject = oldProject.next();
    } else {
      var newProject = oldProject.prev();
    }

    if (newProject.length === 0) {
      Projects.transitioning = false;
      return;
    }

    oldProject.removeClass("visible left right");
    oldProject.addClass(direction);
    newProject.removeClass("visible left right");
    newProject.addClass("visible");
    $(".project-view-locations > li").removeClass("filled");
    $($(".project-view-locations > li")[newProject.index()]).addClass("filled");
    newProject.one('transitionend', function() {
      Projects.transitioning = false;
    });
  }

  Projects.listen = function () {
    $("a.left-arrow").click(Projects.leftView.bind(this));
    $("a.right-arrow").click(Projects.rightView.bind(this));
  }

  Projects.makeLocations = function () {
    var count = $(".project-view").length
    var locations = $(".project-view-locations");
    for (var i = 0; i < count; i++) {
      locations.append($("<li class=\"circle\"></li>"))
    }
    locations.children().first().addClass("filled");
  }

})();
