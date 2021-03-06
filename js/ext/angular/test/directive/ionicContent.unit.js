describe('Ionic Content directive', function() {
  var compile, element, scope;

  beforeEach(module('ionic.ui.content'));

  beforeEach(inject(function($compile, $rootScope, $timeout, $window) {
    compile = $compile;
    scope = $rootScope;
    timeout = $timeout;
    window = $window;
    ionic.Platform.setPlatform('Android');
  }));

  it('Has content class', function() {
    element = compile('<content></content>')(scope);
    expect(element.hasClass('scroll-content')).toBe(true);
  });

  it('Has header', function() {
    element = compile('<content has-header="true"></content>')(scope);
    expect(element.hasClass('has-header')).toEqual(true);
  });

  it('should add padding classname', function() {
    element = compile('<content padding="true"></content>')(scope);
    expect(element.hasClass('scroll-content')).toEqual(true);
    expect(element.hasClass('padding')).toEqual(false);
    var scrollElement = element.find('.scroll');
    expect(scrollElement.hasClass('padding')).toEqual(true);
  });

  it('Enables bouncing by default', function() {
    ionic.Platform.setPlatform('iPhone');
    element = compile('<content has-header="true"></content>')(scope);
    scope.$apply();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    expect(scrollView.options.bouncing).toBe(true);
  });

  it('Disables bouncing when has-bouncing = false', function() {
    ionic.Platform.setPlatform('iPhone');
    element = compile('<content has-header="true" has-bouncing="false"></content>')(scope);
    scope.$apply();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    expect(scrollView.options.bouncing).toBe(false);
  });

  it('Disables bouncing by default on Android', function() {
    ionic.Platform.setPlatform('Android');
    element = compile('<content has-header="true"></content>')(scope);
    scope.$apply();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    expect(scrollView.options.bouncing).toBe(false);
  });

  it('Disables bouncing by default on Android unless has-bouncing = true', function() {
    ionic.Platform.setPlatform('Android');
    element = compile('<content has-header="true" has-bouncing="true"></content>')(scope);
    scope.$apply();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    expect(scrollView.options.bouncing).toBe(true);
  });


  it('Should set start x and y', function() {
    element = compile('<content start-x="100" start-y="300" has-header="true"></content>')(scope);
    scope.$apply();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    var vals = scrollView.getValues();
    expect(vals.left).toBe(100);
    expect(vals.top).toBe(300);
  });

  describe('save scroll', function() {

    function compileWithParent() {
      var parent = angular.element('<div>');
      //Make a phony element that tells the world it's a navView when in reality it's just a div
      parent.data('$navViewController', true);
      parent.append('<content></content>');
      compile(parent)(scope);
      scope.$apply();
    }

    it('should set x and y with historyData.scrollValues passed in through $viewContentLoaded', function() {
      compileWithParent();
      spyOn(scope.scrollView, 'scrollTo');
      var scrollValues = { top: 40, left: -20, zoom: 3 };
      scope.$broadcast('$viewContentLoaded', {
        scrollValues: scrollValues
      });
      timeout.flush();
      expect(scope.scrollView.scrollTo.mostRecentCall.args).toEqual([-20, 40]);
    });

    it('should set null with historyData.scrollValues not valid', function() {
      compileWithParent();
      spyOn(scope.scrollView, 'scrollTo');
      var scrollValues = { left: 'bar', top: 'foo' };
      scope.$broadcast('$viewContentLoaded', { scrollValues: scrollValues });
      timeout.flush();
      expect(scope.scrollView.scrollTo.mostRecentCall.args).toEqual([null, null]);
    });

    it('should save scroll on the historyData passed in on $destroy', function() {
      compileWithParent();
      var historyData = {};
      scope.$broadcast('$viewContentLoaded', historyData);
      timeout.flush();
      scope.scrollView.scrollTo(null, 9, false);
      expect(historyData.scrollValues).toBeUndefined(); //sanity test
      scope.$destroy();
      expect(historyData.scrollValues).toEqual({
        left: 0,
        top: 9,
        zoom: 1
      });
    });
  });
});
