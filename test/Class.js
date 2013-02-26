var Class = (function(){
 
    var instance,               //当前类内部引用实例
        implements = {},        //新构建的类实现
        interfaces = [],        //需要实现的接口
        instance_list = {},     //所有实例
        className = "Class";    //当前类类名
 
    /**
     *  构造函数
     *  class_name : 类名，字符串
     *  implements : 类实现，JSON对象
     */
    function Class(class_name,implements){
        instance = this;
        init.call(this,class_name,implements);
        return this;
    }
 
    /**
     *  类参数初始化，检查类名和实现是否为空
     *  class_name : 类名，字符串
     *  impls : 类实现，JSON对象
     */
    var init = function(class_name,impls){
        if(isEmpty(class_name))
            Console.error.call(this,"ClassName is Null!");
        else
            className = class_name;
        if(isEmpty(impls))
            Console.error.call(this,"Implements of ["+className+"] is Null!");
        else
            implements = impls;
    };
 
    /**
     *  将新实例化对象加入到对象列表中
     *  ins : 实例化的对象
     */
    var addIntance = function(ins){
        var timestamp = new Date().getTime();
        var key = className+'#'+timestamp;
        ins.id = key;
        instance_list[key] = ins;
        return ins;
    };
 
    /**
     *  从对象列表中移除对象
     *  key : 对象ID
     */
    var removeInstance = function(key){
        if(isNotEmpty(instance_list[key]))
            instance_list[key] = undefined;
    };
 
    /**
     *  从对象列表中获取对象
     *  key ：对象ID
     */
    var get = Class.prototype.get = function(key){
        if(isEmpty(key))return;
        return instance_list[key];
    };
     
    /**
     *  检查当前类是否实现了所有接口中的方法
     *  ins ：当前类的实现
     */
    var checkInterfaceImplements = function(ins){
        var i = 0;
        var errs = [];
        for(var i=0;i<interfaces.length;i++){
            var Interface = interfaces[i];
            $.each(Interface,function(name,method){
                if(name!=="name" && isNotFunc(ins[name])){
                    errs.push(ins.getClassName()+" didnot implements method ["+name+"] in the interface ["+Interface.name+"]!");
                }
            });     
        }
        if(errs.length>0)
            Console.error.call(instance,errs);
        return errs.length==0;
    };
 
    /**
     *  获取当前类名
     */
    Class.prototype.getClassName = function(){
        return className;
    };
 
    /**
     *  实例化当前类
     */
    Class.prototype.instance = function(){
        var cur = this;
        cur = addIntance(implements);
        delete cur.interface;
        delete cur.instance;
        return cur;
    };
 
    /**
     * 设置类需要实现的接口
     * 参数：JSON格式的接口
     */
    Class.prototype.interface = function(){
        var Interfaces = arguments;
        $.each(arguments,function(i,v){
            interfaces.push(v);
        });
        if(isNotEmpty(get(this.id))){
            Console.error.call(this,"Can`t instance "+this.getClassName()+" before implements the interface!");
            return;
        }
        var cur = this;
        if(isNotEmpty(implements)){
            var constructor = implements[cur.getClassName()];
            var ins = isFunc(constructor) && new constructor();
            var impl_methods = {};
            $.each(implements,function(index,value){
                if(index != cur.getClassName())
                    impl_methods[index] = value;
            });
            if(!ins)
                ins = {};
            $.extend(ins,impl_methods);
            implements = ins ? $.extend(ins,this) : implements;
            //check interface implements;
            if(!checkInterfaceImplements(implements))
                return;
        }
        return this;
    }
 
    return Class;
})();