/**
 *	Interface : 用来定义接口
 *	Use Case : 
 *	var Interface_Man = new Interface("Man",{
 *		methods:["eat","speak"],//需要实现的方法
 *		props:{					//静态变量
 *				"prop_default":0,
 *				"prop_count":1234
 *		}
 *	});
 *
 */
var Interface = (function(){

	var instance,
		className = "Interface";

	Interface.prototype.getClassName = function(){
		return instance.className;
	};

	Interface.prototype.getConfigure = function() {
		return instance.configure;
	};
	
	var checkConfigure = function(conf){
		if(isEmpty(conf.methods) || !isArray(conf.methods))
			Console.error.call(this,"illegal params!");
	};

	var initProps = function(){

	};

	function Interface(name,conf){

		instance = this;

		if(isEmpty(name) || isEmpty(conf) || !typeOf(conf,"object")){
			instance.className = className;
			Console.error.call(this,"illegal params!");
		}

		checkConfigure.call(this,conf);

		instance.className = name;
		instance.configure = conf;

	};

	var extendsProp = function(ins){
		var ps = instance.getConfigure().props;
		$.each(ps,function(index,value){
			ins[index] = value;
		});
	}

	var checkMethodsImplements = function(ins){
        var errs = [];
		var methods = instance.getConfigure().methods;
		$.each(methods,function(){
			var name = this;
	        if(name!=="name" && isNotFunc(ins[name])){
	            errs.push(ins.getClassName()+" didnot implements method ["+name+"] in the interface ["+instance.getClassName()+"]!");
	        }
		});
        return errs;
	}

	/**
	 *	调用方法：Interface_Man.checkInterfaceImplements.call(instance,implements);
	 */
	Interface.prototype.checkInterfaceImplements = function(implements) {
		instance = this;
        extendsProp(implements);
        return checkMethodsImplements(implements);
	};

	Interface.prototype.extends = function(interface) {
		instance = this;
		var methods = instance.getConfigure().methods,
			props = instance.getConfigure().props,
			temp = [];
		//扩展属性
		$.each(interface.configure.methods,function(index,value){
			if($.inArray(value,methods)==-1){
				temp.push(value);
			}
		});
		$.merge(methods,temp);
		//扩展方法
		temp1 = [];
		values1 = {};
		$.each(interface.configure.props,function(index,value){
			temp1.push(index);
			values1[index] = value;
		});
		temp = [];
		values = {};
		$.each(props,function(index,value){
			temp.push(index);
			values[index] = value;
		});

		$.each(temp1,function(index,value){
			if($.inArray(value,temp)==-1){
				values[value] = values1[value];
			}
		});
		$.extend(props,values);

		return instance;
	};

	return Interface;

})();