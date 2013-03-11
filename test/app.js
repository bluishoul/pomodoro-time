var global = {
	goto_view:function(name,dir){
		Jr.Navigator.navigate(name,{
			trigger:true,
			animation:{
				type:Jr.Navigator.animations.SLIDE_STACK,
				direction:dir
			}
		});
	},
	goto_list_view:function(){
		this.goto_view('',Jr.Navigator.directions.RIGHT);
	},
	goto_add_view:function(){
		this.goto_view('add',Jr.Navigator.directions.LEFT);

	},
	goto_counter_view:function(){
		this.goto_view('counter',Jr.Navigator.directions.LEFT);
	},
	storage:function(){
		if(!this.stg){
			this.stg = storage.init({
				db_name:"pomodoro-time",
				models:{
					'task':TaskItem,
					'task2':TaskItem2
				},
				index:{
					'task':['finished'],
					'task2':['finished']
				}
			});
		}
		storage = this.stg;
		return this;
		
	}
}.storage();


var TaskItem = Backbone.Model.extend({
	defaults:{
		id:0,
		name:"",
		count:0,
		finished:0,
		dead_line:"",
		remarks:"",
		create_time:""
	}
});

var TaskItem2 = Backbone.Model.extend({
	defaults:{
		name:"",
		count:0,
		finished:0,
		dead_line:"",
		remarks:"",
		create_time:""
	}
});

var TaskList = Backbone.Collection.extend({
	model:TaskItem
});

var TaskItemView = Jr.View.extend({
	tagName:'li',
	render:function(){
		var item = this.model;
		if (!item)return;
		var finished = item.get("count")>=item.get("finished");
		var count_class = finished?"count-positive":"count";
		var task_class = finished?"task-finished":"";
		var progress = item.get("count") + "/" + item.get("finished");
		var itemTpl = [
		    '<a class="' + task_class + '" href="javascript:void();">',
		      item.get("name"),
		      '<span class="' + count_class + '">' + progress + '</span>',
		    '</a>',
		    '<div class="task_menu">',
		    	'<ul class="clearfix">',
		    		'<li data-action="remove">-</li>',
		    		'<li>2</li>',
		    		'<li data-action="play">></li>',
		    		'<li>4</li>',
		    		'<li>5</li>',
		    	'</ul>',
		    '</div>'
		].join("\n");
		$(this.el).html(itemTpl);
		return this;
	}
});

var ListTemplate = [
	'<header class="bar-title">',
	  '<a class="button" href="javascript:void();" id="pt_menu">菜单</a>',
	  '<h1 class="title">活动列表</h1>',
	  '<a class="button-next" href="javascript:void();" id="pt_add_task">添加</a>',
	'</header>',
	'<div class="content">',
		'<ul class="list" id="task_list">',
		  '<li>',
		    '<a href="javascript:void();">',
		      '招聘页面设计',
		      '<span class="count">1/4</span>',
		    '</a>',
		    '<div class="task_menu">',
		    	'<ul class="clearfix">',
		    		'<li data-action="remove">-</li>',
		    		'<li>2</li>',
		    		'<li data-action="play">></li>',
		    		'<li>4</li>',
		    		'<li>5</li>',
		    	'</ul>',
		    '</div>',
		  '</li>',
		  '<li>',
		    '<a class="task-finished" href="javascript:void();">',
		      '番茄时间APP Beta 0.1 PSD',
		      '<span class="count-positive">3/3</span>',
		    '</a>',
		  '</li>',
		  '<li>',
		    '<a class="task-finished" href="javascript:void();">',
		      'OSCHINA 首页设计',
		      '<span class="count-positive">5/3</span>',
		    '</a>',
		  '</li>',
		'</ul>',
	'</div>'
].join('\n');

var ListView = Jr.View.extend({
	initialize:function(){
		this.collection = new TaskList();
		this.collection.bind("add",this.appendTaskItem);
	},
	render:function(){
		var self = this;
		this.$el.html(ListTemplate);
		_(this.collection.models).each(function(item){
			self.appendTaskItem(item);
		},this);
		return this;
	},
	events:{
		"click #pt_menu":"onClickMenuButton",
		"click #pt_add_task":"onClickAddTaskButton",
		"click #task_list li":"onClickTaskListItem"
	},
	//显示菜单
	onClickMenuButton:function(e){
		
	},
	//转换视图到“add”
	onClickAddTaskButton:function(e){
		//this.addTaskItem();
		global.goto_add_view();
		return false;
	},
	onClickTaskListItem:function(el){
		var cur = $(el.currentTarget);
		if(cur.is(".task_menu li")){
			cur.parents(".task_menu").slideUp(function(){
				$(this).hide();
			})
			var action = cur.data("action");
			var action_list = {
				"play":function(){
					global.goto_counter_view();
				}
			}
			action = action_list[action];
			if(action)
				action.call(this,{
					id:1
				});
		}else{
			var task_menu = cur.find(".task_menu");
			task_menu.stop().slideToggle("fast");
		}
		return false;
	},
	addTaskItem:function(){
		var item = new TaskItem();
		item.set({
			name:"Hello Moto " + Math.random()*10,
			count:Math.round(Math.random()*10+1),
			finished:Math.round(Math.random()*10+1),
			dead_line:"",
			remarks:"啥都不需要写"
		});
		this.collection.add(item);
	},
	appendTaskItem:function(item){
		var itemView = new TaskItemView({
			model:item
		});
		$("#task_list").append(itemView.render().el);
	}
});


var AddTemplate = [
	'<header class="bar-title">',
	  '<a class="button-prev" href="javascript:void();" id="pt_list">列表</a>',
	  '<h1 class="title">增加活动</h1>',
	  '<a class="button" href="javascript:void();" id="pt_add_now">确认</a>',
	'</header>',
	'<div class="content">',
		'<form>',
			'<div class="input-group">',
				'<div class="input-row">',
					'<label>名称</label>',
					'<input type="text" placeholder="任务名称">',
				'</div>',
				'<div class="input-row">',
					'<div class="btn-input">',
					  	'<label>番茄数</label>',
					  	'<div class="button">-</div><input type="text" name="count" maxlength="1" value="1"/ ><div class="button">+</div>',
					'</div>',
				'</div>',
				'<div class="input-row">',
					'<label>最后期限</label>',
					'<input type="text" placeholder="点击选取时间">',
				'</div>',
				'<div class="input-row">',
					'<label>备注</label>',
					'<textarea rows="5"></textarea>',
				'</div>',
			'</div>',
			'<a class="button-positive button-block">马上添加</a>',
			'<a class="button-negative button-block">清空</a>',
		'</form>',
	'</div>'
].join("\n");

var AddView = Jr.View.extend({
	render:function(){
		this.$el.html(AddTemplate);
		return this;
	},
	events:{
		"click #pt_list":"onClickListButton",
		"click #pt_add_now":"onClickAddNowButton"
	},
	//转换视图到“list”
	onClickListButton:function(e){
		global.goto_list_view();
		return false;
	},
	//确认添加
	onClickAddNowButton:function(e){
		
	}
});


var CounterTemplate = [
	'<header class="bar-title">',
	  '<a class="button-prev" href="javascript:void();" id="pt_list">列表</a>',
	  '<h1 class="title"><span>番茄时间APP</span></h1>',
	'</header>',
	'<div class="content">',
		'<div class="task-progress">',
			'<div class="task-progress-bar">',
				'<div class="task-progress-finished"></div>',
			'</div>',
			'<div class="task-progress-word">1/3</div>',
		'</div>',
		'<div class="task-timer">',
			'<div class="task-timer-progress"></div>',
		'</div>',
		'<div id="button">',
				'<a class="butt">PAUSE</a>',
		'</div>',
	'</div>'
].join("\n");

var CounterView = Jr.View.extend({
	render:function(){
		this.$el.html(CounterTemplate);
		this.initCounter();
		return this;
	},
	events:{
		"click #pt_list":"onClickListButton",
		"click #pt_add_now":"onClickAddNowButton"
	},
	initCounter:function(){
		setTimeout(function(){
	    	var total_time = 250;
	    	var loader = $(".task-timer-progress").percentageLoader({
	    		height:250,
	    		width:250
	    	});
			loader.setValue(total_time+'s');
			loader.setProgress(1);
			var count = 0;
			var itv = setInterval(function(){
				count++;
				loader.setProgress((total_time-count)/total_time);
				loader.setValue((total_time-count)+'s')
			},1000);

			$("#button").toggle(function(){
				$(this).find(".butt").html("PLAY");
				clearInterval(itv);
			},function(){
				$(this).find(".butt").html("PAUSE");
				itv = setInterval(function(){
					count++;
					loader.setProgress((total_time-count)/total_time);
					loader.setValue((total_time-count)+'s')
				},1000);
			});
		},300);
	},
	//转换视图到“list”
	onClickListButton:function(e){
		global.goto_list_view();
		return false;
	},
	//确认添加
	onClickAddNowButton:function(e){
		
	}
});


var AppRouter = Jr.Router.extend({
	routes:{
		'':'list',
		'add':'add',
		'counter':'counter'
	},

	list:function(){
		var listView = new ListView();
		this.renderView(listView);
	},

	add:function(){
		var addView = new AddView();
		this.renderView(addView);
	},

	counter:function(){
		var counterView = new CounterView();
		this.renderView(counterView);
	}
});

var appRouter = new AppRouter();
Backbone.history.start();