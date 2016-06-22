var game={
	date:null,//保存二维数组，二维数组中保存了游戏所有格子的数据
	RN:4,//保存总行数
	CN:4,//保存总列数
	score:0,//保存当前方式
	state:1,//保存游戏状态
	GAMEOVER:0,//游戏结束状态
	RUNNING:1,//游戏运行中，设置常量
	CELLZSIZE:100,//保存每个格子的宽高
	OFFSET:16,
	top:0,//保存最高分
	init:function(){//初始化游戏的格子
		gridPanel.style.width=this.CN*116+16+"px";//计算容器的宽: CN*116+16
		gridPanel.style.height=this.RN*116+16+"px";//计算容器的高: RN*116+16
		for(var r=0,arr=[];r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				arr.push(""+r+c);
			}
		}
		var grids='<div id="g'+arr.join('" class="grid"></div><div id="g')+'" class="grid"></div>';
		var cells='<div id="c'+arr.join('" class="cell"></div><div id="c')+'" class="cell"></div>';
		gridPanel.innerHTML=grids+cells;//设置id为gridPanel的div的内容为grids+cells
	},
	start:function(){//启动游戏
		if(document.cookie.trim()!=""){
			this.top=parseInt(document.cookie.slice(4));
		}
		this.init();//动态生成单元格
		this.score=0;//分数清零
		this.date=[];//初始化二维数组,创建空数组，保存在当前对象的date属性中
		this.state=this.RUNNING;//初始化游戏运行状态为运行中
		for(var r=0;r<this.RN;r++){//r从0开始，到RN结束，每次增加1
			this.date[r]=[];//先向date中压入一个空数组
			for(var c=0;c<this.CN;c++){//c从0开始。到<CN结束，每次增1
				this.date[r].push(0);//向data中r行压入一个0
			}
		}//（遍历结束）
		this.randomNum();//生成两个随机数
		this.randomNum();
		this.updateView();//将随机数显示在页面中
		var me=this;//留住this运用到闭包的
		//响应键盘事件
		document.onkeydown=function(e){//e保存了事件发生时的信息
			e=window.event||e;//获得事件对象——事件发生时自动封装事件信息的对象
			switch(e.keyCode){//获得键盘号
				case 37: me.moveLeft();break;
				case 38: me.moveUp();break;
				case 39: me.moveRight();break;
				case 40: me.moveDown();break;
			}
		}
	},
	randomNum:function(){//只负责生成一个随机数
		while(1){//反复执行
			var r=(Math.random()*this.RN)^0;//在0~RN-1之间随机生成一个行号r
			var c=(Math.random()*this.CN)^0;//在0~CN-1之间随机生成一个行号c
			if(this.date[r][c]==0){//如果data中r行c列为0
				var n=(Math.random()*2);//声明变量n，再生成一个随机数
				this.date[r][c]=n<=0.5?2:4;//如果<0.5,就将n赋值为2，否则将n赋值为4
				break;//退出循环
			}
		}
	},
	updateView:function(){//专门将data中的元素，更新到页面
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){//遍历data中每个元素
				var div=document.getElementById("c"+r+c);//用id找到当前元素对应的前景格，保存在div中
				if(this.date[r][c]==0){//如果当前元素等于0
					div.innerHTML="";//设置div的内容为""
					div.className="cell";//设置div的class属性为cell
				}else{//否则
					div.innerHTML=this.date[r][c];//设置div的内容为当前元素的值
					div.className="cell n"+div.innerHTML;//设置div的class属性为"cell n"+当前元素值
				}
			}
		}
		score.innerHTML=this.score;//将当前分数刷新到页面中
		finalScore.innerHTML=this.score;
		gameOver.style.display=(this.state==this.GAMEOVER?"block":"none");
		top1.innerHTML=this.top;//显示最高分
	},
	move:function(fun){
		var before=String(this.date);//先给数组照相，保存在变量before中
		fun();
		var after=String(this.date);//再给数组照相，保存在变量after中
		if(before!=after){//如果before不等于after时
			this.randomNum();//生成一个随机数
			if(this.isGameOver()==true){
				this.state=this.GAMEOVER;
				if(this.score>this.top){
					var date=new Date("2016/04/19");
					document.cookie="top="+this.score+";expires="+date.toGMTString();
					console.log(document.cookie);
				}
			}
			this.updateView();//更新页面
		}
	},
	moveLeft:function(){
		var me=this;
		this.move(function(){
			for(var r=0;r<me.RN;r++){//r从0开始，到<RN结束，每次增1
				me.moveLeftInRow(r);//调用moveLeftInRow,传入r作为参数
			}//(遍历结束)
		});
	},
	moveLeftInRow:function(r){//负责左移第r行
		for(var c=0;c<this.CN-1;c++){//c从0开始，到<CN-1结束，每次增1
			var nextc=this.getNextInRow(r,c);//查找data中r行c列之后下一个不为0的位置，保存在变量nextc中
			if(nextc==-1){//如果没找到，就直接退出循环
				break;
			}else if(this.date[r][c]==0){ //否则，如果当前元素等于0
				this.date[r][c]=this.date[r][nextc];//将data中r行nextc列的值替换给当前元素
				this.date[r][nextc]=0;//将data中r行nextc列的值重置为0
				c--;//让c留在原地
			}else if(this.date[r][c]==this.date[r][nextc]){//否则，如果当前元素的值等于r行nextc列的元素值
				this.score+=(this.date[r][c]*=2);//将当前元素的值*2
				this.date[r][nextc]=0;//将data中r行nextc列的值重置为0
			}
		}
	},
	getNextInRow:function(r,c){//在r行中找c列之后下一个不为0的位置
		for(var nextc=c+1;nextc<this.CN;nextc++){//nextc从c+1开始，到<CN结束,每次增1
			if(this.date[r][nextc]!=0){//如果data中r行nextc列的值不等于0
				return nextc;//返回nextc
			}	
		}//(遍历结束)
		return -1;//返回-1
	},
	moveRight:function(){
		var me=this;
		this.move(function(){
			for(var r=0;r<me.RN;r++){
				me.moveRightInRow(r);
			}
		});
	},
	moveRightInRow:function(r){
		for(var c=this.CN-1;c>0;c--){//c从CN-1开始，到1结束，每次减1
			var prevc=this.getPrevInRow(r,c);//查找data中r行c列之后前一个不为0的位置，保存在变量prevc中
			if(prevc==-1){//如果没找到，就直接退出循环
				break;
			}else if(this.date[r][c]==0){ //否则，如果当前元素等于0
				this.date[r][c]=this.date[r][prevc];//将data中r行prevc列的值替换给当前元素
				this.date[r][prevc]=0;//将data中r行nextc列的值重置为0
				c++;//让c留在原地
			}else if(this.date[r][c]==this.date[r][prevc]){//否则，如果当前元素的值等于r行prevc列的元素值
				this.score+=(this.date[r][c]*=2);//将当前元素的值*2
				this.date[r][prevc]=0;//将data中r行prevc列的值重置为0
			}
		}
	},
	getPrevInRow:function(r,c){//查找r行c之前的不为0的位置
		for(var prevc=c-1;prevc>=0;prevc--){//prevc从c-1开始，到>=0结束,每次-1
		  if(this.date[r][prevc]!=0){//如果r行prevc位置的元素不等于0
			return prevc;//就返回prevc
		  }
		}//(遍历结束)返回-1
		return -1;
	},
	moveUp:function(){
		var me=this;
		this.move(function(){
			for(var c=0;c<me.CN;c++){
				me.moveUpInCol(c);
			}
		});
	},
	moveUpInCol:function(c){
		for(var r=0;r<this.RN-1;r++){
			var nextr=this.getDownInCol(r,c);
			if(nextr==-1){
				break;
			}else if(this.date[r][c]==0){
				this.date[r][c]=this.date[nextr][c];
				this.date[nextr][c]=0;
				r--;
			}else if(this.date[r][c]==this.date[nextr][c]){
				this.score+=(this.date[r][c]*=2);
				this.date[nextr][c]=0;
			}
		}
	},
	getDownInCol:function(r,c){
		for(var nextr=r+1;nextr<this.RN;nextr++){//prevc从c-1开始，到>=0结束,每次-1
		  if(this.date[nextr][c]!=0){//如果r行prevc位置的元素不等于0
			return nextr;//就返回prevc
		  }
		}//(遍历结束)返回-1
		return -1;
	},
	moveDown:function(){//
		var me=this;
		this.move(function(){
			for(var c=0;c<me.CN;c++){
				me.moveDownInCol(c);
			}
		});
	},
	moveDownInCol:function(c){
		for(var r=this.RN-1;r>0;r--){
			var prevr=this.getUpInCol(r,c);
			if(prevr==-1){
				break;
			}else if(this.date[r][c]==0){
				this.date[r][c]=this.date[prevr][c];
				this.date[prevr][c]=0;
				r++;
			}else if(this.date[r][c]==this.date[prevr][c]){
				this.score+=(this.date[r][c]*=2);
				this.date[prevr][c]=0;
			}
		}
	},
	getUpInCol:function(r,c){
		for(var prevr=r-1;prevr>=0;prevr--){//prevc从c-1开始，到>=0结束,每次-1
		  if(this.date[prevr][c]!=0){//如果r行prevc位置的元素不等于0
			return prevr;//就返回prevc
		  }
		}//(遍历结束)返回-1
		return -1;
	},
	isGameOver:function(){
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				if(this.date[r][c]==0){
					return false;
				}else if(c<this.CN-1&&this.date[r][c]==this.date[r][c+1]){
					return false;
				}else if(r<this.RN-1&&this.date[r][c]==this.date[r+1][c]){
					return false;
				}
			}
		}
		return true;
	},
}
//事件：当页面加载完成后自动触发
window.onload=function(){
	game.start();
}