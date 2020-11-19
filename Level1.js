var gioco = new Phaser.Game(1024,768, Phaser.AUTO,'ORLANDOFURIOSO',{preload: preload, create: create, update: update, render: render });





	function preload(){
		//carica lo sfondo
		gioco.load.image('sfondo1', 'assets/sfondo1p.png'); 
		gioco.load.image('sfondo2', 'assets/sfondo2p.png'); 
		gioco.load.image('sfondo3', 'assets/sfondo3p.png'); 




		
		gioco.load.spritesheet('astolfo', 'assets/astolfo_spritesheet.png',21,40,14); //carica lo sprite di astolfo
		gioco.load.spritesheet('astolfoatk1', 'assets/astolfo_atk_laterale.png',21,40,18);
		gioco.load.spritesheet('saraceno', 'assets/saraceno_spritesheet.png',21,35,17);
		gioco.load.spritesheet('lupo', 'assets/wolf_running.png',45,25);
		gioco.load.spritesheet('scudo', 'assets/scudo_anim.png',25,35,5);
		//tilemap loading
		gioco.load.tilemap('map', 'assets/newmap.json', null, Phaser.Tilemap.TILED_JSON);
		gioco.load.image('tiles', 'assets/tileset.png');
	}
//hitboxes del giocatore
var player;
var hitboxes; 
var hitbox1;
var hitbox2;
var hitbox3;
var hitbox4;
//posizione dell'hitbox della lancia
var spearAtkPosX; 
var spearAtkPosY;
var spearSizeX;
var spearSizeY;

//Gruppo di nemici 1
var saraceni;

//Gruppo di nemici 2
var lupi;

var scudi;
var hp = 1;
var hptext;

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

		
		
		
		setPlayer();
		setLupi();
		setSaraceni();
		setScudi();
		
		hptext = gioco.add.text(100,100,'HP = '+hp);
		
	}

	function update(){
		gioco.physics.arcade.collide(player,groundlayer);
		gioco.physics.arcade.collide(saraceni,groundlayer);
		gioco.physics.arcade.collide(lupi,groundlayer);
		gioco.physics.arcade.overlap(player,saraceni,hitAndRespawn);
		gioco.physics.arcade.overlap(player,lupi,hitAndRespawn);
		gioco.physics.arcade.overlap(player,scudi,pickUpScudi);

		hitbox1.body.setSize(spearSizeX,spearSizeY,spearAtkPosX,spearAtkPosY);

		//EFFETTO PARALLASSE
		if(player.body.position.x > 1024){
		sfondo1.tilePosition.x = player.x * 0.1;
		sfondo2.tilePosition.x = player.x * -0.3;
		}
		playermovement();
		
		
		playerAtkDirection();
		
		
		movimentoSaraceno(200,300,saraceni.getChildAt(0));
		movimentoSaraceno(600,800,saraceni.getChildAt(1));
		movimentoSaraceno(1000,1200,saraceni.getChildAt(2));


		scudi.getChildAt(0).animations.play('mov');
		
		/*var firstAttackTimer;
		firstAttackTimer = gioco.time.create(false);
		firstAttackTimer.add(3000,playerAtkDirection(), this);
		firstAttackTimer.start();
		*/
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
			player.body.velocity.y = -100;
			enemy.kill();
	}

	function hitAndRespawn(player, enemy){
			if(hp>1){
			hp--;
			hptext.destroy();
			hptext = gioco.add.text(100,100,"HP = "+ hp);
			player.x = 200;
			player.y = 500;
			}
			else 
			player.x = 100;
			player.y = 100;
	}

	function setPlayer(){

		player = gioco.add.sprite(playerSpawnPoint[0], playerSpawnPoint[1], 'astolfo'); //posiziona astolfo
		player.animations.add('idle',[0,1,2,3,4,5], 6, true);
		player.animations.add('corsa',[6,7,8,9,10,11,12,13], 12, true);
		player.anchor.setTo(0.5,1); //sposta l'anchor point del personaggio al centro dello sprite
		player.scale.setTo(scala, scala); //scalo (valori positivi) o flippo (valori negativi) lo sprite
 		player.smoothed = false; //toglie l'antialiasing e fa tornare i pixel visibili (LESGOOO)
 
		
 		gioco.physics.enable(player);
		player.body.collideWorldBounds = true; //il giocatore collide con i bordi del mondo
 		player.body.gravity.y = 600; //gravità che viene applicata sul giocatore
 		
 		hitboxes = gioco.add.physicsGroup();
 		hitbox1 = hitboxes.create(0,0,null);
 		player.addChild(hitboxes);
 		hitbox1.name = "spear";



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

			/*BUG IMPORTANTE
			Appena starta si refresha la pagina se clicco un qualsiasi tasto d'attacco alcuni nemici che non sono visibili 
			muoiono fuori dalla collisione senza motivo
			*/
		

		if(gioco.input.keyboard.isDown(Phaser.Keyboard.LEFT) && gioco.time.now > atkTimer){
			if(facing !== "left")
					facing = "left";

			spearAtkPosX = -50;
			spearAtkPosY = -80;
			spearSizeX = 30;
			spearSizeY = 80;
			atkTimer = gioco.time.now + 200;
			gioco.physics.arcade.overlap(hitboxes,saraceni,spearLeftCollision);
			gioco.physics.arcade.overlap(hitboxes,lupi,spearLeftCollision);
		}
		if(gioco.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && gioco.time.now > atkTimer){
			if(facing !== "right")
					facing = "right";

			spearAtkPosX =	20;
			spearAtkPosY = -80;
			spearSizeX = 30;
			spearSizeY = 80;
			atkTimer = gioco.time.now + 200;
			gioco.physics.arcade.overlap(hitboxes,saraceni,spearRightCollision);
			gioco.physics.arcade.overlap(hitboxes,lupi,spearRightCollision);
		}
		if(gioco.input.keyboard.isDown(Phaser.Keyboard.UP) && gioco.time.now > atkTimer){
			spearAtkPosX = -30 ;
			spearAtkPosY = -110;
			spearSizeX = 60;
			spearSizeY = 30;
			atkTimer = gioco.time.now + 200;
			gioco.physics.arcade.overlap(hitboxes,saraceni,spearUpCollision);
			gioco.physics.arcade.overlap(hitboxes,lupi,spearUpCollision);
		}
		if(gioco.input.keyboard.isDown(Phaser.Keyboard.DOWN) && player.body.onFloor() == false && gioco.time.now > atkTimer){
			spearAtkPosX = -30;
			spearAtkPosY = 0;
			spearSizeX = 60;
			spearSizeY = 30;
			atkTimer = gioco.time.now + 200;
			gioco.physics.arcade.overlap(hitboxes,saraceni,spearDownCollision);
			gioco.physics.arcade.overlap(hitboxes,lupi,spearDownCollision);
			
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
		var lupo1 = lupi.create(1300,600,'lupo'); 
		var lupo2 = lupi.create(2000,500,'lupo');
		
		lupi.setAll('smoothed', false);
		lupo1.scale.setTo(scala);
		lupo2.scale.setTo(scala);

		gioco.physics.enable(lupi, Phaser.Physics.ARCADE);
		lupi.setAll('body.collideWorldBounds', true);
		lupi.setAll('body.gravity.y',500);

		
		
		return lupi;
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
			hptext.destroy();
			hptext = gioco.add.text(100,100,'HP = '+hp);
		}
	}




	function render(){
		gioco.debug.body(player);
		gioco.debug.physicsGroup(saraceni);
		gioco.debug.physicsGroup(lupi);
		gioco.debug.physicsGroup(hitboxes);
		gioco.debug.physicsGroup(scudi);
	} 
//gioco.state.add('Level1',Level1.js);
//gioco.state.start('Level1');
