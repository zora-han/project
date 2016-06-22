var tetris={
	OFFSET:15,//保存容器的内边距
	CSIZE:26,//保存每个格子的宽高
	shape:null,//保存正在下落的主角图形
	nextShape:null,//保存备胎图形
	interval:1000,//保存图形下落的速度
	timer:null,//保存当前动画的序号
	wall:null,//保存所有已经停止下落的方块的二位数组
	RN:20,//总行数
	CN:10,//总列数
	
	lines:0,//保存删除的总行数
	score:0,//保存当前得分
	SCORES:[0,10,50,120,200],
	state:1,//保存当前游戏状态
	RUNNING:1,//运行中
	PAUSE:2,//暂停
	GAMEOVER:0,//结束

	LN:10,//每10行1级
	LNINTERVAL:100,//每升一级，interval减100毫秒
	MIN:100,//interval最小毫秒数
	level:1,//保存当前游戏的等级

	start:function(){//初始化一些数据
		this.interval=1000;
		this.level=1,
		this.state=this.RUNNING;//初始化游戏状态为运行
		this.lines=0;
		this.score=0;
		this.wall=[];//将wall初始化为空数组
		for(var r=0;r<this.RN;r++){//r从0开始，到<RN结束，每次增1
			this.wall[r]=new Array(this.CN);//设置wall中r位置的行为CN个元素的空数组
		}
		this.shape=this.randomShape();//随机生成主角图形，保存在shape中
		this.nextShape=this.randomShape();//随机生成备胎图形，保存在nextShape中
		this.paint();//调用paint绘制主角图形
		//启动周期性定时器,设置任务函数为moveDown，提前绑定this,时间间隔为interval
		this.timer=setInterval(this.moveDown.bind(this),this.interval);
		var me=this;
		document.onkeydown=function(e){//为当前页面绑定键盘按下事件
			switch(e.keyCode){//判断键盘号
				case 37: me.state==me.RUNNING&&me.moveLeft(); break;//左移
				case 38: me.state==me.RUNNING&&me.rotateR(); break;//右转
				case 39: me.state==me.RUNNING&&me.moveRight(); break;//右移
				case 40: me.state==me.RUNNING&&me.moveDown(); break;//下落
				case 90: me.state==me.RUNNING&&me.rotateL(); break;//左转
				case 83: me.state==me.GAMEOVER&&me.start();  break;//按S，启动游戏
				case 80: me.state==me.RUNNING&&me.pause(); break;//如果是p，暂停
				case 67: me.state==me.PAUSE&&me.myContinue(); break;//如果是c
				case 32: me.state==me.RUNNING&&me.landToBottom(); break;//空格，一键到底
				case 81: me.state!=me.GAMEOVER&&me.quit();//退出
			}
		}
	},
	landToBottom:function(){//专门将主角图形一落到底
		while(this.canDown()){
			this.moveDown();
		}
		this.paint();
	},
	quit:function(){//专门直接结束游戏
		this.state=this.GAMEOVER;
		clearInterval(this.timer);
		this.timer=null;
		this.paint();
	},
	pause:function(){//专门负责暂停游戏
		this.state=this.PAUSE;
		clearInterval(this.timer);
		this.timer=null;
		this.paint();
	},
	myContinue:function(){//专门负责从暂停恢复运行
		this.state=this.RUNNING;
		this.timer=setInterval(this.moveDown.bind(this),this.interval);
		this.paint();
	},
	canRotate:function(){//检查能否旋转
		for(var i=0;i<this.shape.cells.length;i++){//遍历当前图形中每个cell      
		  var cell=this.shape.cells[i];//将当前图形临时保存在变量cell中   
		  if(cell.r<0||cell.r>this.RN-1||cell.c<0||cell.c>this.CN-1 //如果cell的r>19或cell.r<0或cell.c<0或cell.c>9
			  ||this.wall[cell.r][cell.c]!==undefined){//或在wall中和c相同位置不为空
			return false;//就返回false
		  }
		}//(遍历结束)
		return true;//就返回true
	},
	rotateR:function(){//专门负责右转一次
		this.shape.rotateR();//调用shape的rotateR方法
		!this.canRotate()?this.shape.rotateL():this.paint();//如果不能旋转，就让shape，再左转回来，//否则,//重绘一切
	},
	rotateL:function(){//专门负责左转一次
		this.shape.rotateL();//调用shape的rotateL方法
		!this.canRotate()?this.shape.rotateR():this.paint();
		this.paint();//调用shape的
	},
	canLeft:function(){//检查能否左移
		for(var i=0;i<this.shape.cells.length;i++){//遍历shape中每个cell
			var cell=this.shape.cells[i];//将当前cell临时存储在变量cell中
			if(cell.c==0||this.wall[cell.r][cell.c-1]!==undefined){//如果cell的r已经等于19
			//或wall中cell的下方位置不等于undefined
				return false;//返回false
			}
		}//(遍历结束)
		return true;//返回true
	},
	moveLeft:function(){//左移
		if(this.canLeft()){//如果可以下落
			this.shape.moveLeft();//调用shape的moveDown方法
			this.paint();
		}
	},
	canRight:function(){//检查能否右移
		for(var i=0;i<this.shape.cells.length;i++){//遍历shape中每个cell
			var cell=this.shape.cells[i];//将当前cell临时存储在变量cell中
			if(cell.c==this.CN-1||this.wall[cell.r][cell.c+1]!==undefined){//如果cell的r已经等于19
			//或wall中cell的下方位置不等于undefined
				return false;//返回false
			}
		}//(遍历结束)
		return true;//返回true
	},
	moveRight:function(){//右移
		if(this.canRight()){//如果可以下落
			this.shape.moveRight();//调用shape的moveDown方法
			this.paint();
		}
	},
	canDown:function(){//专门用于检测能否下落
		for(var i=0;i<this.shape.cells.length;i++){//遍历shape中每个cell
			var cell=this.shape.cells[i];//将当前cell临时存储在变量cell中
			if(cell.r==this.RN-1||this.wall[cell.r+1][cell.c]!==undefined){//如果cell的r已经等于19
			//或wall中cell的下方位置不等于undefined
				return false;//返回false
			}
		}//(遍历结束)
		return true;//返回true
	},
	moveDown:function(){//负责将图形下落一次
		if(this.state==this.RUNNING){
			if(this.canDown()){//如果可以下落
				this.shape.moveDown();//调用shape的moveDown方法
			}else{//否则
				this.landIntoWall();//调用landIntoWall，将shape放入墙中
				var ln=this.deleteRows();//检查并删除满格行
				this.lines+=ln;//将ln累加到lines中
				this.score+=this.SCORES[ln];
				if(this.lines>this.level*this.LN){//如果lines>level*LN
					this.level++;//level+1
					if(this.interval>this.MIN){
						this.interval-=this.LNINTERVAL;//将interval-INTERVAL
						clearInterval(this.timer);//停止定时器
						this.timer=setInterval(this.moveDown.bind(this),this.interval);//重新启动定时器
						console.log(this.interval);
					}
				}
				if(!this.isGameOver()){//如果游戏没结束
					this.shape=this.nextShape;//备胎图形转正
					this.nextShape=this.randomShape();//生成新备胎图形
				}else{//否则
					/*this.state=this.GAMEOVER;//修改游戏状态为GAMEOVER
					clearInterval(this.timer);//停止定时器
					this.timer=null;//将timer置空*/
					this.quit();
				}
			}
			this.paint();
		}
	},
	paint:function(){//重绘一切//所有绘制方法都要在paint函数中调用
		//var reg=/<img[^>]*>/g;//用reg删除pg的内容中的所有img,结果再保存回pg的内容中
		pg.innerHTML=pg.innerHTML.replace(/<img[^>]*>/g,"");
		this.paintShape();//绘制主角图形
		this.paintNext();//绘制备胎图形
		this.paintWall();//绘制墙
		this.painScore();//绘制分数
		this.paintState();//绘制显示图片
	},
	paintShape:function(){//专门绘制主角图形(绘制图形格子)
		var frag=document.createDocumentFragment();//创建文档片段，保存在变量frag中
		for(var i=0;i<this.shape.cells.length;i++){//遍历shape的cells数组中的每个cell对象
			var cell=this.shape.cells[i];//将当前格子，保存在变量cell中
			var img=new Image();//创建一个新Image对象，保存在变量img中
			img.src=cell.src;//设置img的src为cell的src
			img.style.top=this.OFFSET+cell.r*this.CSIZE+"px";//设置img的top为OFFSET+cell的r*CSIZE
			img.style.left=this.OFFSET+cell.c*this.CSIZE+"px";//设置img的left为OFFSET+cell的c*CSIZE
			frag.appendChild(img);//将img追加到frag中
		}//(遍历结束)
		pg.appendChild(frag);//将frag追加到id为pg的元素下
	},
	paintNext:function(){//专门绘制备胎图形
		var frag=document.createDocumentFragment();//创建文档片段，保存在变量frag中
		for(var i=0;i<this.nextShape.cells.length;i++){//遍历nextShape的cells数组中的每个cell对象
			var cell=this.nextShape.cells[i];//将当前格子，保存在变量cell中
			var img=new Image();//创建一个新Image对象，保存在变量img中
			img.src=cell.src;//设置img的src为cell的src
			img.style.top=this.OFFSET+(cell.r+1)*this.CSIZE+"px";//设置img的top为OFFSET+cell的(r+1)*CSIZE
			img.style.left=this.OFFSET+(cell.c+10)*this.CSIZE+"px";//设置img的left为OFFSET+cell的(c+10)*CSIZE
			frag.appendChild(img);//将img追加到frag中
		}//(遍历结束)
		pg.appendChild(frag);//将frag追加到id为pg的元素下
	},
	painScore:function(){//专门绘制分数
		lines.innerHTML=this.lines;
		score.innerHTML=this.score;
		level.innerHTML=this.level;
	},
	paintState:function(){//专门根据游戏状态显示图片
		if(this.state==this.PAUSE){//如果当前游戏状态为pause
			var img=new Image();
			img.src="img/pause.png";
			pg.appendChild(img);//将img追加到pg下
		}else if(this.state==this.GAMEOVER){
			var img=new Image();//新建一个Image对象img
			img.src="img/game-over.png";//img的src为img/game-over.png
			pg.appendChild(img);
		}
	},
	randomShape:function(){//专门随机创建一个图形
		var r=(Math.random()*7)^0;//在0~2之间生成随机数，保存在变量r中
		switch(r){//判断r
		  case 0:return new O();//如果是0：返回一个新的O类型的图形对象
		  case 1:return new I();//如果是1：返回一个新的I类型的图形对象
		  case 2:return new T();//如果是2：返回一个新的T类型的图形对象
		  case 3:return new J();//如果是3：返回一个新的J类型的图形对象
		  case 4:return new S();//如果是4：返回一个新的S类型的图形对象
		  case 5:return new Z();//如果是5：返回一个新的Z类型的图形对象
		  case 6:return new L();//如果是6：返回一个新的L类型的图形对象
		}
	},
	landIntoWall:function(){//专门负责将主角放入wall中
		for(var i=0;i<this.shape.cells.length;i++){//遍历shape中每个cell
		  var cell=this.shape.cells[i];//将当前cell临时存储在变量cell中
		  this.wall[cell.r][cell.c]=cell;//将当前cell赋值给wall中相同位置
		}
	},
	paintWall:function(){//专门绘制墙中所有方块
		var frag=document.createDocumentFragment();//创建文档片段frag
		for(var r=this.RN-1;r>=0;r--){//自底向上遍历wall中每行的每个cell
			if(this.wall[r].join("")==""){
				break;
			}
			for(var c=0;c<this.CN;c++){
				var cell=this.wall[r][c];//将当前格子，保存在变量cell中
				if(cell){
					var img=new Image();//创建一个新Image对象，保存在变量img中
					img.src=cell.src;//设置img的src为cell的src
					//设置img的top为OFFSET+cell的r*CSIZE
					img.style.top=this.OFFSET+cell.r*this.CSIZE+"px";
					//设置img的left为OFFSET+cell的c*CSIZE
					img.style.left=this.OFFSET+cell.c*this.CSIZE+"px";
					frag.appendChild(img);//将img追加到frag中
				}
			}
		}//(遍历结束)
		pg.appendChild(frag);//将frag追加到pg中
	},
	deleteRows:function(){//删除第r行
		for(var r=this.RN-1,ln=0;r>=0;r--){//自底向上遍历wall中每一行，同时声明变量l=0
			if(this.wall[r].join("")==""){break;}//如果当前行是空行，就直接退出循环（break）
			if(this.isFull(r)){//如果当前行满格
				this.deleteRow(r);//调用deleteRow，删除当前行
				r++;//r留在原地
				ln++;//ln+1
				if(ln==4){break;}//如果ln等于4了，就退出循环
			}
		}
		return ln;//返回ln
	},
	deleteRow:function(delr){//删除第delr行
		for(var r=delr;r>0;r--){//r从delr开始，到r>=0结束，每次r-1
			this.wall[r]=this.wall[r-1];//将wall中r-1行赋值给wall中r行
			this.wall[r-1]=new Array(this.CN);//创建一个CN个元素的空数组赋值给wall中r-1行
			for(var c=0;c<this.CN;c++){//遍历wall中r行的每个格
				var cell=this.wall[r][c];//将当前各保存在cell中
				if(cell!==undefined){cell.r++}//如果cell有效，就将cell的r+1
			}
			if(this.wall[r-2].join("")==""){break;}//如果wall中r-2行是空行，就退出循环
		}
	},
	isFull:function(r){//专门判断第r行是否满格
		var reg=/^,|,,|,$/;
		return String(this.wall[r]).search(reg)==-1;//返回 wall中r行转为字符串后，用search查找是否包含reg，与-1比较的结果
	},	
	isGameOver:function(){//判断游戏是否结束
		for(var i=0;i<this.nextShape.cells.length;i++){//遍历备胎图形中每个cell
			var cell=this.nextShape.cells[i];
			if(this.wall[cell.r][cell.c]!==undefined){//如果wall中cell相同位置有格
				return true;//返回true
			}
		}//遍历结束
		return false;//返回false
	},	
}
window.onload=function(){
	tetris.start();
}