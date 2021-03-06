// TODO: TEST NESTED FUNCTION CALLS E.g. filter(function(){ .. some invalid call .. })
(function($){
function is_at_least_version(version) {
  var expected_version = version.split('.').map(function(x) { return parseInt(x); });
  var current_version = $.fn.jquery.split('.').map(function(x) { return parseInt(x); });
  var common_element_count = [expected_version.length, current_version.length].sort()[0];

  var is_at_least_x = true;
  for(var i = 0; i < common_element_count; i += 1) {
    if(expected_version[i] < current_version[i]) {
      is_at_least_x = false;
    }
  }

  return is_at_least_x;
}

test('init', function() {
    expect(0);
    jQuery.LINT.console = {
        group:function(a,b,c){
            //window.console.group.apply(null, arguments);
        },
        groupCollapsed:function(a,b,c){
            //window.console.groupCollapsed.apply(null, arguments);
        },
        groupEnd:function(a,b,c){
            //window.console.groupEnd.apply(null, arguments);
        },
        log:function(a,b,c){
            //window.console.log.apply(null, arguments);
        },
        warn: function(a, e) {
            if ((e instanceof Error) || /syntax error/i.test(e)) { return; }
            //window.console.warn.apply(null, arguments);
            ok(true, a);
        }
    };
});

jQuery.ajaxSetup({
    xhr: function(){
        return {
            open: function(){},
            send: function(){
                this.onreadystatechange();
            },
            responseText: '',
            status: 200,
            readyState: 4,
            getResponseHeader: function(){},
            abort: function(){}
        };
    }
});

test('jQuery()', function(){

    expect(4);
    $.LINT.level = 1;

    if (is_at_least_version('1.4')) jQuery();
    $(document).ready(function() {});
    $(function() {});

    $('#k928372');
    $('.k928372');

    $(1234);
    $(/a/);

    $.LINT.level = 3;
    $('.nonExistent');


});

test('text()/html()', function(){
    expect(4);

    // working
    $('<a/>').text('test');
    $('<a/>').text(5).html(5);
    $('<a/>').html('<a/>');
    $('<a/>').text();
    $('<a/>').html();

    // fail
    $('<a/>').text({});
    $('<a/>').html({});
    $('<a/>').html($('<div/>'));
    $('<a/>').text($('<div/>'));
});

test('css()', function(){

    expect(2);

    $('<a/>').css('color','red').css('padding', 20);
    $('<a/>').css('a','b','c','d');

    $('<a/>').css('color');
    $('<a/>').css('padding-top');
    $('<a/>').css({});
    $('<a/>').css('background', '#FFF');

});

test('attr()', function(){

    expect(4);

    $('<a/>').attr('rel','a').attr('href', '...');
    $('<a/>').attr('a','b','c','d');
    $('<a/>').attr('id');
    $('<a/>').attr('value');

    $('<a/>').attr('a');
    $('<a/>').attr('b');
    $('<a/>').attr({});
    $('<a/>').attr('b', 'd');

});

test('data()', function(){
    var struct = $('<div><a/><a/></div>');

    if (is_at_least_version('1.4')) {
          expect(3);

          // working
          jQuery.data(document.body, 'data', 'data');
          jQuery.data(document.body, 'events', undefined, true);
          $('<a/>').data('data', 'data');
          $('<a/>').data('data');

          // failing
          jQuery.data(struct, 'data', 'data');
          jQuery.data([]);
          jQuery.data({});
    } else {
        expect(0);
    }
});

test('bind()', function(){
    expect(3);

    // Throws error in 1.3:
    $('<a/>').bind({});

    // Throws error in 1.4:
    $('<a/>').bind('a',function(){}).bind('b', function(){});

    // These throw errors in both 1.4 and 1.3
    $('<a/>').bind('a','b','c','d');
    $('<a/>').bind('b');

    // These should be fine
    $('<a/>').bind('a',function(){}).bind('b', {/*data*/}, function(){});
    $('<a/>').bind('click', {a:1}, function(){});
});

test('live()/delegate()', function(){
    if (is_at_least_version('1.4')) {
        if(is_at_least_version('1.9')) {
            // Deprecated functionality!
            expect(0);
        } else {
            expect(2);

            //  failing
            $('<a/>').live('a','b','c','d');
            $('<a/>').live('b');
            $('<a/>').live({});

            // working
            $('<a/>').live('a',function(){});
            $('<a/>').live('b', {/*data*/}, function(){});
            $('<a/>').live('click', {a:1}, function(){});
        }
    } else {
        expect(0);
    }
});

test('trigger and events', function(){
    expect(5);

    // working
    $('<a/>').trigger('click', {});
    $('<a/>').trigger('click');
    $('<a/>').trigger(new jQuery.Event);
    $('<a/>').triggerHandler('click', {});
    $('<a/>').triggerHandler('click');

    // failing
    $('<a/>').trigger(function() {});
    $('<a/>').trigger([]);
    $('<a/>').trigger();
    $('<a/>').triggerHandler();
    $('<a/>').triggerHandler(new jQuery.Event);
});



test('short event-handlers', function(){
    expect(1);

    $('<a/>').click(function() {});
    $('#id').click(function() {});
    $('#qunit-header').click(function() {});
});

test('repeat selectors', function(){

    jQuery.LINT.enabledReports.noElementsFound = false;
    jQuery.LINT.enabledReports.slowSelector = false;

    expect(1);

    var struct = $('<div><a/><a/></div>');

    $('a', struct);
    $('a', struct);

    jQuery.LINT.enabledReports.noElementsFound = true;
    jQuery.LINT.enabledReports.slowSelector = true;

});

test('pseudo', function(){

    expect(3);

    jQuery.LINT.enabledReports.noElementsFound = false;
    jQuery.LINT.enabledReports.slowSelector = false;

    // valid
    $('div:not(.foo:last):first');
    $(':first');
    $('div:contains(a) :input');

    // invalid
    $('div:foobar');
    $(':ttt:yyy');
    $('div:not(.foo:abcdefg):first');

    jQuery.LINT.enabledReports.noElementsFound = true;
    jQuery.LINT.enabledReports.slowSelector = true;

});

test('jQuery.get()/post()', function(){

    expect(10);

    var xhrs = [

        // Incorrect
        $.get('a', 'b', 'c', 'd'),
        $.get(123456),
        $.get(function(){}),
        $.get('a', {}, function(){}, /a/),
        $.get(),
        $.post('a', 'b', 'c', 'd'),
        $.post(123456),
        $.post(function(){}),
        $.post('a', {}, function(){}, /a/),
        $.post(),

        // Correct
        $.get('a'),
        $.get('a', {}),
        $.get('a', ''),
        $.get('a', {}, function(){}),
        $.get('a', function(){}),
        $.get('a', {}, function(){}, ''),
        $.get('a', '', function(){}, ''),
        $.post('a'),
        $.post('a', {}),
        $.post('a', ''),
        $.post('a', {}, function(){}),
        $.post('a', function(){}),
        $.post('a', {}, function(){}, ''),
        $.post('a', '', function(){}, '')

    ];

});

test('each()', function(){

    expect(20);

    // Correct
    $.each([], function(){});
    $.each({}, function(){});
    $([1,2,3]).each(function(){});
    $('<a/>').each(function(){});
    $([document.createElement('div')]).each(function(){});
    $({}).each(function(){});
    $($([])).each(function(){});

    // Incorrect
    $.each(123);
    $.each(1,2,3);
    $.each('a','b','c');
    $.each({}, {});
    $.each([], []);
    $.each([]);
    $.each({});
    $.each({}, function(){}, 123);
    $.each(1,2,3,4,5,6);
    $.each(function(){});
    $([]).each(function(){}, [], 1,2,3,4,5);
    $([]).each({});
    $([]).each(1,2,3);
    $([]).each();
    $({}).each(123);
    $({}).each(undefined, undefined);
    $({}).each({}, []);
    $({}).each([], {});
    $({}).each([], function(){});
    $({}).each(function(){}, function(){});

});

test('add()', function(){

    expect(jQuery.fn.jquery < '1.4' ? 3 : 2);

    var struct = $('<div><a/><a/></div>');

    $('<a/>').add($('<a/>'));
    $('<a/>').add('a', struct[0]); // should fail in <1.4
    $('<a/>').add();
    $('<a/>').add(undefined);

});

test('jQuery.ajax()', function(){

    if ($.fn.jquery < '1.5') {
        expect(4);
        $.ajax();
    }
    else {
        expect(1);
        $.ajax('http://www.google.de');
    }

    $.ajax('a');
    $.ajax('');
    $.ajax([]);
    $.ajax({});

});

test('DOM traversing methods', function(){

    jQuery.LINT.enabledReports.noElementsFound = false;

    expect(jQuery.fn.jquery >= '1.4' ? 27 : 24);

    var struct = jQuery('<div><a/><span/><a/><ul><li/></ul></div>')[0],
        $ = function(s) {
            return jQuery(s, struct);
        },
        ul = $('ul'),
        a = $('a'),
        li = $('li'),
        all = $('*');

    // Correct
    a.next('div,span');
    a.next();
    a.parents('div');
    a.parents();
    a.parent();
    a.closest('div');
    ul.find('li');
    ul.prevAll('a');
    ul.prev();
    ul.prev('a');
    ul.prevAll();
    ul.children();
    ul.children('li');
    ul.find('li').andSelf();
    ul.find('li').end();
    ul.filter(function(){return true;});
    ul.filter('ul');
    if (jQuery.fn.jquery >= '1.4') {
        li.closest('ul', struct);
        a.parentsUntil('x');
        a.nextUntil('y');
        a.prevUntil('z');
    }
    ul.siblings();
    ul.siblings('a');
    all.slice(1,-1);

    // Incorrect
    a.next(/a/, {});
    a.next(1,2,3);
    a.parents(false);
    a.parents(function(){});
    a.parent('p',1,2,34);
    a.closest();
    li.closest('x', struct, {});
    ul.find('___', '+');
    ul.prevAll({});
    ul.prev(function(){}, {});
    ul.prev([]);
    ul.prevAll([], {}, [], 1);
    ul.children(1);
    ul.children(all);
    ul.find('j').andSelf({});
    ul.find();
    ul.find('m').end(1);
    ul.filter({});
    ul.filter();
    ul.filter(1);
    if (jQuery.fn.jquery >= '1.4') {
        a.parentsUntil(1,2, {});
        a.nextUntil(1,2, {});
        a.prevUntil(1,2, {});
    }
    ul.siblings(1);
    ul.siblings(function(){});
    all.slice(1,2,3);
    all.slice({});
    all.slice();

    jQuery.LINT.enabledReports.noElementsFound = true;

});

test('New plugin', function(){

    expect(4);

    jQuery.fn.foo = function(n){ return n + 2; };
    var x = jQuery.fn.foo.x = {};

    jQuery.LINT.registerMethod('foo', [
        {
            arg: [
                { name: 'firstArg', type: 'number' }
            ]
        }
    ]);

    ok(jQuery.fn.foo(1) === 3, 'Calling plugin');
    ok(jQuery.fn.foo.x === x, 'Properties copied over');

    // correct
    jQuery.fn.foo(144);

    // incorrect
    jQuery.fn.foo({});
    jQuery.fn.foo(1,2,3,4);

});

test('append/prepend', function(){

    expect(10);

    var d = jQuery('<div/>');

    // Correct
    d.append('a');
    d.append(d.clone()[0]);
    d.append(d.clone());
    d.append('a', d.clone(), d.clone()[0], 'b');
    d.append('a','b','c');
    d.prepend('a');
    d.prepend(d.clone()[0]);
    d.prepend(d.clone());
    d.prepend('a', d.clone(), d.clone()[0], 'b');
    d.prepend('a','b','c');

    // Incorrect
    d.append(88);
    d.append([]);
    d.append({});
    d.append(d.clone(), undefined, 45);
    d.append();
    d.prepend('a','c',[]);
    d.prepend(88);
    d.prepend({});
    d.prepend(d.clone(), undefined, 45);
    d.prepend();
});

test('noElementsFound checks', function(){

    var meth = 'parents parent find children prev prevAll next nextAll closest'.split(' '),
        dom = $('<div/>');

    expect(meth.length);

    $.each(meth, function(){
        dom[this]('foo');
    });

});

test('extend()', function(){

    expect(2);

    // Invalid:
    $.extend(1, {}, {});
    $.extend(true);

    // Valid:
    $.extend({});
    $.extend({}, {});
    $.extend({}, {}, {});
    $.extend(function(){}, {}, {});
    $.extend(true, function(){}, {}, {});
    $.extend(true, {}, new function(){this.x = 1;});
    $.extend(function(){}, function(){});
    $.extend(true, function(){}, function(){});

});

test('Callbacks to jQuery methods', function(){

    expect(jQuery.fn.jquery <= '1.4' ? 3 : 2);

    var j = $('<div/>');

    j.filter(function(){
        j.find('a'); // should get noElementsFound error
    });

    j.each(function(){
        j.find('a'); // should get noElementsFound error
    });

    if (jQuery.fn.jquery <= '1.4') {
        stop();
        $.get('foo.xml', function(){
            start();
            j.find('a'); // should get noElementsFound error
        });
    }

});

test('Test inefficient selectors', function(){
    jQuery.LINT.enabledReports.noElementsFound = false;
    jQuery.LINT.enabledReports.slowSelector = true;
    $.LINT.level = 2;

    expect(6);

    $('#id, #k928372');
    $('#k928372');
    $('div.k928372');
    var j = $('#qunit-testrunner-toolbar');
    $('.k928372', j);

    $('#k928372 > .k928372');
    $('.k928372', {});
    $('.k928372');
    $('div#k928372');
    $('div #k928372');
    $('#id #k928372');

    jQuery.LINT.enabledReports.noElementsFound = true;
});

})(jQuery);
