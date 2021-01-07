var game = new Phaser.Game(1024,768, Phaser.AUTO,'ORLANDOFURIOSO',{preload: preload, create: create, update: update, render: render });





	function preload(){
		//carica lo sfondo
		game.load.image('sfondo1', 'assets/sfondo1p.png'); 
		game.load.image('sfondo2', 'assets/sfondo2p.png'); 
		game.load.image('sfondo3', 'assets/sfondo3p.png'); 
		game.load.image('luna1', 'assets/luna1p.png'); 
		game.load.image('luna2', 'assets/luna2p.png'); 
		game.load.image('luna3', 'assets/luna3p.png'); 
		game.load.image('luna4', 'assets/luna4.png');
		game.load.image('maschera','assets/maschera.png'); 
		game.load.image('perg1','assets/Pergamena_Bosco_1.png');
		game.load.image('perg2','assets/Pergamena_Bosco_2.png');
		game.load.image('perg3','assets/Pergamena_Bosco_3.png');
		game.load.image('perg4','assets/Pergamena_Luna_1.png');
		game.load.image('perg5','assets/Pergamena_Luna_2.png');

		
		game.load.spritesheet('astolfo', 'assets/astolfo_spritesheet.png',21,40,29); //carica lo sprite di astolfo

		game.load.spritesheet('saraceno', 'assets/saraceno_spritesheet.png',21,35,17);
		game.load.spritesheet('lupo', 'assets/wolf_running.png',45,25,9);
		game.load.spritesheet('scudo', 'assets/scudo_anim.png',25,35,5);
		game.load.spritesheet('tutorialmov','assets/uparrow.png',27,28,5);
		game.load.spritesheet('arciere','assets/arciere_spritesheet.png',26,37,6);
		game.load.spritesheet('freccia','assets/freccia.png',39,11,1);
		game.load.spritesheet('meteora','assets/meteora.png',23,23,3);
		game.load.spritesheet('pergamena','assets/pergamena.png',19,23,5);
		game.load.spritesheet('ippogrifo','assets/ippogrifo.png',51,50,1);
		game.load.spritesheet('checkpoint','assets/bandiera_sprite.png',22,37,15);
		game.load.spritesheet('anima','assets/anima.png',23,31,6);
		game.load.spritesheet('boss','assets/Orlando_sprite.png',20,37,22);
		game.load.spritesheet('spada','assets/spada_infuocata_grossa.png',60,22,3);
		game.load.spritesheet('senno', 'assets/senno_sps.png',22,32,7);
		game.load.spritesheet('buco1','assets/pozzo2_sprite_scuro.png',160,768,10);
		game.load.spritesheet('buco2','assets/pozzo1_sprite_scuro.png',455,768,10);


		//tilemap loading
		game.load.tilemap('map', 'assets/foresta.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('tiles', 'assets/tileset-foresta.png');


	}
//hitboxes del giocatore
var player;
var hitboxes; 
var hitbox1; //hitbox attacco destro
var hitbox2; //hitbox attacco sinistro
var hitbox3; //hitbox attacco su
var hitbox4; //hitbox attacco giù
var isGameOver = false;

//Gruppo di nemici 1
var saraceni;

//Gruppo di nemici 2
var lupi;

var arcieri;
var arco; //weapon
var arco2;
var arco3;
var nFrecce = 99; //numero di frecce
var sFrecce = 700; //velocità di frecce
var dFrecce = 2000; //delay di frecce

var meteore;

var anime;
var pozzo1;
var pozzo2;

var boss;
var bosshead;
var spada;
var nS = 200; //numero di spade
var sS = 500; //velocità di spade
var dS = 1800; //delay di spade
var spS = [0,0];

var senno;
var sennoInizio;

var ippogrifo;

var hud;
var hpviz;
var pergGroup;
var tutorialmov;
var scudi;
var hp = 1;
var maxHP = 3;
var checkpoint;
var nCP = 4;

var collezionabili;
var nCollezionabili = 5;
var collPresi = 0;

/*var frasi = [	"Dimentica il cervello e ascolta il cuore",
 				"Il mio cuore è e sarà sempre tuo.",
 				"Se ti amo così male, è perché ti amo troppo",
				"Mi mandi su, nello spazio, poi mi lasci giù, nello strazio",
				"Con i tuoi baci, ho disegnato il mio cielo stellato"];
var fraseLove;*/

var frase1;
var frase2;
var frase3;
var frase4;
var frase5;



var isGoodEnding = false;

var grav = 500;
var scala = 2; //scala di tutti gli sprite di game
var facing = "left"; //direzione in cui va il personaggio
var movOrizzontale = 160; //movimento orizzontale
var movVerticale = -420; //movimento verticale (salto o caduta rapida)
var jumpTimer = 0; 
var atkTimer = 0;
let playerSpawnPoint = [100,600]; //x e y del punto di spawn del player
var isInvincible = false;

//variabili di sfondo e mappa
var sfondo1;
var sfondo2;
var sfondo3;
var luna1;
var luna2;
var luna3
var luna4;
var maschera;
var map;
var groundlayer;

	function create(){

		 //mette lo sfondo 
		sfondo3 = game.add.tileSprite(0,0,1024*8,768,'sfondo3');
		sfondo2 = game.add.tileSprite(0,0,1024*8,768,'sfondo2');
		sfondo1 = game.add.tileSprite(0,0,1024*8,768,'sfondo1');
		
		luna4 = game.add.sprite(1024*15,0,'luna4');
		luna3 = game.add.tileSprite(1024*9,0,1024*9,768,'luna3');
		luna2 = game.add.tileSprite(1024*9,0,1024*9,768,'luna2');
		luna1 = game.add.tileSprite(1024*9,0,1024*9,768,'luna1');

		


		 //game physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		map = game.add.tilemap('map');
		map.addTilesetImage("tileset-forest",'tiles');
		map.setCollisionBetween(0,1000,true,'piattaforme');

		
		map.createLayer('bg2');
		groundlayer = map.createLayer('piattaforme');
		map.createLayer('acqua');
		map.createLayer('bg');
		
		
		groundlayer.resizeWorld(); 

		
		setgWell();
		setHUD();
		setPlayer();
		setLupi();
		setSaraceni();
		setArcieri();
		setArco();
		setScudi();
		setCollezionabili();
		setIppogrifo();
		setCheckpoint();
		setMeteore();
		setAnime();
		setBoss();
		setSpada();
		setSennoI();

		for(var i = 0; i<collPresi; i++){
				pergGroup.getChildAt(i).tint = 0xFFFFFF;
				collezionabili.getChildAt(i).kill();
				}
	
		maschera = game.add.image(0,0, 'maschera');
		maschera.alpha = 1;
		maschera.fixedToCamera = true;
		fadeout(3000);

		frase1 = game.add.image(512,384,'perg1');
		frase1.alpha = 0;
		frase1.anchor.setTo(0.5,0.5);
		frase1.scale.setTo(0.18);
		frase1.fixedToCamera = true;


		frase2 = game.add.image(512,384,'perg2');
		frase2.alpha = 0;
		frase2.anchor.setTo(0.5,0.5);
		frase2.scale.setTo(0.18);
		frase2.fixedToCamera = true;

		frase3 = game.add.image(512,384,'perg3');
		frase3.alpha = 0;
		frase3.anchor.setTo(0.5,0.5);
		frase3.scale.setTo(0.18);
		frase3.fixedToCamera = true;

		frase4 = game.add.image(512,384,'perg4');
		frase4.alpha = 0;
		frase4.anchor.setTo(0.5,0.5);
		frase4.scale.setTo(0.18);
		frase4.fixedToCamera = true;


		frase5 = game.add.image(512,384,'perg5');
		frase5.alpha = 0;
		frase5.anchor.setTo(0.5,0.5);
		frase5.scale.setTo(0.18);
		frase5.fixedToCamera = true;


		
		game.time.events.add(10,uncheck,this,checkpoint.getChildAt(0));
		game.time.events.add(10,uncheck,this,checkpoint.getChildAt(1));
		game.time.events.add(10,uncheck,this,checkpoint.getChildAt(2));
		game.time.events.add(10,uncheck,this,checkpoint.getChildAt(3));
	}

	function update(){

		if(player.x <7500 || player.x >1024*9.5){
 			game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
		}else{
			game.camera.setPosition(1024*7 - 200,400);
		}

		game.physics.arcade.collide(player,groundlayer);
		game.physics.arcade.collide(saraceni,groundlayer);
		game.physics.arcade.collide(lupi,groundlayer);
		game.physics.arcade.collide(arcieri,groundlayer);
		game.physics.arcade.collide(ippogrifo,groundlayer);
		game.physics.arcade.collide(checkpoint,groundlayer);
		game.physics.arcade.collide(anime,groundlayer);
		game.physics.arcade.collide(boss,groundlayer);
		

		if(isInvincible == false){
		game.physics.arcade.overlap(player,saraceni,hitAndRespawn);
		game.physics.arcade.overlap(player,lupi,hitAndRespawn);
		//game.physics.arcade.overlap(player,arcieri,hitAndRespawn);
		game.physics.arcade.overlap(player,arco.bullets,hitAndRespawn);
		game.physics.arcade.overlap(player,arco2.bullets,hitAndRespawn);
		game.physics.arcade.overlap(player,arco3.bullets,hitAndRespawn);
		game.physics.arcade.overlap(player,meteore,hitAndRespawn);
		game.physics.arcade.overlap(player,anime,hitAndRespawn);
		game.physics.arcade.overlap(player,spada.bullets,hitAndRespawn);

		}

		game.physics.arcade.overlap(player,scudi,pickUpScudi);
		game.physics.arcade.overlap(player,collezionabili,pickUpColl);
		game.physics.arcade.overlap(player,ippogrifo,tpmask);
		game.physics.arcade.overlap(player,checkpoint.getChildAt(0),activateCp);
		game.physics.arcade.overlap(player,checkpoint.getChildAt(1),activateCp);
		game.physics.arcade.overlap(player,checkpoint.getChildAt(2),activateCp);
		game.physics.arcade.overlap(player,checkpoint.getChildAt(3),activateCp);
	

		
		oobKill(player,true);
		oobKill(lupi,false);
		oobKill(meteore,false);
		

		//EFFETTO PARALLASSE
		if(player.x <7500 ){
		sfondo1.tilePosition.x = player.x * -0.05;
		sfondo2.tilePosition.x = player.x * -0.13;
		}else if(player.x >1024*10){
			luna1.tilePosition.x = player.x * -0.05;
			luna2.tilePosition.x = player.x * -0.13;
		}
		
		
		


		playermovement();
		playerAtkDirection();
		sennoFlyAway(30,5000);

		//COMPARSA DEL SENNO
		if(collPresi == 5){
			game.add.tween(senno).to({alpha:1},200, Phaser.Easing.Linear.None, true, 0, 0, false);
			senno.animations.play('idle');
		}
		//FINALE ALTERNATIVO
		if(collPresi == 5 && boss.alive == false){
			var text = game.add.text(15890,400,"HAI VINTO CON IL SENNO!",{
				font: "30px Helvetica",
				fill: "#F1F1f1",
				align: "center"
			});
			text.anchor.setTo(0.5,1);
		}
		else if(collPresi != 5 && boss.alive == false){
			var text = game.add.text(15890,400,"HAI VINTO SENZA SENNO!",{
				font: "30px Helvetica",
				fill: "#F1F1f1",
				align: "center"
			});
			text.anchor.setTo(0.5,1);
		}

		
		movimentoSaraceno(2840,3200,saraceni.getChildAt(0));
		movimentoSaraceno(3065,3200,saraceni.getChildAt(1));
		movimentoSaraceno(4470,4610,saraceni.getChildAt(2));
		movimentoSaraceno(4980,5120,saraceni.getChildAt(3));

		
		movimentoLupi(lupi.getChildAt(0), 150);
		movimentoLupi(lupi.getChildAt(1), 150);
		movimentoLupi(lupi.getChildAt(2), 250);
	


		arciereSpara(arcieri.getChildAt(0),arco,190);
		arciereSpara(arcieri.getChildAt(1),arco2,160);
		arciereSpara(arcieri.getChildAt(2),arco3,180);
		
		
		fallMeteora(meteore.getChildAt(0),-400,500,300);
		fallMeteora(meteore.getChildAt(1),-300,200,400);
		fallMeteora(meteore.getChildAt(2),-400,100,300);
		fallMeteora(meteore.getChildAt(3),-600,100,400);
		fallMeteora(meteore.getChildAt(4),-400,300,200);
		
		bossSwing(150);


		if(anime.getChildAt(0).body.onFloor())
			anime.getChildAt(0).body.velocity.y = -300;

		if(anime.getChildAt(1).body.onFloor())
			anime.getChildAt(1).body.velocity.y = -200;

		if(anime.getChildAt(2).body.onFloor())
			anime.getChildAt(2).body.velocity.y = -250;

		if(anime.getChildAt(3).body.onFloor())
			anime.getChildAt(3).body.velocity.y = -400;


		gravityWell(11590,11750,-100);
		if(player.x >11850)
			gravityWell(12260,12715,-50);

		for(var j=0; j<3;j++)
		scudi.getChildAt(j).animations.play('mov');
		
		for(var i=0; i<5;i++)
		collezionabili.getChildAt(i).animations.play('mov');


		
		

		if(isGameOver == true){
			hp=1;
			isGameOver = false;
			fadein();

				
			game.time.events.add(300,restart,this);
		
		}
	}

// FUNZIONI
	/*  Codice di prova per tenere le bandierine svolazzanti dopo il restart, non funziona però

		if(playerSpawnPoint[0] == checkpoint.getChildAt(3).x){
			wind(checkpoint.getChildAt(3));
			}
				else if(playerSpawnPoint[0] == checkpoint.getChildAt(2).x){
					wind(checkpoint.getChildAt(2));
				}
					else if(playerSpawnPoint[0] == checkpoint.getChildAt(1).x){
						wind(checkpoint.getChildAt(1));
					}
						else if(playerSpawnPoint[0] == checkpoint.getChildAt(0).x){
							wind(checkpoint.getChildAt(0));
						}
						else{
							uncheck(checkpoint.getChildAt(0));
							uncheck(checkpoint.getChildAt(1));
							uncheck(checkpoint.getChildAt(2));
							uncheck(checkpoint.getChildAt(3));
						}*/

	function restart(){


		game.state.restart();
	}

	function oobKill(entity, isPlayer){
		if(entity.y > 1000 || entity.y < -100){
			entity.kill();

			if(isPlayer){
				isGameOver = true;
			}	
		}
		
	}

	
	function spearLeftCollision(hitboxes, enemy){
		game.camera.shake(0.005,200,true,Phaser.Camera.SHAKE_HORIZONTAL,true);
			enemy.tint = 0xFF4455;
			enemy.body.enable = false;
			game.time.events.add(300, enemyDeath, this, enemy);
			
	}
	function spearRightCollision(hitboxes, enemy){
		game.camera.shake(0.005,200,true,Phaser.Camera.SHAKE_HORIZONTAL,true);
			enemy.tint = 0xFF4455;
			enemy.body.enable = false;
			game.time.events.add(300, enemyDeath, this, enemy);
			
	}
	
	function enemyDeath(enemy){
		enemy.kill();
	}
	
	/* -----FUNZIONE RIMOSSA----
	function spearDownCollision(hitboxes, enemy){
		
			player.body.velocity.y = -300;
			enemy.kill();
	}
	function spearUpCollision(hitboxes, enemy){
		
			enemy.kill();
	} */
	
	function hitAndRespawn(player, enemy){
		if(hp<=1){
			game.camera.shake(0.03,1000,true,Phaser.Camera.SHAKE_HORIZONTAL,true);
			isGameOver = true;
		}else if(hp==3){
			game.camera.shake(0.03,250,true,Phaser.Camera.SHAKE_HORIZONTAL,true);
			player.body.velocity.y = Math.sin(230)*200;
			//player.body.velocity.x = -1000;
						
			hp--;
			hpviz.getChildAt(2).tint = 0x808080;
			iFrame();
			game.time.events.add(Phaser.Timer.SECOND * 1,resetiFrame,this);
					
			isGameOver = false;			
			
			}else if(hp==2){
				game.camera.shake(0.03,250,true,Phaser.Camera.SHAKE_HORIZONTAL,true);
				player.body.velocity.y = Math.sin(230)*200;
				//player.body.velocity.x = -1000;
				
				hp--;
				hpviz.getChildAt(1).tint = 0x808080;
				iFrame();
				game.time.events.add(Phaser.Timer.SECOND * 1,resetiFrame,this);

				isGameOver = false;
					
			}	
			
		}

		function despawn(bullet, groundlayer){
			bullet.kill();
		}

		function iFrame(){
			player.tint = 0x555555;
			isInvincible = true;
		}
		function resetiFrame(){
			player.tint = 0xFFFFFF;
			isInvincible = false;
		}

	function setPlayer(){

		player = game.add.sprite(playerSpawnPoint[0], playerSpawnPoint[1], 'astolfo'); //posiziona astolfo
		player.animations.add('idle',[0,1,2,3,4,5], 6, true);
		player.animations.add('corsa',[6,7,8,9,10,11,12,13], 12, true);
		player.animations.add('atkLateral',[17,18,19,14], 12, false);
		player.animations.add('jumpnfall', [21,22,23,24,25,26,27],5,false);
		player.animations.add('fall',[25,26,27],12,false);
		player.anchor.setTo(0.5,1); //sposta l'anchor point del personaggio al centro dello sprite
		player.scale.setTo(scala, scala); //scalo (valori positivi) o flippo (valori negativi) lo sprite
 		player.smoothed = false; //toglie l'antialiasing e fa tornare i pixel visibili (LESGOOO)
		
 		game.physics.enable(player);
		//player.body.collideWorldBounds = true; //il giocatore collide con i bordi del mondo
 		player.body.gravity.y = grav; //gravità che viene applicata sul giocatore
 		
 		hitboxes = game.add.physicsGroup();

 		player.addChild(hitboxes);
 		hitbox1 = hitboxes.create(0,0,null);
		hitbox1.name = "spearRight";
		hitbox1.body.setSize(30,80,20,-80);


 		hitbox2 = hitboxes.create(0,0,null);
		hitbox2.name = "spearLeft";
		hitbox2.body.setSize(30,80,-50,-80);


		senno = hitboxes.create(-35,-35,'senno');
		senno.alpha = 0;
		senno.smoothed = false;
		senno.animations.add('idle',[0,1,2,3,4,5,6],6,true);
		senno.name = "senno";
	
		 
 		/* 
 		---- FUNZIONE RIMOSSA ----
 		hitbox3 = hitboxes.create(0,0,null);
		hitbox3.name = "spearUp";
		hitbox3.body.setSize(60,30,-30,-110);

 		hitbox4 = hitboxes.create(0,0,null);
		hitbox4.name = "spearDown";
		hitbox4.body.setSize(60,30,-30,0);
		*/
	
 		
		return senno;
 		return player;
	}

	function setSennoI(){
		sennoInizio = game.add.sprite(260,600,'senno');
		sennoInizio.animations.add('idle',[0,1,2,3,4,5,6],6,true);
		sennoInizio.scale.setTo(scala);
		sennoInizio.anchor.setTo(0.5,1);
		sennoInizio.smoothed = false;
		game.physics.enable(sennoInizio);
		sennoInizio.animations.play('idle');

		return sennoInizio;
	}

	function sennoFlyAway(range,timeAlive){
		sennoInizio.body.velocity.x = 0;
		
		var d;
		d = sennoInizio.x - player.x - (range*3.5);
		var firstInRange = false;
		
		if(d <= range && !firstInRange){
			firstInRange = true;
			sennoInizio.body.gravity.x = 15000;
			sennoInizio.body.gravity.y = -100;

			game.time.events.add(timeAlive,enemyDeath,this,sennoInizio);
		}
		else if(firstInRange){
			sennoInizio.body.gravity.x = 15000;
			sennoInizio.body.gravity.y = -100;
		}

		
	}
	//FUNZIONE MOVIMENTI
	function playermovement(){
		player.body.velocity.x = 0; //resetta la velocità orizzontale

		if(game.input.keyboard.isDown(Phaser.Keyboard.A))
			{
				player.body.velocity.x = -movOrizzontale;
				if(facing !== "left")
					facing = "left";
				if(player.body.onFloor() == false)
					player.animations.play("jumpnfall");
				else
				player.animations.play("corsa");
			}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D))
			{
				player.body.velocity.x = movOrizzontale;
				if(facing !== "right")
					facing = "right";
				if(player.body.onFloor() == false)
					player.animations.play("jumpnfall");
				else
				player.animations.play("corsa");
			}
			else if(game.time.now> atkTimer + 1000){
				if(!player.body.onFloor()){
					player.animations.play("jumpnfall");
				}
				else
				player.animations.play("idle");
			}
		if(game.input.keyboard.isDown(Phaser.Keyboard.W) && player.body.onFloor() && game.time.now > jumpTimer)
			{
				player.body.velocity.y = movVerticale;
				jumpTimer = game.time.now + 650;
				player.animations.play("jumpnfall");
			}
		/* ---FEATURE RIMOSSA---
		else if(game.input.keyboard.isDown(Phaser.Keyboard.S) && player.body.onFloor() == false && game.time.now > atkTimer +3000 )
			{
				player.body.velocity.y = -movVerticale;
				player.animations.play("fall");
			}
		*/


			//PERMETTE IL FLIP DELLE SPRITESHEET
			if(facing === "left")
			player.scale.setTo(-scala, scala);	
			if(facing === "right")
			player.scale.setTo(scala,scala);
	}



	//FUNZIONE DI ATTACCO MULTIDIREZIONALE
	function playerAtkDirection(){

		

		if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)  && game.time.now > atkTimer){
			
			player.body.velocity.x = 0;

			if(facing !== "left")
					facing = "left";
			atkTimer = game.time.now + 300;
			player.animations.play("atkLateral");

			game.physics.arcade.overlap(hitbox2,saraceni,spearLeftCollision);
			game.physics.arcade.overlap(hitbox2,lupi,spearLeftCollision);
			game.physics.arcade.overlap(hitbox2,arcieri,spearLeftCollision);
			game.physics.arcade.overlap(hitbox2,anime,spearLeftCollision);
			game.physics.arcade.overlap(hitbox2,boss,spearLeftCollision);
			
			
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && game.time.now > atkTimer){
			
			player.body.velocity.x = 0;

			if(facing !== "right")
					facing = "right";
			atkTimer = game.time.now + 300;

			player.animations.play("atkLateral");
			//if(game.time.now > atkTimer-1000 && game.time.now < atkTimer-500 +100){	}		
				game.physics.arcade.overlap(hitbox1,saraceni,spearRightCollision);
				game.physics.arcade.overlap(hitbox1,lupi,spearRightCollision);
				game.physics.arcade.overlap(hitbox1,arcieri,spearRightCollision);
				game.physics.arcade.overlap(hitbox1,anime,spearRightCollision);
				game.physics.arcade.overlap(hitbox1,boss,spearRightCollision);
			
		
	/*	---FEATURE RIMOSSA ---
		if(game.input.keyboard.isDown(Phaser.Keyboard.UP) && game.time.now > atkTimer){
			atkTimer = game.time.now+10;
			game.physics.arcade.overlap(hitbox3,saraceni,spearUpCollision);
			game.physics.arcade.overlap(hitbox3,lupi,spearUpCollision);
			game.physics.arcade.overlap(hitbox3,arcieri,spearUpCollision);
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && player.body.onFloor() == false && game.time.now > atkTimer){
			atkTimer = game.time.now+10;
			game.physics.arcade.overlap(hitbox4,saraceni,spearDownCollision);
			game.physics.arcade.overlap(hitbox4,lupi,spearDownCollision);
			game.physics.arcade.overlap(hitbox4,arcieri,spearDownCollision);
			*/
		}

	}
	function setSaraceni(){
		saraceni = game.add.physicsGroup();


		
		var saraceno1 = saraceni.create(2840,300,'saraceno'); 
		var saraceno2 = saraceni.create(3065,420,'saraceno');
		var saraceno3 = saraceni.create(4470,200,'saraceno');
		var saraceno4 = saraceni.create(4980,420,'saraceno');

		

		for(var i = 0; i<4;i++){
			saraceni.getChildAt(i).scale.setTo(scala);
			saraceni.getChildAt(i).anchor.setTo(0.5,1);
			saraceni.getChildAt(i).animations.add('corsaR',[1,2,3,4,5,6,7,8],12, true);
			saraceni.getChildAt(i).animations.add('corsaL',[9,10,11,12,13,14,15,16],12, true);
		}

		saraceni.setAll('body.gravity.y',grav);
		saraceni.setAll('smoothed', false);

		game.physics.enable(saraceni, Phaser.Physics.ARCADE);
		saraceni.setAll('body.outOfBoundsKill', false);
		//saraceni.setAll('body.collideWorldBounds', true);

		return saraceni;
	}

	function movimentoSaraceno(x1, x2, saraceno){
		

		if(saraceno.x <= x1 ){
			saraceno.body.velocity.x = 100;
			
			//saraceno.scale.setTo(scala, scala);
			saraceno.animations.play('corsaR');
			
		}

		if(saraceno.x >= x2 ){
			saraceno.body.velocity.x = -100;
			//saraceno.scale.setTo(-scala, scala);
			saraceno.animations.play('corsaL');
			
		}
	}

	function setLupi(){
		lupi = game.add.physicsGroup();
		var lupo1 = lupi.create(1110,520,'lupo'); 
		var lupo2 = lupi.create(1470,320,'lupo');
		var lupo3 = lupi.create(5900,500,'lupo');
		
		
		lupo1.scale.setTo(-scala,scala);
		lupo2.scale.setTo(-scala,scala);
		lupo3.scale.setTo(-scala,scala);
		lupo1.animations.add('corsa',[1,2,3,4,5,6,7,8],12,true);
		lupo2.animations.add('corsa',[1,2,3,4,5,6,7,8],12,true);
		lupo3.animations.add('corsa',[1,2,3,4,5,6,7,8],12,true);


		game.physics.enable(lupi, Phaser.Physics.ARCADE);
		//lupi.setAll('body.collideWorldBounds', true);
		lupi.setAll('body.gravity.y',grav);
		lupi.setAll('smoothed', false);
		lupi.setAll('anchor.setTo',0.5,1);
		
		
		return lupi;
	}

	function movimentoLupi(lupo, range){
		lupo.body.velocity.x = 0;
		var d;
		d = lupo.x - player.x - (range*3.5);
		if(d <= -range ){
			lupo.body.velocity.x = -100;
			lupo.animations.play('corsa');
		}
	}


	function setArcieri(){
		arcieri = game.add.physicsGroup();
		var arciere1 = arcieri.create(3640,100,'arciere');
		var arciere2 = arcieri.create(5640,100,'arciere');
		var arciere3 = arcieri.create(7240,100,'arciere');

		for(var i = 0; i<3;i++){
		arcieri.getChildAt(i).scale.setTo(-scala,scala);
		arcieri.getChildAt(i).anchor.setTo(0.5,1);
		arcieri.getChildAt(i).animations.add('shoot',[0,1,2,3,4,5],3,false);
		}

		arcieri.setAll('smoothed',false);
		game.physics.enable(arcieri, Phaser.Physics.ARCADE);
		arcieri.setAll('body.gravity.y', grav);
		//arcieri.setAll('body.collideWorldBounds',true);
		return arcieri;
	}

	function setArco(){
		arco = game.add.weapon(nFrecce, 'freccia');
		arco.bulletLifespan = 5000;
		arco.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
		arco.fireRate = dFrecce;
		arco.bulletSpeed = sFrecce;
		arco.bulletGravity.y = grav;
		arco.bulletRotateToVelocity = true;

		arco2 = game.add.weapon(nFrecce, 'freccia');
		arco2.bulletLifespan = 5000;
		arco2.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
		arco2.fireRate = dFrecce;
		arco2.bulletSpeed = sFrecce;
		arco2.bulletGravity.y = grav;
		arco2.bulletRotateToVelocity = true;

		arco3 = game.add.weapon(nFrecce, 'freccia');
		arco3.bulletLifespan = 5000;
		arco3.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
		arco3.fireRate = dFrecce;
		arco3.bulletSpeed = sFrecce;
		arco3.bulletGravity.y = grav;
		arco3.bulletRotateToVelocity = true;

		return arco;
	}

	function arciereSpara(arciere,arco,fireAngle) {
		
		if(arciere.alive){
		
		arciere.animations.play('shoot');
		arco.trackSprite(arciere,-25,-50,false);
		arco.fireAngle = fireAngle;
		arco.fire();		
		}
	}

	function setMeteore() {
		meteore = game.add.physicsGroup();

		var meteora1 = meteore.create(12000,0,'meteora'); 
		var meteora2 = meteore.create(13000,0,'meteora');
		var meteora3 = meteore.create(14000,0,'meteora');
		var meteora4 = meteore.create(15000,0,'meteora');
		var meteora5 = meteore.create(15000,0,'meteora');
		

		for(var i = 0; i<5;i++){
			meteore.getChildAt(i).scale.setTo(3);
			meteore.getChildAt(i).anchor.setTo(0,0);
			meteore.getChildAt(i).animations.add('burn',[0,1,2],6, true);
		}

		meteore.setAll('smoothed', false);
		meteora1.body.setCircle(11);
		meteora2.body.setCircle(11);
		meteora3.body.setCircle(11);
		meteora4.body.setCircle(11);
		meteora5.body.setCircle(11);


		game.physics.enable(meteore, Phaser.Physics.ARCADE);

		return meteore;
	}
	function fallMeteora(meteora,xGrav,yGrav, range){
		var d;
		
		d = meteora.x - player.x - (range*3.5);
		if(d <= -range ){
			meteora.body.gravity.y = yGrav;
			meteora.body.gravity.x = xGrav;
			meteora.animations.play('burn');
		}
	}

	function setAnime(){
		anime = game.add.physicsGroup();


		
		var anima1 = anime.create(11300,680,'anima'); 
		var anima2 = anime.create(13090,464,'anima');
		var anima3 = anime.create(14090,360,'anima');
		var anima4 = anime.create(14820,680,'anima');

		

		for(var i = 0; i<4;i++){
			anime.getChildAt(i).scale.setTo(scala);
			anime.getChildAt(i).anchor.setTo(0.5,1);
			anime.getChildAt(i).animations.add('idle',[0,1,2,3,4,5],12, true);
			anime.getChildAt(i).animations.play('idle');
		}

		//anime.setAll('body.gravity.y',0);
		anime.setAll('smoothed', false);

		game.physics.enable(anime, Phaser.Physics.ARCADE);

		anime.setAll('body.gravity.y', 200);
		anime.setAll('body.outOfBoundsKill', false);
		//anime.setAll('body.collideWorldBounds', true);

		return anime;
	}

	
	
	function setBoss(){
		boss = game.add.sprite(16200, 600, 'boss');
		boss.scale.setTo(-5,5);
		boss.anchor.setTo(0.5,1);
		boss.smoothed = false;
		boss.animations.add('atk',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],6,true);


		game.physics.enable(boss, Phaser.Physics.ARCADE);
		boss.body.gravity.y = grav;

		
		return boss;
	}
	function setSpada(){
		spada = game.add.weapon(nS, 'spada');
		spada.bulletLifespan = 5000;
		spada.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
		spada.fireRate = dS;
		spada.bulletSpeed = sS;
		spada.bulletRotateToVelocity = true;
		spada.addBulletAnimation('fire',[0,1,2],6,true);

		

		return spada;
	}

	function bossSwing(range){
		boss.animations.play('atk');
		var d;
		d = boss.x - player.x - (range*3.5);

		if(boss.alive && d <= range){
		//boss.animations.play('atk');
		spada.trackSprite(boss,-50,-100,false);
		spada.fireAngle = 180;
		spada.fireAtXY(player.x,player.y-50);
		spada.fire();		
		}

	}

	function setScudi(){

		scudi = game.add.physicsGroup();
		var scudo1 = scudi.create(580,430,'scudo');
		var scudo2 = scudi.create(2550,320,'scudo');
		var scudo3 = scudi.create(4300,550,'scudo');
		var scudo4 = scudi.create(9000,550,'scudo');
		var scudo5 = scudi.create(13590,120,'scudo');
		var scudo6 = scudi.create(14640,360,'scudo');
		scudo1.animations.add('mov', [0,1,2,3,4],6,true);
		scudo2.animations.add('mov', [0,1,2,3,4],6,true);
		scudo3.animations.add('mov', [0,1,2,3,4],6,true);

		for(var i = 0; i<6 ; i++)
		scudi.getChildAt(i).anchor.setTo(0.5,0.5);

		return scudi;
	}

	function pickUpScudi(player, scudo){
		if(hp<3){
			hp++;
			scudo.kill();

			if(hp>1){
				hpviz.getChildAt(1).tint = 0xFFFFFF;
			}
			if(hp>2){
				hpviz.getChildAt(2).tint = 0xFFFFFF;
			}
		}

		
	}

	function setCollezionabili(){

		collezionabili = game.add.physicsGroup();
		var pergamena1 = collezionabili.create(2020,120,'pergamena');
		var pergamena2 = collezionabili.create(3136,385,'pergamena');
		var pergamena3 = collezionabili.create(6070,120,'pergamena');
		var pergamena4 = collezionabili.create(10777,120,'pergamena');
		var pergamena5 = collezionabili.create(12405,620,'pergamena');

		for(var i=0; i<5;i++){
		collezionabili.getChildAt(i).animations.add('mov', [0,1,2,3],6,true);
		collezionabili.getChildAt(i).scale.setTo(1.5);
		collezionabili.getChildAt(i).smoothed = false;
		collezionabili.getChildAt(i).anchor.setTo(0.5,0.5);
		}

		return collezionabili;
	}

	function pickUpColl(player, coll){
				
			if(collPresi<nCollezionabili){
				pergGroup.getChildAt(collPresi).tint = 0xFFFFFF;
				coll.kill();
				collPresi++;
					if(collPresi == 1){
						game.time.events.add(10,showText,this);
						game.time.events.add(2000,hideText,this);}
					if(collPresi == 2){
						game.time.events.add(10,showText,this);
						game.time.events.add(2000,hideText,this);}
					if(collPresi == 3){
						game.time.events.add(10,showText,this);
						game.time.events.add(2000,hideText,this);}
					if(collPresi == 4){
						game.time.events.add(10,showText,this);
						game.time.events.add(2000,hideText,this);}
				}
			if(collPresi == nCollezionabili){
					game.time.events.add(10,showText,this);
					game.time.events.add(2000,hideText,this);
				isGoodEnding = true;
			}
		}
	function showText(){
		//fraseLove.text = text;
		//game.add.tween(fraseLove).to({alpha:1},500, Phaser.Easing.Linear.None, true, 0, 0, false);

		if(collPresi == 1)
		game.add.tween(frase1).to({alpha:1},500,Phaser.Easing.Linear.None,true,0,0,false);
		if(collPresi == 2)
		game.add.tween(frase2).to({alpha:1},500,Phaser.Easing.Linear.None,true,0,0,false);
		if(collPresi == 3)
		game.add.tween(frase3).to({alpha:1},500,Phaser.Easing.Linear.None,true,0,0,false);
		if(collPresi == 4)
		game.add.tween(frase4).to({alpha:1},500,Phaser.Easing.Linear.None,true,0,0,false);
		if(collPresi == 5)
		game.add.tween(frase5).to({alpha:1},500,Phaser.Easing.Linear.None,true,0,0,false);
	}
	function hideText(){
		//game.add.tween(fraseLove).to({alpha:0},500, Phaser.Easing.Linear.None, true, 0, 0, false);
		if(collPresi == 1){
		game.add.tween(frase1).to({alpha:0},500, Phaser.Easing.Linear.None, true, 0, 0, false);
		}
		if(collPresi == 2){
		game.add.tween(frase2).to({alpha:0},500, Phaser.Easing.Linear.None, true, 0, 0, false)
		}
		if(collPresi == 3){
		game.add.tween(frase3).to({alpha:0},500, Phaser.Easing.Linear.None, true, 0, 0, false);
		}
		if(collPresi == 4){
		game.add.tween(frase4).to({alpha:0},500, Phaser.Easing.Linear.None, true, 0, 0, false);
		}
		if(collPresi == 5){
		game.add.tween(frase5).to({alpha:0},500, Phaser.Easing.Linear.None, true, 0, 0, false);
		}
	}



	function setHUD(){
		hud = game.add.physicsGroup();
		
		hpviz = game.add.physicsGroup(); 
		
		var hpviz1 = hpviz.create(50,50, 'scudo');
		var hpviz2 = hpviz.create(110,50, 'scudo');
		var hpviz3 = hpviz.create(170,50, 'scudo');

		for(var j =0; j<maxHP; j++){
			hpviz.getChildAt(j).anchor.setTo(0.5,0.5);
			hpviz.getChildAt(j).scale.setTo(2);
			hpviz.getChildAt(j).smoothed = false;
			hpviz.getChildAt(j).tint = 0x808080 ;
		}
		hpviz1.tint = 0xFFFFFF;

		pergGroup = game.add.physicsGroup();
		
		var pergviz1 = pergGroup.create(940,50,'pergamena');
		var pergviz2 = pergGroup.create(880,50,'pergamena');
		var pergviz3 = pergGroup.create(820,50,'pergamena');
		var pergviz4 = pergGroup.create(760,50,'pergamena');
		var pergviz5 = pergGroup.create(700,50,'pergamena');

		for(var i =0; i<nCollezionabili; i++){
			pergGroup.getChildAt(i).anchor.setTo(0.5,0.5);
			pergGroup.getChildAt(i).scale.setTo(3);
			pergGroup.getChildAt(i).smoothed = false;
			pergGroup.getChildAt(i).tint = 0x808080 ;

		}
/* FEATURE ELIMINATA
		tutorialmov = hud.create(playerSpawnPoint[0],playerSpawnPoint[1],'tutorialmov');
		tutorialmov.animations.add('flash', [0,1,2,3,4],6,true);
		tutorialmov.animations.play('flash');
		tutorialmov.scale.setTo(2);
		tutorialmov.smoothed = false;
		game.time.events.add(Phaser.Timer.SECOND * 5, function killTutorial(){tutorialmov.kill();},this);
*/		

		fraseLove = game.add.text(512,700,"placeholder",{
				font: "30px Helvetica",
				fill: "#F1F1f1",
				align: "center",
				backgroundColor: "rgba(10,10,10,0.4)"});
		fraseLove.anchor.setTo(0.5,1);
		fraseLove.alpha = 0;

		hud.add(pergGroup);
		hud.add(hpviz);
		hud.add(fraseLove);
		hud.fixedToCamera = true;
		hud.cameraOffset.setTo(10,10);

			

		
	}


	function setIppogrifo(){
		ippogrifo = game.add.sprite(7860, 100, 'ippogrifo');
		ippogrifo.scale.setTo(scala);
		ippogrifo.smoothed = false;
		game.physics.enable(ippogrifo);
		ippogrifo.body.gravity.y = grav;
		ippogrifo.anchor.setTo(0.5,1);

		return ippogrifo;
	}

	//CAMBIO LIVELLO CON FADE OUT
	function tpmask(player, ippogrifo){
		fadein();
		game.time.events.add(Phaser.Timer.SECOND*1, tp, this);
	}
	function tp(){
		player.x = 1024*10+100;
		player.y = 650;
		game.time.events.add(Phaser.Timer.SECOND*1, fadeout, this,1000);
	}
	
	function fadein(){
		game.add.tween(maschera).to({alpha:1},200, Phaser.Easing.Linear.None, true, 0, 0, false);
	}
	function fadeout(ftime){
		game.add.tween(maschera).to({alpha:0},ftime, Phaser.Easing.Linear.None, true, 0, 0, false);
	}



	function setCheckpoint(){
		checkpoint = game.add.physicsGroup();
		
		//Primo Checkpoint Foresta
		var cp1 = game.add.sprite(1617,650,'checkpoint');

		checkpoint.add(cp1);
		checkpoint.getChildAt(0).scale.setTo(3);
		checkpoint.getChildAt(0).smoothed = false;
		checkpoint.getChildAt(0).anchor.setTo(0.5,1);
		checkpoint.getChildAt(0).animations.add('idle',[0,1,2,3],6,true);
		checkpoint.getChildAt(0).animations.add('check',[4,5,6,7],6,false);
		checkpoint.getChildAt(0).animations.add('wind',[8,9,10,11,12,13,14],6,true);

		//Secondo Checkpoint Foresta 
		var cp2 = game.add.sprite(4050,650,'checkpoint');

		checkpoint.add(cp2);
		checkpoint.getChildAt(1).scale.setTo(3);
		checkpoint.getChildAt(1).smoothed = false;
		checkpoint.getChildAt(1).anchor.setTo(0.5,1);
		checkpoint.getChildAt(1).animations.add('idle',[0,1,2,3],6,true);
		checkpoint.getChildAt(1).animations.add('check',[4,5,6,7],6,false);
		checkpoint.getChildAt(1).animations.add('wind',[8,9,10,11,12,13,14],6,true);

		//Primo Checkpoint Luna 
		var cp3 = game.add.sprite(10320,650,'checkpoint');

		checkpoint.add(cp3);
		checkpoint.getChildAt(2).scale.setTo(3);
		checkpoint.getChildAt(2).smoothed = false;
		checkpoint.getChildAt(2).anchor.setTo(0.5,1);
		checkpoint.getChildAt(2).animations.add('idle',[0,1,2,3],6,true);
		checkpoint.getChildAt(2).animations.add('check',[4,5,6,7],6,false);
		checkpoint.getChildAt(2).animations.add('wind',[8,9,10,11,12,13,14],6,true);

		//Secondo Checpoint Luna
		var cp4 = game.add.sprite(12800,460,'checkpoint');

		checkpoint.add(cp4);
		checkpoint.getChildAt(3).scale.setTo(3);
		checkpoint.getChildAt(3).smoothed = false;
		checkpoint.getChildAt(3).anchor.setTo(0.5,1);
		checkpoint.getChildAt(3).animations.add('idle',[0,1,2,3],6,true);
		checkpoint.getChildAt(3).animations.add('check',[4,5,6,7],6,false);
		checkpoint.getChildAt(3).animations.add('wind',[8,9,10,11,12,13,14],6,true);

		


		game.physics.enable(checkpoint);
		checkpoint.setAll('body.gravity.y', grav);
	
		return checkpoint;
	}

	function activateCp(player,cp){
		if(playerSpawnPoint[0]	!= cp.x){
			game.time.events.add(200,check,this, cp);
		
			playerSpawnPoint[0] = cp.x;
			playerSpawnPoint[1] = cp.y;
		}
	}
	function check(cp){
		cp.animations.play('check');
		game.time.events.add(400,wind,this,cp);
	}
	function wind(cp){
		cp.animations.play('wind');
	}

	function uncheck(cp){
		cp.animations.play('idle');
	}


	function setgWell(){
		pozzo1 = game.add.sprite(11570, 0, 'buco1');
		pozzo1.animations.add('g',[0,1,2,3,4,5,6,7,8,9],8,true);
		pozzo2 = game.add.sprite(12260,0,'buco2');
		pozzo2.animations.add('g',[0,1,2,3,4,5,6,7,8,9],8,true);
	}
	function gravityWell(x1,x2, g){
		pozzo1.play('g');
		pozzo2.play('g');
		if(player.x > x1 && player.x < x2){
			player.body.gravity.y = g;
		}
		else{
			player.body.gravity.y  = grav;
		}
	}

	function render(){
		/*
		game.debug.body(player,'rgba(0,0,255,0.3)');
		game.debug.physicsGroup(saraceni,'rgba(255,0,0,0.3)');
		game.debug.physicsGroup(lupi,'rgba(255,0,0,0.3)');
		game.debug.physicsGroup(arcieri,'rgba(255,0,0,0.3)');
		game.debug.physicsGroup(hitboxes,'rgba(0,170,255,0.3)');
		game.debug.physicsGroup(scudi,'rgba(100,0,255,0.3)');
		game.debug.physicsGroup(meteore,'rgba(255,0,0,0.3)');
		game.debug.physicsGroup(anime,'rgba(255,0,0,0.3)');
		game.debug.physicsGroup(collezionabili,'rgba(255,255,0,0.3)');*/
		
		

		game.debug.text("x:" + player.x, 400,15);
		game.debug.text("y:" + player.y, 400,30);
		game.debug.text("hp: "+ hp,10,15);
		game.debug.text("pergamene: "+ collPresi,60,15);
		game.debug.text("Tutorial timer off in: " + game.time.events.duration, 10,30);
		game.debug.text("Good Ending: " + isGoodEnding , 10,45);
	} 