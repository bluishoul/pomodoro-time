var tasks_list 	= [],
	dialy_tasks = [],
	emergency	= [],
	statistics 	= [],
	breaks 		= [];

var task_item = function(params){
	this.name="",
	this.count=1,//count of pomodoro time
	this.finished=0,//finished count of pomodoro time
	this.start=0,//start time of first pomodoro time
	this.end=0,//end time calculate via 'finished' , 'interval' and 'start' 
	this.present=new Date().getTime(),
	this.interval=25*60//25 minutes per pomodoro time
	if(isNotEmpty(params))
		$.extend(this,params);
};

menu = (function() {

	var instance;

	function menu() {
		instance = this;
		return this;
	}

	var PT = menu.prototype;

	PT.Events = {
		"click->.header_add_menu": "toggle_add_menu",
		"click->.play_task,.pause_task":"toggle_task_process",
	};

	PT.init = function() {
		g_utils.binder.call(this);
		return this;
	}

	PT.toggle_add_menu = function() {
		toggle_menu(".add_menu");
	}

	PT.toggle_add_task = function(open){
		toggle_menu(".add_task_form",open);
	};

	var toggle_menu = function(target,open){
		var wrapper = $(".menu_wrapper");
		var add = $(target);
		if(open){
			wrapper.show();
			$(".menu_item").hide();
			add.slideDown();
		}else if(typeof open =="undefined"){
			add.siblings().hide();
			if (add.is(":hidden")) {
					wrapper.show();
				add.stop().slideDown();
			} else {
				add.stop().slideUp(function(){
					wrapper.hide();
				});
			}
		}else{
			wrapper.hide();
			$(".menu_item").hide();
		}
	};

	PT.toggle_task_process = function(){
		var cur = $(this);
		if(cur.is(".play_task")){
			cur.attr("class","pause_task");
		}else{
			cur.attr("class","play_task");
		}
	};

	return new menu().init();

})();

storage = (function() {
	var instance;

	function storage() {
		instance = this;
		return this;
	}

	var PT = storage.prototype;

	PT.init = function() {
		g_utils.binder.call(this);
		return this;
	};

	PT.set = function(key, value) {
		return $.jStorage.set(key, value);
	};

	PT.get = function(key) {
		return $.jStorage.get(key);
	}

	return new storage().init();
})();

app = (function() {
	
	var instance;
	
	function app() {
		instance = this;
		return this;
	};
	
	var PT = app.prototype;
	
	PT.init = function() {
		Console.open();
		init_open_time();
		init_today_task_list();
		return this;
	};
	
	PT.add_task=function(){
		menu.toggle_add_task(true);
	};

	PT.do_add_task =function(){
		var form = $(".add_task_form");
		var name = form.find("input[name='name']");
		var count = form.find("select[name='count']").val();
		var interval = form.find("select[name='interval']").val();
		if(isEmpty($.trim(name.val()))){
			alert("Task name can't be blank!");
			return false;
		}
		var item = new task_item({
			name:name.val(),
			count:count,
			interval:interval
		});
		tasks_list = $.grep(tasks_list,function(value,key){
			return value.name!=name.val();
		});
		tasks_list.push(item);
		storage.set("tasks_list",tasks_list);
	};
	
	var init_open_time = function(){
		var last = storage.get("last_open_time");
		if(isNotEmpty(last)){
			Console.log("Last Open Time:\t"+new Date(last).toLocaleString())
		}else{
			Console.log("Welcome to Pomodoro Time for Web!");
		}
		var now = new Date();
		storage.set("last_open_time",now.getTime())
	};

	var init_today_task_list = function(){
		var list = storage.get("tasks_list");
		if(isNotEmpty(list)){
			var ol = $(".main_content ol").html("");
			tasks_list = list;
			$.each(tasks_list,function(idx,value){
				var index = idx+1;
				if(idx%2==0){
					ol.append('<li class="pl10 bg_grey">'+index+'.'+value.name+'<div class="play_task"></div></li>');
				}else{
					ol.append('<li class="pl10">'+index+'.'+value.name+'<div class="play_task"></div></li>');
				}
			});
		}else{
			$(".main_content ol").html('<li class="no_item">Empty Todo List Of Today</li>');
		}
	};
	
	return app;
})();

$(function(){
	app = new app().init();
});
