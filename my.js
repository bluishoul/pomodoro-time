var tasks_list 	= [],
	dialy_tasks = [],
	emergency	= [],
	statistics 	= [],
	breaks 		= [],
	itv 		= null,
	i 			= 0;
var task_item = function(params){
	this.id=0;
	this.name="";
	this.count=1;//count of pomodoro time
	this.finished=0;//finished count of pomodoro time
	this.start=0;//start time of first pomodoro time
	this.end=0;//end time calculate via 'finished' , 'interval' and 'start' 
	this.interval=25;//25 minutes per pomodoro time
	this.counter = 0;//counter for tarsk player
	this.itv = 0;
	if(isNotEmpty(params))
		$.extend(this,params);
	if(this.start!=0){
		this.end = this.start + this.count*this.interval*60;
	}
};

menu = (function() {

	var instance;

	function menu() {
		instance = this;
		return this;
	}

	var PT = menu.prototype;

	PT.Events = {
		"click->.play_task,.pause_task":"toggle_task_process"
	};

	PT.init = function() {
		g_utils.binder.call(this);
		return this;
	}

	PT.toggle_add_menu = function(open) {
		toggle_menu(".add_menu",open);
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
			$(".menu_item").slideUp(function(){
				wrapper.hide();
			});
		}
	};

	PT.toggle_task_process = function(){
		var cur = $(this);
		var id = cur.parents("li").attr("id");
		var task = app.find_task_by_id(id);
		if(isEmpty(task)){
			alert("Task with id :"+id+" does not exist!");
			return;
		}
		if(cur.is(".play_task")){
			pause_other(task);
			cur.attr("class","pause_task");
			task.itv = setInterval(function(){
				var sum = task.count*task.interval*60;
				var finished = task.finished*task.interval*60;

				if(task.counter+finished==sum){
					clearInterval(task.itv);
				}else if(task.counter!=0 && task.counter%(task.interval*60)==0){
					task.finished = task.finished + 1;
					task.counter = 0;
				}
				var width_all = (finished+(task.counter))*100/sum;
				var width_one = task.counter*100/(task.interval*60);
				task.counter = task.counter+1;
				storage.set("tasks_list",tasks_list);
				$("#prg"+task.id).width(width_all+"%");
				$("header .progress").width(width_one+"%").html(app.get_friendly_time(task.counter*1000));
			},1000);
		}else{
			cur.attr("class","play_task");
			if(task.itv != 0)
				clearInterval(task.itv);
		}
	};

	var pause_other = function(cur){
		$.each(tasks_list,function(k,v){
			if(v.itv != 0 && v.id!=cur.id)
				clearInterval(v.itv);
		});
		$(".pause_task").attr("class","play_task");
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

	PT.remove_all = function(){
		if(confirm("Ensure to Remove All the Records?")){
			this.set("tasks_list",null);
			location.reload();
		}
	};

	return new storage().init();
})();

calendar = (function(){
	var instance;
	function calendar(){
		instance = this;
		return this;
	};
	var PT = calendar.prototype;
	PT.Events = {
		"click->.add_task_form input[name='start']":"show_date_picker"
	};
	PT.show_date_picker = function(){
		$(".add_task_form .calendar").toggle();
	};
	PT.init = function(){
		g_utils.binder.call(this);
		init_calendar();
		return this;
	};
	var init_calendar = function(){
		$(".jsCalendar").bind("startDateChanged",function() {
			var start = new Date($(this).data("startdate"));
			start.setHours(0);
			start.setMinutes(0);
			start.setSeconds(0);
			$(".add_task_form input[name='start']").val(start.getTime());
			$(".add_task_form .calendar").hide();
		})		
	};
	return calendar;
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

	PT.find_task_by_name = function(name){
		var t = null;
		$.each(tasks_list,function(idx,task){
			if(task.name = name)
				t = task;
		});
		return t;
	};

	PT.find_task_by_id = function(id){
		var t = null;
		$.each(tasks_list,function(idx,task){
			if(task.id == id)
				t = task;
		});
		return t;
	};

	PT.do_add_task =function(){
		var form = $(".add_task_form");
		var name = form.find("input[name='name']");
		var start = form.find("input[name='start']");
		var count = form.find("select[name='count']").val();
		var interval = form.find("select[name='interval']").val();
		if(isEmpty($.trim(name.val()))){
			alert("Task name can't be blank!");
			name.focus();
			return false;
		}
		if(isEmpty($.trim(start.val()))){
			alert("Task Start Time Can't be blank!");
			start.focus();
			return false;
		}
		var item = new task_item({
			name:name.val(),
			count:parseInt(count),
			interval:parseInt(interval),
			start:parseInt(start.val()),
			id:new Date().getTime()
		});
		tasks_list = $.grep(tasks_list,function(value,key){
			return value.name!=name.val();
		});
		tasks_list.push(item);
		storage.set("tasks_list",tasks_list);
		location.reload();
	};

	PT.get_friendly_time = function(mili_seconds){
		var temp = mili_seconds/(1000*60*60);
		var time = "";
		/*
		var t = new Date(mili_seconds);
		time = (t.getHours()-8)+" : " + (t.getMinutes()) + " : " + (t.getSeconds()) + " . " + (t.getMilliseconds())
		*/
		if(temp>=1){
			time += parseInt(temp)+" : ";
			mili_seconds = mili_seconds%(1000*60*60);
		}else{
			time += "00 : ";
		}
		temp = mili_seconds/(1000*60)
		if(temp>=1){
			time += parseInt(temp)+" : ";
			mili_seconds = mili_seconds%(1000*60);
		}else{
			time += "00 : ";
		}
		temp = mili_seconds/(1000)
		if(temp>=1){
			time += parseInt(temp);
			mili_seconds = mili_seconds%(1000);
		}else{
			time += "00 . ";
		}
		if(mili_seconds>0 && isNotEmpty(time)){
			time += " . "+mili_seconds;
		}
		return time;
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
				var width = value.finished*100/value.count;
				var li = $('<li class="pl10"></li>');
				li.attr("id",value.id);
				var progress = $('<div class="progress"></div>');
				progress.attr("id","prg"+value.id);
				li.attr("name",value.name);
				progress.html(index+"."+value.name);
				li.append(progress);
				if(idx%2==0){
					li.addClass("bg_grey");
					progress.addClass("bg_blue");
				}else{
					progress.addClass("bg_green");
				}
				//add task count
				var tc = $('<div class="task_count"></div>');
				tc.append('<div class="play_task"></div>');
				var ul = $('<ul></ul>');
				tc.append(ul);
				for(var i = 0;i<value.count;i++){
					var l = $("<li></li>");
					if(value.finished>i){
						l.addClass("bg_green");
					}
					l.css("width",(1*100/value.count).toFixed(3)+"%")
					ul.append(l);
				}
				li.append(tc);
				progress.css("width",width+"%");
				ol.append(li);
			});
		}else{
			$(".main_content ol").html('<li class="no_item">Empty Todo List Of Today</li>');
		}
	};
	
	return app;
})();

$(function(){
	app = new app().init();
	calendar = new calendar().init();
});
