var IMachine = new Interface("Machine",{
	methods:["ruin"],
	props:{
		"name":"hello",
		"product_id":12312
	}
});

var IAnimal = new Interface("Animal",{
	methods:["eat","shut"],
	props:{
		"name":"animal",
		"height":0
	}
});

var Man = new Class("Man",{
	eat:function(){
		alert("I am eating!");
	},
	speak:function(){
		alert("I am speaking!");
	},
	ruin:function(){
		alert("I can ruin you!");
	},
	shut:function(){
		alert("shut up!");
	}
}).interface(IAnimal);

var Boy = new Class("Boy",{

});

var man = Man.instance();
var man1 = Man.instance();
var boy = Boy.instance();
var boy1 = Boy.instance();

Console.log(man.id());
Console.log(man1.id());
Console.log(boy.id());
Console.log(boy1.id());

