/*全局变量*/
var canvasWidth=480;//画布的宽
var canvasHeight=650;//画布的高

var canvas=document.getElementById("canvas");
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
				}
			}			
		}
	}

/*阶段4：游戏进行阶段*/
/*阶段5：游戏暂停阶段*/
/*阶段6：游戏结束阶段*/
/*游戏的主引擎——主定时器*/
	function startEngine(){
		setInterval(function(){
			sky.draw();
			sky.move();
			switch(curPhase){
				case PHASE_READY: logo.draw(); break;							//就绪阶段绘制logo
				case PHASE_LOADING: loading.draw(); loading.move(); break;		//游戏加载阶段
				case PHASE_PLAY:break;					//游戏进行阶段
				case PHASE_PAUSE:break;					//游戏暂停阶段
				case PHASE_GAMEOVER:break;				//游戏结束阶段
			}
			
		},42);//每一秒钟动24次
	}