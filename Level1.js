var game = new Phaser.Game(1024,768, Phaser.AUTO,'ORLANDOFURIOSO',{preload: preload, create: create, update: update, render: render });





	function preload(){
		//carica lo sfondo
		game.load.image('sfondo1', 'assets/sfondo1p.png'); 
		game.load.image('sfondo2', 'assets/sfondo2p.png'); 
		game.load.image('sfondo3', 'assets/sfondo3p.png'); 




		
		game.load.spritesheet('astolfo', 'assets/astolfo_spritesheet.png',21,40,29); //carica lo sprite di astolfo

		game.load.spritesheet('saraceno', 'assets/saraceno_spritesheet.png',21,35,17);
		game.load.spritesheet('lupo', 'assets/wolf_running.png',45,25,9);
		game.load.spritesheet('scudo', 'assets/scudo_anim.png',25,35,5);
		game.load.spritesheet('tutorialmov','assets/uparrow.png',27,28,5);
		game.load.spritesheet('arciere','assets/arciere_spritesheet.png',24,37,5)
		game.load.spritesheet('freccia','assets/freccia.png',30,6,1)
		game.load.spritesheet('pergamena','assets/pergamena.png',19,23,5)
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
var dFrecce = 2500; //delay di frecce

var hud;
var hpviz;
var pergGroup;
var tutorialmov;
var scudi;
var hp = 1;
var maxHP = 3;

var collezionabili;
var nCollezionabili = 5;
var collPresi = 0;
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
var map;
var groundlayer;

	function create(){

		 //mette lo sfondo 
		sfondo3 = game.add.tileSprite(0,0,1024*8,768,'sfondo3');
		sfondo2 = game.add.tileSprite(0,0,1024*8,768,'sfondo2');
		sfondo1 = game.add.tileSprite(0,0,1024*8,768,'sfondo1');


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

		
		
		setHUD();
		setPlayer();
		setLupi();
		setSaraceni();
		setArcieri();
		setArco();
		setScudi();
		setCollezionabili();

		for(var i = 0; i<collPresi; i++){
				pergGroup.getChildAt(i).tint = 0xFFFFFF;
				collezionabili.getChildAt(i).kill();
				}
	}

	function update(){

		if(player.x <7500 || player.x >1024*10){
 			game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
		}else{
			game.camera.setPosition(1024*7 - 200,400);
		}

		game.physics.arcade.collide(player,groundlayer);
		game.physics.arcade.collide(saraceni,groundlayer);
		game.physics.arcade.collide(lupi,groundlayer);
		game.physics.arcade.collide(arcieri,groundlayer);
		

		if(isInvincible == false){
		game.physics.arcade.overlap(player,saraceni,hitAndRespawn);
		game.physics.arcade.overlap(player,lupi,hitAndRespawn);
		game.physics.arcade.overlap(player,arcieri,hitAndRespawn);
		game.physics.arcade.overlap(player,arco.bullets,hitAndRespawn);
		game.physics.arcade.overlap(player,arco2.bullets,hitAndRespawn);
		game.physics.arcade.overlap(player,arco3.bullets,hitAndRespawn);
		}

		game.physics.arcade.overlap(player,scudi,pickUpScudi);
		game.physics.arcade.overlap(player,collezionabili,pickUpColl);

		if(player.y > 1000){
			oobKill(player);
			isGameOver = true;	
		}
		
		oobKill(lupi);
		

		//EFFETTO PARALLASSE
		if(player.x <7500 || player.x >1024*10){
		sfondo1.tilePosition.x = player.x * -0.1;
		sfondo2.tilePosition.x = player.x * -0.3;
		}
	
		
		


		playermovement();
		playerAtkDirection();
		
		
		movimentoSaraceno(2840,3200,saraceni.getChildAt(0));
		movimentoSaraceno(3065,3200,saraceni.getChildAt(1));
		movimentoSaraceno(4470,4610,saraceni.getChildAt(2));
		movimentoSaraceno(4980,5120,saraceni.getChildAt(3));

		
		movimentoLupi(lupi.getChildAt(0), 150);
		movimentoLupi(lupi.getChildAt(1), 150);
	


		arciereSpara(arcieri.getChildAt(0),arco,190);
		arciereSpara(arcieri.getChildAt(1),arco2,160);
		arciereSpara(arcieri.getChildAt(2),arco3,180);
		

		for(var j=0; j<3;j++)
		scudi.getChildAt(j).animations.play('mov');
		
		for(var i=0; i<5;i++)
		collezionabili.getChildAt(i).animations.play('mov');

		if(isGameOver == true){
			hp=1;
			isGameOver = false;
			game.state.restart();
		}
	}


	function oobKill(entity){
		if(entity.y > 1000){
			entity.kill();
		}
	}

	
	function spearLeftCollision(hitboxes, enemy){
		game.camera.shake(0.005,200,true,Phaser.Camera.SHAKE_HORIZONTAL,true);
			enemy.kill();
	}
	function spearRightCollision(hitboxes, enemy){
		game.camera.shake(0.005,200,true,Phaser.Camera.SHAKE_HORIZONTAL,true);
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
					hp--;
					hpviz.getChildAt(2).tint = 0x808080;
					iFrame();
					game.time.events.add(Phaser.Timer.SECOND * 1,resetiFrame,this);
					
					isGameOver = false;			
			}else if(hp==2){
				game.camera.shake(0.03,250,true,Phaser.Camera.SHAKE_HORIZONTAL,true);
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

 		hitbox3 = hitboxes.create(0,0,null);
		hitbox3.name = "spearUp";
		hitbox3.body.setSize(60,30,-30,-110);

 		hitbox4 = hitboxes.create(0,0,null);
		hitbox4.name = "spearDown";
		hitbox4.body.setSize(60,30,-30,0);


 		
 		
 		
 		
 		


		

 		 return player;
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
		else if(game.input.keyboard.isDown(Phaser.Keyboard.S) && player.body.onFloor() == false && game.time.now > atkTimer +3000 )
			{
				player.body.velocity.y = -movVerticale;
				player.animations.play("fall");
			}



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
		var lupo1 = lupi.create(1110,500,'lupo'); 
		var lupo2 = lupi.create(1470,300,'lupo');
		
		lupi.setAll('smoothed', false);
		lupo1.scale.setTo(-scala,scala);
		lupo2.scale.setTo(-scala,scala);
		lupo1.animations.add('corsa',[1,2,3,4,5,6,7,8],12,true);
		lupo2.animations.add('corsa',[1,2,3,4,5,6,7,8],12,true);


		game.physics.enable(lupi, Phaser.Physics.ARCADE);
		//lupi.setAll('body.collideWorldBounds', true);
		lupi.setAll('body.gravity.y',grav);

		
		
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
		arcieri.getChildAt(i).animations.add('shoot',[0,1,2,3,4],6,false);
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

	function setScudi(){

		scudi = game.add.physicsGroup();
		var scudo1 = scudi.create(580,430,'scudo');
		var scudo2 = scudi.create(2550,320,'scudo');
		var scudo3 = scudi.create(4300,550,'scudo');
		scudo1.animations.add('mov', [0,1,2,3,4],6,true);
		scudo2.animations.add('mov', [0,1,2,3,4],6,true);
		scudo3.animations.add('mov', [0,1,2,3,4],6,true);

		for(var i = 0; i<3 ; i++)
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
		var pergamena4 = collezionabili.create(10000,600,'pergamena');
		var pergamena5 = collezionabili.create(10000,600,'pergamena');

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
				}
			if(collPresi == nCollezionabili){
				isGoodEnding = true;
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

		hud.add(pergGroup);
		hud.add(hpviz);
		hud.fixedToCamera = true;
		hud.cameraOffset.setTo(10,10);

			

		
	}



	function render(){
		/*
		game.debug.body(player,'rgba(0,0,255,0.3)');
		game.debug.physicsGroup(saraceni,'rgba(255,0,0,0.3)');
		game.debug.physicsGroup(lupi,'rgba(255,0,0,0.3)');
		game.debug.physicsGroup(arcieri,'rgba(255,0,0,0.3)');
		game.debug.physicsGroup(hitboxes,'rgba(0,170,255,0.3)');
		game.debug.physicsGroup(scudi,'rgba(100,0,255,0.3)');
		game.debug.physicsGroup(arco,'rgba(255,0,0,0.3)');
		game.debug.physicsGroup(collezionabili,'rgba(255,255,0,0.3)');*/

		game.debug.text("x:" + player.x, 400,15);
		game.debug.text("y:" + player.y, 400,30);
		game.debug.text("hp: "+ hp,10,15);
		game.debug.text("pergamene: "+ collPresi,60,15);
		game.debug.text("Tutorial timer off in: " + game.time.events.duration, 10,30);
		game.debug.text("Good Ending: " + isGoodEnding , 10,45);
	} 