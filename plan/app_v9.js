/*v9:在V8的基础上添加了暂停功能*/
/*全局变量*/
var canvasWidth=480;//画布的宽
var canvasHeight=650;//画布的高

var canvas=document.getElementById("canvas");//获得页面中设置的canvas画布
canvas.width=canvasWidth;
canvas.height=canvasHeight;

var ctx=canvas.getContext("2d");

const PHASE_DOWNLOAD=1;		//图片下载阶段
const PHASE_READY=2;		//就绪阶段
const PHASE_LOADING=3;		//游戏加载阶段
const PHASE_PLAY=4;			//游戏进行阶段
const PHASE_PAUSE=5;		//游戏暂停阶段
const PHASE_GAMEOVER=6;		//游戏结束阶段

/*所有的图片变量*/
var imgBackground;//背景图片
var imgBullet;//子弹图片
var imgEnemy1=[];//小号敌机所有图片
var imgEnemy2=[];//中号敌机所有图片
var imgEnemy3=[];//大号敌机所有图片
var imgGameLoading=[];//游戏加载中所有的图片
var imgGamePauseNor;//暂停图片
var imgHero=[];//英雄所有图片
var imgStart;//就绪阶段的图片

var curPhase=PHASE_DOWNLOAD;	//当前所处阶段

/*阶段1：下载图片*/
	download();		//开始下载图片
	function download(){
		var progress=0;		//下载进度:总共33张图片，每张图片权重为3，只有背景图权重为4
		ctx.fillStyle="#eee";//字的颜色
		ctx.font="80px Helvetica";//加载进度的字体
		function drawProgress(){
			ctx.clearRect(0,0,canvasWidth,canvasHeight);//在画下一个进度之前先清空画布			
			ctx.fillText(progress+"%",canvasWidth/2-ctx.measureText(progress+"%").width/2,canvasHeight/2+40);//填充写字
			ctx.strokeText(progress+"%",canvasWidth/2-ctx.measureText(progress+"%").width/2,canvasHeight/2+40);//描边写字
			if(progress>=100){//所有图片加载完成，开始游戏
				startGame();
			}
		}
		imgBackground=new Image();//生成背景图片
		imgBackground.src='img/background.png';
		imgBackground.onload=function(){//背景图片加载完成
			progress+=4;
			drawProgress();
		}
		imgBullet=new Image();//生成子弹图片
		imgBullet.src='img/bullet.png';
		imgBullet.onload=function(){
			progress+=3;
			drawProgress();
		}

		imgEnemy1[0]=new Image();//生成敌机1
		imgEnemy1[0].src='img/enemy1.png';
		imgEnemy1[0].onload=function(){
			progress+=3;
			drawProgress();
		}
		for(var i=1;i<5;i++){//敌机1爆炸状态
			imgEnemy1[i]=new Image();
			imgEnemy1[i].src='img/enemy1_down'+i+'.png';
			imgEnemy1[i].onload=function(){
				progress+=3;
				drawProgress();
			}
		}

		imgEnemy2[0]=new Image();//生成敌机2
		imgEnemy2[0].src='img/enemy2.png';
		imgEnemy2[0].onload=function(){
			progress+=3;
			drawProgress();
		}
		for(var j=1;j<5;j++){//敌机2爆炸状态
			imgEnemy2[j]=new Image();
			imgEnemy2[j].src='img/enemy2_down'+j+'.png';
			imgEnemy2[j].onload=function(){
				progress+=3;
				drawProgress();
			}
		}
		
		imgEnemy3[0]=new Image();//敌机3正常状态
		imgEnemy3[0].src='img/enemy3_n1.png';
		imgEnemy3[0].onload=function(){
			progress+=3;
			drawProgress();
		}
		imgEnemy3[1]=new Image();
		imgEnemy3[1].src='img/enemy3_n2.png';
		imgEnemy3[1].onload=function(){
			progress+=3;
			drawProgress();
		}
		imgEnemy3[2]=new Image();//敌机3攻击状态
		imgEnemy3[2].src='img/enemy3_hit.png';
		imgEnemy3[2].onload=function(){
			progress+=3;
			drawProgress();
		}
		for(var k=3;k<9;k++){//敌机3爆炸状态
			imgEnemy3[k]=new Image();
			imgEnemy3[k].src='img/enemy3_down'+(k-2)+'.png';
			imgEnemy3[k].onload=function(){
				progress+=3;
				drawProgress();
			}
		}
		
		for(var m=0;m<4;m++){//游戏加载中所有的图片
			imgGameLoading[m]=new Image();
			imgGameLoading[m].src='img/game_loading'+(m+1)+'.png';
			imgGameLoading[m].onload=function(){
				progress+=3;
				drawProgress();
			}
		}

		imgGamePauseNor=new Image();//暂停图片
		imgGamePauseNor.src='img/game_pause_nor.png';
		imgGamePauseNor.onload=function(){
			progress+=3;
			drawProgress();
		}

		imgHero[0]=new Image();//英雄正常状态1
		imgHero[0].src='img/hero1.png';
		imgHero[0].onload=function(){
			progress+=3;
			drawProgress();
		}
		imgHero[1]=new Image();//英雄正常状态2
		imgHero[1].src='img/hero2.png';
		imgHero[1].onload=function(){
			progress+=3;
			drawProgress();
		}
		for(var n=2;n<6;n++){//英雄爆炸状态
			imgHero[n]=new Image();
			imgHero[n].src='img/hero_blowup_n'+(n-1)+'.png';
			imgHero[n].onload=function(){
				progress+=3;
				drawProgress();
			}
		}
		
		imgStart=new Image();//就绪图片
		imgStart.src='img/start.png';
		imgStart.onload=function(){
			progress+=3;
			drawProgress();
		}
	}

/*阶段2：就绪*/
	var sky;//天空对象
	var logo;//游戏logo对象
	function startGame(){
		curPhase=PHASE_READY;
		sky=new Sky(imgBackground);//创建天空对象
		logo=new Logo(imgStart);//创建logo对象
		startEngine();//启动整个游戏的主引擎——就是定时器

		//当用户点击画布，后进入下一阶段
		canvas.onclick=function(){
			if(curPhase===PHASE_READY){
				curPhase=PHASE_LOADING;//进入加载阶段
				loading=new Loading(imgGameLoading);//正式进入第三阶段的时候才创建loading图片
			}
		}
	}
	/*天空的构造函数——使用两张图片轮换*/
	function Sky(img){
		this.x1=0;//初始时，第一张背景图的坐标
		this.y1=0;
		this.x2=0;//初始时，第二张背景图的坐标
		this.y2=-img.height;
		this.draw=function(){//绘制天空对象
			ctx.drawImage(img,this.x1,this.y1);
			ctx.drawImage(img,this.x2,this.y2);
		}
		this.move=function(){//移动天空对象
			this.y1++;
			this.y2++;
			if(this.y1>=canvasHeight){//第一张背景图移出画布了
				this.y1=this.y2-img.height;
			}else if(this.y2>=canvasHeight){//第二张背景图移出画布了
				this.y2=this.y1-img.height;
			}
		}
	}
	function Logo(img){
		this.x=40;
		this.y=0;
		this.draw=function(){
			ctx.drawImage(img,this.x,this.y);
		}
	}
	
/*阶段3：加载中*/
	var loading;
	function Loading(imgs){
		this.x=canvasWidth/2-imgs[0].width/2;
		this.y=canvasHeight-imgs[0].height;
		this.index=0;//当前要绘制的是数组中的图片的下标
		this.draw=function(){
			ctx.drawImage(imgs[this.index],this.x,this.y);
		}
		this.counter=0;
		this.move=function(){
			this.counter++;
			if(this.counter%5===0){
				this.index++;
				if(this.index>=imgs.length){//图片加载完成开始游戏
					curPhase=PHASE_PLAY;
					hero=new Hero(imgHero);
					bulletList=new BulletList();
					enemyList=new EnemyList();
				}
			}			
		}
	}

/*阶段4：游戏进行阶段*/
	var hero;
	var heroCount=3;//有三个英雄
	var heroScore=0;//英雄所得分数
	function Hero(imgs){//英雄构造方法
		//英雄初始默认位置为屏幕下方中央
		this.x=canvasWidth/2-imgs[0].width/2;
		this.y=canvasHeight-imgs[0].height;
		this.width=imgs[0].width;
		this.height=imgs[0].height;
		this.index=0;//待绘制的是数组中的那个图片
		this.counter=0;
		this.crashed=false;//撞毁程序
		this.draw=function(){
			ctx.drawImage(imgs[this.index],this.x,this.y);
		}
		this.move=function(){//切换英雄当前状态
			this.counter++;
			if(this.counter%4===0){
				if(!this.crashed){//当没有开始撞毁程序时
					if(this.index===0){//切换英雄的两种正常状态
						this.index=1;
					}else if(this.index===1){
						this.index=0;
					}
				}else{//当英雄与敌机碰撞，开始撞毁程序时
					if(this.index===0||this.index===1){//直接进入英雄的撞毁状态
						this.index=2;
					}else if(this.index<imgs.length-1){
						this.index++;
					}else{//坠毁程序结束，血格减一
						heroCount--;
						if(heroCount>0){//还有英雄可以用
							hero=new Hero(imgHero);
						}else{
							curPhase=PHASE_GAMEOVER;
						}
					}
				}			
			}
			if(this.counter%10===0){//该数字可以做成变量，表示间隔多久发射一发子弹，根据等级来改变发射速度
				this.fire();
			}			
		}
		this.fire=function(){//发射子弹
			var bullet=new Bullet(imgBullet);
			bulletList.add(bullet);
		}
	}
	canvas.onmousemove=function(e){//当鼠标在画布上移动时，英雄跟着鼠标的移动而移动
		if(curPhase===PHASE_PLAY){
			var x=e.offsetX;
			var y=e.offsetY;
			if(x>=canvasWidth-imgHero[0].width/2){
				x=canvasWidth-imgHero[0].width/2;
			}else if(x<=imgHero[0].width/2){
				x=imgHero[0].width/2;
			}
			hero.x=x-imgHero[0].width/2;
			hero.y=y-imgHero[0].width/2;
		}
	}
	/*V5版新增内容*/
	function Bullet(img){//子弹的构造方法
		this.x=hero.x+imgHero[0].width/2-img.width/2;
		this.y=hero.y-img.height;
		this.width=img.width;
		this.height=img.height;
		this.removable=false;//当前子弹能否删除
		this.draw=function(){
			ctx.drawImage(img,this.x,this.y);
		}
		this.move=function(){
			this.y-=5;//此处的数字可以做成变量，指定子弹移动的速度
			//若子弹飞出画布上边界、或打中敌机，子弹消失
			if(this.y<=-img.height){
				this.removable=true;
			}
		}
	}
	//子弹列表对象，其中保存着当前的所有子弹
	var bulletList;
	function BulletList(){
		this.arr=[];//画布上所有的子弹对象
		this.add=function(bullet){//添加子弹
			this.arr.push(bullet);			
		}
		this.remove=function(i){
			this.arr.splice(i,1);//删除子弹
		}
		this.draw=function(){
			for(var i in this.arr){
				this.arr[i].draw();//绘制每一个子弹
			}
		}
		this.move=function(){
			for(var i in this.arr){
				this.arr[i].move();//让每一个子弹移动
				if(this.arr[i].removable){
					this.remove(i);
				}
			}
		}
	}
	/*V6版本新增加内容*/
	/*小号敌机*/
	function Enemy1(imgs){
		this.x=Math.random()*(canvasWidth-imgs[0].width);
		this.y=-imgs[0].height;
		this.width=imgs[0].width;
		this.height=imgs[0].height;
		this.index=0;//当前绘制的图片在数组中的下标
		this.speed=10;//小号敌机飞行速度
		this.removable=false;
		this.blood=1;//小敌机只有一格血
		this.crashed=false;//是否被撞毁
		this.counter=0;//用于控制小敌机炸毁速度
		this.draw=function(){
			ctx.drawImage(imgs[this.index],this.x,this.y);
		}
		this.move=function(){
			this.y+=this.speed;
			this.checkHit();//碰撞检查
			this.counter++;
			//若飞出下边界或撞毁了，则可以删除
			if(this.counter%2===0){
				if (this.crashed){
					if(this.index===0){
						this.index=1;
					}else if(this.index<imgs.length-1){
						this.index++;
					}else{
						this.removable=true;
						heroScore+=3;
					}
				}
			}
			
			if(this.y>=canvasHeight){
				this.removable=true;
			}
		}
		/*碰撞检验
			检测碰撞的四个条件
			obj1.x+obj1.width>=obj2.x
			obj2.x+obj2.width>=obj1.x
			obj1.y+obj1.height>=obj2.y
			obj2.y+obj2.height>=obj1.y
		*/			
		this.checkHit=function(){
			//每个敌机必须和我方的每个子弹和英雄做碰撞检验
			for(var i in bulletList.arr){
				var bullet=bulletList.arr[i];				
				if((this.x+this.width>=bullet.x)
					&&(bullet.x+bullet.width>this.x)
					&&(this.y+this.height>=bullet.y)
					&&(bullet.height+bullet.y>=this.y)){
					this.blood--;
					bullet.removable=true;
					if(this.blood<=0){
						this.crashed=true;
					}
				}
			}
			if((this.x+this.width>=hero.x)
				&&(hero.x+hero.width>=this.x)
				&&(this.y+this.height>=hero.y)
				&&(hero.y+hero.height>=this.y)){
				hero.crashed=true;//我方英雄撞毁
			}
		}
	}
	/*中号敌机*/
	function Enemy2(imgs){
		this.x=Math.random()*(canvasWidth-imgs[0].width);
		this.y=-imgs[0].height;
		this.width=imgs[0].width;
		this.height=imgs[0].height;
		this.index=0;//当前绘制的图片在数组中的下标
		this.speed=6;//中号敌机飞行速度
		this.removable=false;
		this.blood=3;//中号敌机有三格血
		this.crashed=false;//是否被撞毁
		this.counter=0;//用于控制中号敌机炸毁速度
		this.draw=function(){
			ctx.drawImage(imgs[this.index],this.x,this.y);
		}
		this.move=function(){
			this.y+=this.speed;
			this.checkHit();//碰撞检查
			this.counter++;
			//若飞出下边界或撞毁了，则可以删除
			if(this.counter%2===0){
				if (this.crashed){
					if(this.index===0){
						this.index=1;
					}else if(this.index<imgs.length-1){
						this.index++;
					}else{
						this.removable=true;
						heroScore+=5;
					}
				}
			}			
			if(this.y>=canvasHeight){
				this.removable=true;
			}
		}
		this.checkHit=function(){
			//每个敌机必须和我方的每个子弹和英雄做碰撞检验
			for(var i in bulletList.arr){
				var bullet=bulletList.arr[i];				
				if((this.x+this.width>=bullet.x)
					&&(bullet.x+bullet.width>this.x)
					&&(this.y+this.height>=bullet.y)
					&&(bullet.height+bullet.y>=this.y)){
					this.blood--;
					bullet.removable=true;
					if(this.blood<=0){
						this.crashed=true;
					}
				}
			}
			if((this.x+this.width>=hero.x)
				&&(hero.x+hero.width>=this.x)
				&&(this.y+this.height>=hero.y)
				&&(hero.y+hero.height>=this.y)){
				hero.crashed=true;
			}
		}
	}
	/*大号敌机*/
	function Enemy3(imgs){
		this.x=Math.random()*(canvasWidth-imgs[0].width);
		this.y=-imgs[0].height;
		this.width=imgs[0].width;
		this.height=imgs[0].height;
		this.index=0;//当前绘制的图片在数组中的下标
		this.speed=3;//大号敌机飞行速度
		this.removable=false;
		this.blood=5;//大号敌机只有5格血
		this.crashed=false;//是否被撞毁
		this.draw=function(){
			ctx.drawImage(imgs[this.index],this.x,this.y);
		}
		this.counter=0;//move函数被调用的次数
		this.move=function(){
			this.counter++;
			this.y+=this.speed;
			this.checkHit();//碰撞检验
			if(this.counter%2===0){
				if(!this.crashed){//当没有开始撞毁程序时
					if(this.index===0){//切换大敌机的两种正常状态
						this.index=1;
					}else if(this.index===1){
						this.index=0;
					}
				}else{//当子弹与大敌机碰撞，开始撞毁程序时
					if(this.index===0||this.index===1){//直接进入大敌机的撞毁状态
						this.index=3;
					}else if(this.index<imgs.length-1){
						this.index++;
					}else{//执行到最后一步后，将大敌机移除
						this.removable=true;
						heroScore+=10;
					}
				}			
			}
			if(this.y>=canvasHeight){
				this.removable=true;
			}
		}
		this.checkHit=function(){
			//每个敌机必须和我方的每个子弹和英雄做碰撞检验
			for(var i in bulletList.arr){
				var bullet=bulletList.arr[i];				
				if((this.x+this.width>=bullet.x)
					&&(bullet.x+bullet.width>this.x)
					&&(this.y+this.height>=bullet.y)
					&&(bullet.height+bullet.y>=this.y)){
					this.blood--;
					bullet.removable=true;
					if(this.blood<=0){
						this.crashed=true;
					}
				}
			}
			if((this.x+this.width>=hero.x)
				&&(hero.x+hero.width>=this.x)
				&&(this.y+this.height>=hero.y)
				&&(hero.y+hero.height>=this.y)){
				hero.crashed=true;
			}
		}
	}
	/*所有敌机组成的列表*/
	var enemyList;
	function EnemyList(){
		this.arr=[];//保存所有敌机的数组
		this.add=function(enemy){
			this.arr.push(enemy);
		}
		this.draw=function(){
			for(var i in this.arr){
				this.arr[i].draw();//绘制每一个敌机
			}
		}
		this.move=function(){
			for(var i in this.arr){
				this.arr[i].move();//让每一个敌机移动
				if(this.arr[i].removable){
					this.remove(i);
				}
			}
			this.generate();//生成所有的敌机
		}
		this.remove=function(i){			
			this.arr.splice(i,1);//删除敌机
		}
		this.generate=function(){//随机生成一个敌机
			/*敌机生成要求：
			何时生成敌机是随机的，不是定时或是连续的
			小号敌机的概率最大，中号其次，大号最高
			思路：1~100随机数 如果是1~5 我就造小号敌机
							如果是6~8我就造中号敌机
							如果是9~10我就造大号敌机*/
			var num=(Math.random()*200)^0;
			if(num<6){
				this.add(new Enemy1(imgEnemy1));
			}else if(num<9){
				this.add(new Enemy2(imgEnemy2));
			}else if(num<10){
				this.add(new Enemy3(imgEnemy3));
			}
		}
	}
	/*绘制当前统计信息*/
	function drawStat(){
		ctx.font="25px Helvetica";
		ctx.fillStyle="#333";
		ctx.fillText("SCORE:"+heroScore,10,35);
		//绘制剩余的英雄数量
		ctx.fillText("HEROS:"+heroCount,canvasWidth-ctx.measureText("HEROS:"+heroCount).width-10,35);
	}

/*阶段5：游戏暂停阶段*/
	canvas.onmouseout=function(){//鼠标移出画布
		if(curPhase===PHASE_PLAY){
			curPhase=PHASE_PAUSE;
		}
	}
	canvas.onmouseover=function(){//鼠标移入画布
		if(curPhase===PHASE_PAUSE){
			curPhase=PHASE_PLAY;
		}
	}
	function drawPause(){//绘制暂停图标
		var x=canvasWidth/2-imgGamePauseNor.width/2;
		var y=canvasHeight/2-imgGamePauseNor.height/2;
		ctx.drawImage(imgGamePauseNor,x,y);
	}

/*阶段6：游戏结束阶段*/
	function drawGameOver(){
		ctx.font="80px Helvetica";
		ctx.fillStyle="#bbb";
		ctx.strokeStyle="#666";
		var x=canvasWidth/2-ctx.measureText("GAME OVER").width/2;
		var y=canvasHeight/2-40;//视角偏上舒服，所有-40
		ctx.fillText("GAME OVER",x,y);
		ctx.strokeText("GAME OVER",x,y);
	}
/*游戏的主引擎——主定时器*/
	function startEngine(){
		setInterval(function(){
			sky.draw();
			sky.move();
			switch(curPhase){
				case PHASE_READY: 
						logo.draw(); 
						break;					//就绪阶段绘制logo
				case PHASE_LOADING: 
						loading.draw();
						loading.move();
						break;					//游戏加载阶段
				case PHASE_PLAY: 
						hero.draw(); 
						hero.move(); 
						bulletList.draw();
						bulletList.move();
						enemyList.draw();
						enemyList.move();
						drawStat();
						break;					//游戏进行阶段
				case PHASE_PAUSE:
						hero.draw(); 
						bulletList.draw();
						enemyList.draw();
						drawStat();
						drawPause();
						break;					//游戏暂停阶段
				case PHASE_GAMEOVER:
						hero.draw(); 
						bulletList.draw();
						enemyList.draw();
						drawStat();
						drawGameOver();	
						break;				//游戏结束阶段
			}
			
		},42);//每一秒钟动24次
	}