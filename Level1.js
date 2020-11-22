var gioco = new Phaser.Game(1024,768, Phaser.AUTO,'ORLANDOFURIOSO',{preload: preload, create: create, update: update, render: render });





	function preload(){
		//carica lo sfondo
		gioco.load.image('sfondo1', 'assets/sfondo1p.png'); 
		gioco.load.image('sfondo2', 'assets/sfondo2p.png'); 
		gioco.load.image('sfondo3', 'assets/sfondo3p.png'); 




		
		gioco.load.spritesheet('astolfo', 'assets/astolfo_spritesheet.png',21,40,32); //carica lo sprite di astolfo

		gioco.load.spritesheet('saraceno', 'assets/saraceno_spritesheet.png',21,35,17);
		gioco.load.spritesheet('lupo', 'assets/wolf_running.png',45,25,9);
		gioco.load.spritesheet('scudo', 'assets/scudo_anim.png',25,35,5);
		gioco.load.spritesheet('tutorialmov','assets/uparrow.png',27,28,5);
		//tilemap loading
		gioco.load.tilemap('map', 'assets/newmap.json', null, Phaser.Tilemap.TILED_JSON);
		gioco.load.image('tiles', 'assets/tileset.png');
	}
//hitboxes del giocatore
var player;
var hitboxes; 
var hitbox1; //hitbox attacco destro
var hitbox2; //hitbox attacco sinistro
var hitbox3; //hitbox attacco su
var hitbox4; //hitbox attacco giù

//Gruppo di nemici 1
var saraceni;

//Gruppo di nemici 2
var lupi;

var hud;
var hpviz;
var hpviz2;
var hpviz3;
var tutorialmov;
var scudi;
var hp = 1;

var scala = 2; //scala di tutti gli sprite di gioco
var facing = "left"; //direzione in cui va il personaggio
var movOrizzontale = 160; //movimento orizzontale
var movVerticale = -380; //movimento verticale (salto o caduta rapida)
var jumpTimer = 0; 
var atkTimer = 0;
let playerSpawnPoint = [100,500]; //x e y del punto di spawn del player

//variabili di sfondo e mappa
var sfondo1;
var sfondo2;
var sfondo3;
var map;
var groundlayer;

	function create(){

		 //mette lo sfondo 
		sfondo3 = gioco.add.tileSprite(0,0,1024*10,768,'sfondo3');
		sfondo2 = gioco.add.tileSprite(0,0,1024*10,768,'sfondo2');
		sfondo1 = gioco.add.tileSprite(0,0,1024*10,768,'sfondo1');


		 //game physics
		gioco.physics.startSystem(Phaser.Physics.ARCADE);
		
		map = gioco.add.tilemap('map');
		map.addTilesetImage("tileset",'tiles');
		map.setCollisionBetween(1,1000,true,'piattaforme');

		groundlayer = map.createLayer('piattaforme');
		map.createLayer('bg');
		groundlayer.resizeWorld(); 

		
		
		setHUD();
		setPlayer();
		setLupi();
		setSaraceni();
		setScudi();
		
		
	}

	function update(){
		gioco.physics.arcade.collide(player,groundlayer);
		gioco.physics.arcade.collide(saraceni,groundlayer);
		gioco.physics.arcade.collide(lupi,groundlayer);
		gioco.physics.arcade.overlap(player,saraceni,hitAndRespawn);
		gioco.physics.arcade.overlap(player,lupi,hitAndRespawn);
		gioco.physics.arcade.overlap(player,scudi,pickUpScudi);

		

		//EFFETTO PARALLASSE
		sfondo1.tilePosition.x = player.x * -0.1;
		sfondo2.tilePosition.x = player.x * -0.3;
		
	
		
		


		playermovement();
		playerAtkDirection();
		
		
		movimentoSaraceno(200,300,saraceni.getChildAt(0));
		movimentoSaraceno(600,800,saraceni.getChildAt(1));
		movimentoSaraceno(1000,1200,saraceni.getChildAt(2));

		movimentoLupi(lupi.getChildAt(0));
		movimentoLupi(lupi.getChildAt(1));

		scudi.getChildAt(0).animations.play('mov');
		

	}



	function spearUpCollision(hitboxes, enemy){
			enemy.kill();
	}
	function spearLeftCollision(hitboxes, enemy){
			enemy.kill();
	}
	function spearRightCollision(hitboxes, enemy){
			enemy.kill();
	}
	function spearDownCollision(hitboxes, enemy){
			player.body.velocity.y = -300;
			enemy.kill();
	}

	function hitAndRespawn(player, enemy){
			if(hp==3){
				hp--;
				hpviz3.tint = 0x808080;
			}
			if(hp==2){
				hp--;
				hpviz2.tint = 0x808080;
			}
			if(hp==1){
				player.x = 100;
				player.y = 100;
			}

			
			
		}

	function setPlayer(){

		player = gioco.add.sprite(playerSpawnPoint[0], playerSpawnPoint[1], 'astolfo'); //posiziona astolfo
		player.animations.add('idle',[0,1,2,3,4,5], 6, true);
		player.animations.add('corsa',[6,7,8,9,10,11,12,13], 12, true);
		player.animations.add('atkLateral',[14,15,16,17,18,19], 6, true);

		player.anchor.setTo(0.5,1); //sposta l'anchor point del personaggio al centro dello sprite
		player.scale.setTo(scala, scala); //scalo (valori positivi) o flippo (valori negativi) lo sprite
 		player.smoothed = false; //toglie l'antialiasing e fa tornare i pixel visibili (LESGOOO)
 
		
 		gioco.physics.enable(player);
		player.body.collideWorldBounds = true; //il giocatore collide con i bordi del mondo
 		player.body.gravity.y = 600; //gravità che viene applicata sul giocatore
 		
 		hitboxes = gioco.add.physicsGroup();

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


 		
 		
 		
 		
 		



 		 gioco.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

 		 return player;
	}


	//FUNZIONE MOVIMENTI
	function playermovement(){
		player.body.velocity.x = 0; //resetta la velocità orizzontale

		if(gioco.input.keyboard.isDown(Phaser.Keyboard.A))
			{
				player.body.velocity.x = -movOrizzontale;
				if(facing !== "left")
					facing = "left";
				player.animations.play("corsa");
			}
		else if(gioco.input.keyboard.isDown(Phaser.Keyboard.D))
			{
				player.body.velocity.x = movOrizzontale;
				if(facing !== "right")
					facing = "right";
				player.animations.play("corsa");
			}
		else{
			player.animations.play("idle");
		}

				if(gioco.input.keyboard.isDown(Phaser.Keyboard.W) && player.body.onFloor() && gioco.time.now > jumpTimer)
			{
				player.body.velocity.y = movVerticale;
				jumpTimer = gioco.time.now + 650;
				player.animations.play("corsa");
			}

			if(gioco.input.keyboard.isDown(Phaser.Keyboard.S) && player.body.onFloor() == false)
			{
				player.body.velocity.y = -movVerticale;
				player.animations.play("idle");
			}


			//PERMETTE IL FLIP DELLE SPRITESHEET
			if(facing === "left")
			player.scale.setTo(-scala, scala);	
			if(facing === "right")
			player.scale.setTo(scala,scala);
	}

	//FUNZIONE DI ATTACCO MULTIDIREZIONALE
	function playerAtkDirection(){

		

		if(gioco.input.keyboard.isDown(Phaser.Keyboard.LEFT) && gioco.time.now > atkTimer){
			if(facing !== "left")
					facing = "left";
			atkTimer = gioco.time.now + 500;
			player.animations.play("atkLateral");
			gioco.physics.arcade.overlap(hitbox2,saraceni,spearLeftCollision);
			gioco.physics.arcade.overlap(hitbox2,lupi,spearLeftCollision);
		}
		if(gioco.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && gioco.time.now > atkTimer){
			if(facing !== "right")
					facing = "right";
			atkTimer = gioco.time.now + 500;
			player.animations.play("atkLateral");
			gioco.physics.arcade.overlap(hitbox1,saraceni,spearRightCollision);
			gioco.physics.arcade.overlap(hitbox1,lupi,spearRightCollision);
		}
		if(gioco.input.keyboard.isDown(Phaser.Keyboard.UP) && gioco.time.now > atkTimer){
			atkTimer = gioco.time.now + 500;
			gioco.physics.arcade.overlap(hitbox3,saraceni,spearUpCollision);
			gioco.physics.arcade.overlap(hitbox3,lupi,spearUpCollision);
		}
		if(gioco.input.keyboard.isDown(Phaser.Keyboard.DOWN) && player.body.onFloor() == false && gioco.time.now > atkTimer){
			atkTimer = gioco.time.now + 500;
			gioco.physics.arcade.overlap(hitbox4,saraceni,spearDownCollision);
			gioco.physics.arcade.overlap(hitbox4,lupi,spearDownCollision);
			
		}

	}
	function setSaraceni(){
		saraceni = gioco.add.physicsGroup();


		
		var saraceno1 = saraceni.create(300,200,'saraceno',); 
		var saraceno2 = saraceni.create(800,200,'saraceno',);
		var saraceno3 = saraceni.create(1200,200,'saraceno',);
		saraceni.setAll('body.gravity.y',500);
		saraceni.setAll('smoothed', false);
		saraceno1.scale.setTo(scala);
		saraceno2.scale.setTo(scala);
		saraceno3.scale.setTo(scala);
		saraceno1.animations.add('corsaR',[1,2,3,4,5,6,7,8],12, true);
		saraceno1.animations.add('corsaL',[9,10,11,12,13,14,15,16],12, true);
		saraceno2.animations.add('corsaR',[1,2,3,4,5,6,7,8],12, true);
		saraceno2.animations.add('corsaL',[9,10,11,12,13,14,15,16],12, true);
		saraceno3.animations.add('corsaR',[1,2,3,4,5,6,7,8],12, true);
		saraceno3.animations.add('corsaL',[9,10,11,12,13,14,15,16],12, true);

		gioco.physics.enable(saraceni, Phaser.Physics.ARCADE);
		saraceni.setAll('body.collideWorldBounds', true);

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
		lupi = gioco.add.physicsGroup();
		var lupo1 = lupi.create(1300,100,'lupo'); 
		var lupo2 = lupi.create(2000,100,'lupo');
		
		lupi.setAll('smoothed', false);
		lupo1.scale.setTo(-scala,scala);
		lupo2.scale.setTo(-scala,scala);
		lupo1.animations.add('corsa',[1,2,3,4,5,6,7,8],12,true);
		lupo2.animations.add('corsa',[1,2,3,4,5,6,7,8],12,true);


		gioco.physics.enable(lupi, Phaser.Physics.ARCADE);
		lupi.setAll('body.collideWorldBounds', true);
		lupi.setAll('body.gravity.y',500);

		
		
		return lupi;
	}

	function movimentoLupi(lupo){
			
		if(lupo.body.velocity.x == 0 && lupo.scale == [-scala, scala]){
			lupo.body.velocity.x = 100;
		}else
			lupo.body.velocity.x = -100;

		lupo.animations.play('corsa');
	}

	function setScudi(){

		scudi = gioco.add.physicsGroup();
		var scudo1 = scudi.create(300,300,'scudo');
		scudo1.animations.add('mov', [0,1,2,3,4],6,true);

		return scudi;
	}

	function pickUpScudi(player, scudo){
		if(hp<3){
			hp++;
			scudo.kill();

			if(hp>1){
				hpviz2.tint = 0xFFFFFF;
			}
			if(hp>2){
				hpviz3.tint = 0xFFFFFF;
			}
		}

		
	}


	function setHUD(){
		hud = gioco.add.physicsGroup();
		hpviz = hud.create(50,50, 'scudo');
		hpviz.anchor.setTo(0.5,0,5);
		hpviz.scale.setTo(2);
		hpviz.smoothed = false;
		hpviz2 = hud.create(110,50, 'scudo');
		hpviz2.anchor.setTo(0.5,0,5);
		hpviz2.scale.setTo(2);
		hpviz2.smoothed = false;
		hpviz3 = hud.create(170,50, 'scudo');
		hpviz3.anchor.setTo(0.5,0,5);
		hpviz3.scale.setTo(2);
		hpviz3.smoothed = false;
		hpviz2.tint = 0x808080;
		hpviz3.tint = 0x808080;

		tutorialmov = hud.create(playerSpawnPoint[0],playerSpawnPoint[1],'tutorialmov');
		tutorialmov.animations.add('flash', [0,1,2,3,4],6,true);
		tutorialmov.animations.play('flash');

		hud.fixedToCamera = true;
		hud.cameraOffset.setTo(10,10);

			

		
	}


	function render(){
		gioco.debug.body(player,'rgba(0,0,255,0.3)');
		gioco.debug.physicsGroup(saraceni,'rgba(255,0,0,0.3)');
		gioco.debug.physicsGroup(lupi,'rgba(255,0,0,0.3)');
		gioco.debug.physicsGroup(hitboxes,'rgba(0,170,255,0.3)');
		gioco.debug.physicsGroup(scudi,'rgba(100,0,255,0.3)');
		gioco.debug.text("hp: "+ hp,10,15);
	} 