/*定义格子类型Cell*/
function Cell(r,c){//定义构造函数Cell，只接受2个参数，r、c
	this.r=r;
	this.c=c;
	this.src="";
}
/*抽象公共父类型Shape*/
function Shape(src,cells,orgi,states){//构造父类型函数shape
	this.cells=cells;//为当前图形对象添加cells属性
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].src=src;//为当前图片添加src属性
	}
	this.orgi=orgi;//为所有图形添加参照格属性
	this.states=states;//为所有图形添加状态数组属性
	this.statei=0;//保存所有图形当前状态序号，创建图形时默认都是0
}
/*定义旋转状态类型state*/
function State(r0,c0,r1,c1,r2,c2,r3,c3){//定义构造函数state，接受8个参数
	/*for(var i=0;i<4;i++){
		"this.r"+i="r"+i;
		"this.c"+i="c"+i;
	}*/
	this.r0=r0;
	this.c0=c0;
	this.r1=r1;
	this.c1=c1;
	this.r2=r2;
	this.c2=c2;
	this.r3=r3;
	this.c3=c3;
}
Shape.prototype.IMGS={//在Shape类型的原型对象中，添加一个共有属性：IMGS，值为一个对象：{T:"img/T.png",O:"img/O.png"}
	T:"img/T.png",
	O:"img/O.png",
	I:"img/I.png",
	J:"img/J.png",
	S:"img/S.png",
	Z:"img/Z.png",
	L:"img/L.png",
};
Shape.prototype.moveDown=function(){
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].r++;
	}
}
Shape.prototype.moveLeft=function(){
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].c--;
	}
}
Shape.prototype.moveRight=function(){
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].c++;
	}
}
Shape.prototype.rotateR=function(){
	this.statei++;//将当前对象的statei+1
	this.statei==this.states.length&&(this.statei=0);
	this.rotate();//调用rotate
}
Shape.prototype.rotateL=function(){
	this.statei--;//将当前对象的statei-1
	this.statei==-1&&(this.statei=this.states.length-1);//如果statei等于-1时，就将statei重置为states的个数-1
	this.rotate();//调用rotate
}
Shape.prototype.rotate=function(){
	var state=this.states[this.statei];//获得当前对象的states数组中statei位置的状态对象，保存在变量state中
	var orgCell=this.cells[this.orgi];//获得当前对象的cells中orgi位置的cell，保存在变量orgCell中
	for(var i=0;i<this.cells.length;i++){ //遍历当前对象中每个cell i: 0,1,2,3
		if(i!=this.orgi){//如果i不等于orgi时
			var cell=this.cells[i];//将当前格临时保存在变量cell中
			cell.r=orgCell.r+state["r"+i];//设置cell的r=orgCell的r+state中ri属性的值
			cell.c=orgCell.c+state["c"+i];//设置cell的c=orgCell的c+state中ci属性的值
		}
	}
}
/*定义T图形的类型*/
function T(){
	Shape.call(this,this.IMGS.T,[
		new Cell(0,3),//实例化cell对象
		new Cell(0,4),
		new Cell(0,5),
		new Cell(1,4)
	],1,[
		new State(0,-1,0,0,0,1,1,0),
		new State(-1,0,0,0,1,0,0,-1),
		new State(0,1,0,0,0,-1,-1,0),
		new State(1,0,0,0,-1,0,0,1),
	]);
}
Object.setPrototypeOf(T.prototype,Shape.prototype);
/*定义O图形的类型*/
function O(){
	Shape.call(this,this.IMGS.O,[
		new Cell(0,4),
		new Cell(0,5),
		new Cell(1,4),
		new Cell(1,5)
	],0,[new State(0,0, 0,1, 1,0, 1,1)]);
}
Object.setPrototypeOf(O.prototype,Shape.prototype);
/*定义I图形的类型*/
function I(){
	Shape.call(this,this.IMGS.I,[
		new Cell(0,3),
		new Cell(0,4),
		new Cell(0,5),
		new Cell(0,6)
	],1,[//参照格位置
		new State(0,-1,0,0,0,1,0,2),//实例化状态对象
		new State(-1,0,0,0,1,0,2,0),	
	]);
}
Object.setPrototypeOf(I.prototype,Shape.prototype);
/*定义J图形的类型*/
function J(){
	Shape.call(this,this.IMGS.J,[
		new Cell(0,3),
		new Cell(0,4),
		new Cell(0,5),
		new Cell(1,5)
	],1,[
		new State(0,-1,0,0,0,1,1,1),
		new State(-1,0,0,0,1,0,1,-1),	
		new State(0,1,0,0,0,-1,-1,-1),	
		new State(1,0,0,0,-1,0,-1,1)	
	]);
}
Object.setPrototypeOf(J.prototype,Shape.prototype);
/*定义L图形的类型*/
function L(){
	Shape.call(this,this.IMGS.L,[
		new Cell(0,3),
		new Cell(0,4),
		new Cell(0,5),
		new Cell(1,3)
	],1,[
		new State(0,-1,0,0,0,1,1,-1),	
		new State(-1,0,0,0,1,0,-1,-1),	
		new State(0,1,0,0,0,-1,-1,1),	
		new State(1,0,0,0,-1,0,1,1)	
	]);
}
Object.setPrototypeOf(L.prototype,Shape.prototype);
/*定义S图形的类型*/
function S(){
	Shape.call(this,this.IMGS.S,[
		new Cell(0,4),
		new Cell(0,5),
		new Cell(1,3),
		new Cell(1,4)
	],3,[
		new State(-1,0,-1,1,0,-1,0,0),	
		new State(0,1,1,1,-1,0,0,0)	
	]);
}
Object.setPrototypeOf(S.prototype,Shape.prototype);
/*定义Z图形的类型*/
function Z(){
	Shape.call(this,this.IMGS.Z,[
		new Cell(0,3),
		new Cell(0,4),
		new Cell(1,4),
		new Cell(1,5)
	],2,[
		new State(-1,-1,-1,0,0,0,0,1),
		new State(-1,1,0,1,0,0,1,0)
	]);
}
Object.setPrototypeOf(Z.prototype,Shape.prototype);
/*定义旋转状态类型State*/
