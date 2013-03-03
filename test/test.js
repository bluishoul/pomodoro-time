
var IAnimal = new Interface("Animal",{
	methods:["eat","shut"],
	props:{
		"name":"animal",
		"height":0
	}
});

var IMachine = new Interface("Machine",{
	methods:["ruin"],
	props:{
		"name":"hello",
		"product_id":12312
	}
});


var Man = new Class("Man",{
	eat:function(){
		alert("I am eating!"+this.name+"#"+this.height+"#"+this.id());
	},
	shut:function(){
		alert("shut up!");
	}
}).interface(IAnimal);

var Boy = new Class("Boy",{
	ruin:function(){
		alert("I can ruin you!");
	}
}).interface(IMachine);

var man = Man.instance();
var man1 = Man.instance();
var boy = Boy.instance();
var boy1 = Boy.instance();

Console.log(man);
Console.log(man1);
Console.log(boy);
Console.log(boy1);

