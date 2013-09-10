//-----------------------------------------------------------------------------
// Initiera alla globala variabler.
//
//-----------------------------------------------------------------------------
// canvas-m�tten
var WIDTH = 600;  
var HEIGHT = 500;
// objekt i spelet
var skepp;
var powerup; 
var skott_w = 25;
var skott_h = 5;
var skott_arr = new Array(10);
var mob_arr = new Array(1);
// om knapparna �r nedtryckta
var upDown = false;  
var downDown = false;
var rightDown = false;
var leftDown = false;
// spelarens po�ng
var poang = 0;
// beh�vs f�r att stoppa animeringen
var grafik_id = 0;  
var spel_id = 0;
// f�r att scrolla bakgrunden
var bakgrund_x = 0;
var framgrund_x = 0;

//-----------------------------------------------------------------------------
// knapp_ner(event) �r en funktion som lyssnar efter tangentknapp-tryck 
// d�r knappen trycks och h�lls nere. Detta markeras med boolean.
// w, upp = 87
// d, h�ger = 68
// a, v�nster = 65
// s, ner = 83
// enter = 13
//
// param event - den typ av event som triggat funktionen
//-----------------------------------------------------------------------------
function knapp_ner(event) {
    var keynr = event.which;
    var keychar = String.fromCharCode(keynr);
    // knappen f�r h�ger h�lls nere
    if (keynr==68) {
		rightDown = true;
    }
    // v�nster
    if (keynr==65) {
		leftDown = true;
    }
    // upp
    if (keynr==87) {
        upDown = true;
    }
    // ner
    if (keynr==83) {
        downDown = true;
    }
}

//-----------------------------------------------------------------------------
// knapp_upp(event) �r en funktion som lyssnar efter tangentknapp-tryck 
// d�r knappen sl�pps upp. Detta markeras mha boolean.
// w, upp = 87
// d, h�ger = 68
// a, v�nster = 65
// s, ner = 83
// enter = 13
//
// param event - den typ av event som triggat funktionen
//-----------------------------------------------------------------------------
function knapp_upp(event) {
    var keynr = event.which;
    var keychar = String.fromCharCode(keynr);
    // h�ger
    if (keynr==68) {
		rightDown = false;
    }
    // v�nster
    if (keynr==65) {
		leftDown = false;
    }
    // upp
    if (keynr==87) {
        upDown = false;
    }
    // ner
    if (keynr==83) {
        downDown = false;
    }
}

//-----------------------------------------------------------------------------
// knapp_tryck(event) �r en funktion som lyssnar efter tangentknapp-tryck 
// d�r knappen trycks. Lyssnar bara efter knapp 13, vilket motsvarar Enter
// och d� anropas funktionen fixa_skott().
//
// param event - den typ av event som triggat funktionen
//-----------------------------------------------------------------------------
function knapp_tryck(event) {
    var keynr = event.which;
    var keychar = String.fromCharCode(keynr);
    // Om Enter trycks ner
    if (keynr==13) {
		fixa_skott();
    }
}

//-----------------------------------------------------------------------------
// rita_rektangel() �r en funktion som ritar en rektantel. Anv�nds f�r att
// rita rymdskeppets laserskott, allts� en v�ldigt smal rektangel.
//
// param x - anger koordinat f�r rektangelns �vre v�nstra h�rn
// param y - anger koordinat f�r rektangelns �vre v�nstra h�rn
// param w - anger rektangelns bredd
// param h - anger rektangelns h�jd
//-----------------------------------------------------------------------------
function rita_rektangel(x,y,w,h) {
    ctx.beginPath();
    var random_color = get_random_color();
    ctx.fillStyle = random_color;
    ctx.rect(x,y,w,h);
    ctx.closePath();
    ctx.fill();
}

//-----------------------------------------------------------------------------
// fixa_skott() �r en funktion som hanterar rymdskeppets skott! 
// S�tter skottets (x,y) till skeppets (x,y)
// men lite justerat f�r att skottet ska hamna p� skeppets mitt.
//-----------------------------------------------------------------------------
function fixa_skott() {
     var nytt_skott = new skott(skepp.x+40, skepp.y+17);
    
    // en for-loop. r�kna igenom alla element i arrayen
    // f�r varje, 
    // kolla om den �r alive! om alive > g� vidare till n�sta
    // om !alive > skriv �ver med nytt skott!
    for(var i = 0; i < skott_arr.length; i++) {
        // h�r har vi hittat en tom plats! bara att stoppa in skottet d�r
        if (skott_arr[i] == undefined) {
            skott_arr[i] = nytt_skott;
            // och sedan avbryta for-loopen
            break;
        }
        // annars finns det ett skott, kolla d� om det �r alive
        else{
            if (!skott_arr[i].alive) {
                skott_arr[i] = nytt_skott;
                break;
            }
        }
    }
}

//-----------------------------------------------------------------------------
// mob(x, y, gfx) �r en klass som hanterar fienderna i spelet. Varje fiende
// skapas med ett (x,y) vilket motsvarar fiendens startposition, samt gfx
// som �r fiendens grafik. En bild som laddas vid spelstart.
// Har �ven bredd och h�jd f�r ber�kningar av tr�ffar, alive-boolean om
// fienden lever samt icke implementerad life-funktion. Tre tr�ffar = d�d. 
// !TODO life x 3
//-----------------------------------------------------------------------------
function mob(x, y, gfx) {
    this.x = x;
    this.y = y;
	this.gfx = gfx;
	this.hit_gfx = invsmall_hit_gfx;
	this.width = 50;
	this.height = 50;
    this.life = 3;
	this.hit = new Boolean(false);
    this.alive = new Boolean(true);
	this.boss = new Boolean(false);
	// returnerar fiendens positioni x-led
    this.getX = function() {
        return this.x;
    };
	// returnerar fiendens positioni y-led
    this.getY = function() {
        return this.y;
    };
	// returnerar fiendens grafikbild
	this.getGfx = function() {
        return this.gfx;
    };
	this.getHitGfx = function() {
        return this.hit_gfx;
    };
	// returnerar fiendens bredd
	this.getWidth = function() {
        return this.width;
    };
	// returnerar fiendens h�jd
    this.getHeight = function() {
        return this.height;
    };
	// skadar fienden och om d�d s� s�tts alive till false
    this.makeDamage = function() {
		this.life -= 1;
		if (this.life==0) {
			this.alive = false;
		}	
	};
	// returnerar om fienden �r tr�ffad
	this.isHit = function() {
		return this.hit;
	}
	// returnerar om fienden lever
	this.isAlive = function() {
		return this.alive;
	}
	// returnerar om fienden �r en boss
	this.isBoss = function() {
		return this.boss;
	}
}

//-----------------------------------------------------------------------------
// collision(obj1, obj2) �r en funktion som f�r in tv� objekt och sedan
// j�mf�r deras (x,y)-koordinater f�r att avg�ra om objekten har
// kolliderat. Returnerar true/false is�fall.
//-----------------------------------------------------------------------------
function collision(obj1, obj2) {
	// objekt ett, fyra punkter
	var x1 = obj1.getX();
	var x2 = obj1.getWidth() + x1;
	var y1 = obj1.getY();
	var y2 = obj1.getHeight() + y1;
	// objekt tv�
	var x3 = obj2.getX();
	var x4 = obj2.getWidth() + x3;
	var y3 = obj2.getY();
	var y4 = obj2.getHeight() + y3;
	// j�mf�r dem, h�r �r det frontaltr�ff .. 
	if ((x2>x3) && ((y1>y3)&&(y2<y4))) {	
		return true;
	}
	// TODO! fixa b�ttre kollissionhantering, m�ste j�mf�ra vilket objekt som 
	// �r minst. 
	else {
		return false;
	}
}

//-----------------------------------------------------------------------------
// skott(x,y) �r en klass som tar hand om skottens position.
// har som fiende-objekten (x,y)-koordinat f�r skottets position,
// samt en bredd och l�ngd. Alive om det lever.
// !TODO Kolla om Javascript kan g�ra: 
// skott extends objekt, mob extends objekt
//-----------------------------------------------------------------------------
function skott(x, y) {
    this.x = x;
    this.y = y;
	this.width = skott_w;
	this.height = skott_h;
    this.alive = new Boolean(true);
	// returnerar skottets position i x-led
    this.getX = function() {
        return this.x;
    };
	// returnerar skottets position i y-led
    this.getY = function() {
        return this.y;
    };
	// returnerar skottets bredd
	this.getWidth = function() {
        return this.width;
    };
	// returnerar skottets h�jd
    this.getHeight = function() {
        return this.height;
    };
}

//-----------------------------------------------------------------------------
// get_random_color() �r en funktion som slumpar fram tre random tal
// och returnerar rgb(xx,Xx,xx) som en textstr�ng.
//
// return color - den framslumpade f�rgen
//-----------------------------------------------------------------------------
function get_random_color() {
    var red = Math.floor(Math.random() * 255);
    var green = Math.floor(Math.random() * 255);
    var blue = Math.floor(Math.random() * 255);
    var color = 'rgb(' + red + ',' + green + ',' + blue + ')'; 
    return color;
}

//-----------------------------------------------------------------------------
// sudda() �r en funktion som ritar en stor rektangel �ver hela
// omr�det som �r canvas. Den suddar allt och f�rbereder f�r n�sta
// frame i animationen.
//-----------------------------------------------------------------------------
function sudda() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

//-----------------------------------------------------------------------------
// grafik_motor() �r en funktion som hanterar animeringen av allt. Som en tecknad
// film d�r varje ruta i animeringen sk�ts av rita(), f�rst suddas allt 
// gammalt ut, sedan ritas nya saker.. fast lite f�rskjutna.
//-----------------------------------------------------------------------------
function grafik_motor() {
    sudda();

    // rita BAKGRUND f�rst, sedan allt annat ovanp� -------------------------
    ctx.drawImage(bakgrund, bakgrund_x, 0);
    if (bakgrund_x > -3567) {
        bakgrund_x -= 1;
    }
	// parallax scrolling :)
	ctx.drawImage(framgrund, framgrund_x, 0);
    if (framgrund_x > -6500) {
		framgrund_x -= 2;
    }

    // RYMDSKEPPETS r�relser och kollisionshantering med kanterna -------------
    // om h�gerknapp nedtryckt och innanf�r h�gerkanten
    if (rightDown && (skepp.getX() < WIDTH-60)) {
		skepp.x += 5;
    }
    // om v�nsterknappen nedtryckt och inom v�nsterkanten
    else if (leftDown && (skepp.getX()  > -7)) { 
		skepp.x -= 5;
    }
    // om knapp upp�t nertryckt och inom �vre gr�nsen
    if (upDown && (skepp.getY() > 0)) {
		skepp.y -= 5;
    }
    // nedre kant
    else if (downDown && (skepp.getY()  < HEIGHT-30)) {
		skepp.y += 5;
    }
    // alla constraints klara, nu kan vi rita rymdskeppet
	ctx.drawImage(skepp.getGfx(), skepp.getX(), skepp.getY());
  
    // RITA SKOTT -------------------------------------------------------------
    for(var i = 0; i < skott_arr.length; i++) {
        // om den inte �r undefined = existerar skott d�r
        if (skott_arr[i] != undefined) {  
            if (skott_arr[i].alive) {
				// ritar skottet
                rita_rektangel(skott_arr[i].getX(), skott_arr[i].getY(), skott_arr[i].getWidth(), skott_arr[i].getHeight());
				// om det kolliderat med en fiende s� ...
				if(collision(skott_arr[i], mob_arr[0])) {
					// ritar explosion f�r skottet
					ctx.drawImage(boom, skott_arr[i].getX(), skott_arr[i].getY()-25);
					// skada fienden
					mob_arr[0].makeDamage();
					mob_arr[0].hit = true;
					// om fienden d�r ...
					if(mob_arr[0].alive==false) {
						// rita explosion = samma storlek som fienden
						ctx.drawImage(boom2, mob_arr[0].getX(), mob_arr[0].getY(), mob_arr[0].getWidth(),mob_arr[0].getHeight());
					}
					// uppdatera po�ngen, man f�r po�ng f�r alla tr�ffar
					poang = poang + 1000;
					
                    ElementById("resultat").innerHTML = poang;
					// d�dar skottet
					skott_arr[i].alive = false;
				}
				// om inte tr�ff, bara uppdatera skottets position i x-led
                skott_arr[i].x += 7;
				// kolla om skottet hamnat utanf�r sk�rmen, is�fall d�da det
	         if (skott_arr[i].x > 600) {
                    skott_arr[i].alive = false;
                }
            }
        }
    }
	
	// POWERUP ----------------------------------------------------------------
	if(powerup.alive) {
		var dx = get_random();  // ger ryckig r�relse fram�t
		var dy = get_random();
        powerup.x += dx - 1.7;
        powerup.y += dy - 0.6;
		if(collision(skepp, powerup)) {
			// ger st�rre skott
			skott_w = 65;
			skott_h = 8;
			// och lysande skepp
			skepp.gfx = skeppwithpowerup_gfx;
			powerup.alive = false;
		}
		ctx.drawImage(powerup.getGfx(), powerup.getX(), powerup.getY(), 40, 40);	
	}
	
	// RITA FIENDE ------------------------------------------------------------
	if (mob_arr[0].alive && mob_arr[0].isBoss()==false) {
		var dx = get_random();  // ger ryckig r�relse fram�t
		var dy = get_random();
        mob_arr[0].x += dx - 1.4;
        mob_arr[0].y += dy + 0.3;
		// om moben hamnar utanf�r rutan, d�da den
		if(mob_arr[0].getX()<0) {
			mob_arr[0].alive = false;
		}
		if(mob_arr[0].isHit()==true) {
			ctx.drawImage(mob_arr[0].getHitGfx(), mob_arr[0].getX(), mob_arr[0].getY());
			mob_arr[0].hit = false;
		}
		else {
			ctx.drawImage(mob_arr[0].getGfx(), mob_arr[0].getX(), mob_arr[0].getY());	
		}
	}
	
	// om mob �r BOSS ---------------------------------------------------------
	else if (mob_arr[0].isBoss()) {
		var dx = get_random();  // ger ryckig r�relse fram�t
		if (mob_arr[0].getX()>250) {
			mob_arr[0].x += dx - 1;
		}
		else {
			dx = get_random();  // ger ryckig r�relse fram�t
			var dy = get_random();
			mob_arr[0].x += dx;
			mob_arr[0].y += dy;
		}	
		ctx.drawImage(mob_arr[0].getGfx(), mob_arr[0].getX(), mob_arr[0].getY());
	}
	
	// Kollar om skeppet kolliderar med n�gon fiende
	if(collision(skepp, mob_arr[0])) {
		// ritar explosioner, en f�r moben
		ctx.drawImage(boom, mob_arr[0].getX(), mob_arr[0].getY());
		// .. och en f�r skeppet
		ctx.drawImage(boom2, skepp.getX(), skepp.getY(), 100, 100);
		// och avslutar spelet!
		clearInterval(grafik_id);
		clearInterval(spel_id);
		ctx.drawImage(gameover_screen, 0, 0);  // ritar credits
	}
}

//-----------------------------------------------------------------------------
// get_random() �r en funktion som slumpar fram ett tal och sedan
// returnerar positivt/negativt s�dant beroende p� en till slumpgenerering.
// Anv�nds f�r att f� en ryckigare animering p� fienderna!
//-----------------------------------------------------------------------------
function get_random() {
    var dx = Math.floor(Math.random() * 2);
    if (Math.random()<0.5) {
        return -dx;
    }
    else {
        return dx;
    }
}

//-----------------------------------------------------------------------------
// get_mob_start_y() �r en funktion som slumpar fram fiendernas
// startposition i y-led och returnerar detta.
//-----------------------------------------------------------------------------
function get_mob_start_y() {
	var y = Math.floor(Math.random() * 5);
	return y;
}

//-----------------------------------------------------------------------------
// spel_motor() �r en funktion som k�r varje sekund. Hanterar saker i spelet.
// - H�ller koll p� po�ng och ifall man klarat spelet.
// - Kollar om fiende-arrayen �r tom eller om fienden d�ri �r d�d,
//   is�fall skapar den en ny fiende p� sk�rmen.
//   Vid vissa intervall kommer andra typer av fiender!
//-----------------------------------------------------------------------------
function spel_motor() {
	// D�d boss = klarat spelet! 
	if ( mob_arr[0] != undefined && mob_arr[0].isBoss()==true && mob_arr[0].isAlive()==false) {
		clearInterval(grafik_id);
		clearInterval(spel_id);
		ctx.drawImage(end_screen, 0, 0);  // ritar credits
    }
	
	// vid 500 ska det komma en powerup sv�vande
	if(bakgrund_x==-1500) {
		powerup.alive = true;
	}
	
	// skicka mobs
	if(mob_arr[0] == undefined || !mob_arr[0].alive) {
		// om spelet scrollat till -3400 pixlar s� kommer BOSS
		if(bakgrund_x<-3400) {
			var ny_mob = new mob(650, 100, boss_gfx);
			ny_mob.width = 404;
			ny_mob.height = 370;
			ny_mob.life = 30;
			ny_mob.boss = true;
			mob_arr[0] = ny_mob;
		}
		// om spelet scrollat till -2000 pixlar s� kommer en gr�n fiende
		else if(bakgrund_x<-2000) {
			var ny_mob = new mob(650, get_mob_start_y()*100, invgreen_gfx);
			ny_mob.width = 200;
			ny_mob.height = 146;
			ny_mob.life = 10;
			ny_mob.hit_gfx = invgreen_hit_gfx;
			mob_arr[0] = ny_mob;
		}
		// om spelet scrollat till -1000 pixlar s� kommer en r�d fiende
		else if(bakgrund_x<-1000) {
			var ny_mob = new mob(650, get_mob_start_y()*100, invred_gfx);
			ny_mob.width = 150;
			ny_mob.height = 110;
			ny_mob.life = 5;
			ny_mob.hit_gfx = invred_hit_gfx;
			mob_arr[0] = ny_mob;
		}
		// startfienderna, kommer direkt
		else {
			var ny_mob = new mob(650, get_mob_start_y()*100, invsmall_gfx);
			mob_arr[0] = ny_mob;
		}
	}
}

//-----------------------------------------------------------------------------
// starta() �r en funktion som startar spelet dsv laddar all grafik,
// samt ritar upp introsk�rmen. v�ntar sedan p� att anv�ndaren ska trycka
// p� startknappen ...
//-----------------------------------------------------------------------------
function starta() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    ctx.drawImage(start_screen, 0, 0);  // ritar startsk�rmen
}

// d� startas intervall f�r spelet och fienderna
// och sedan tas startknappen bort!
function gogogo() {
    grafik_id = setInterval(grafik_motor, 1);  // varje millisekund? uppdaterar sk�rm varje ms?
	// initiera skeppet
	skepp = new mob(100, 100, skepp_gfx);
	skepp.width = 75;
	skepp.height = 32;
	spel_id = setInterval(spel_motor, 1);
}

//-----------------------------------------------------------------------------
// Main. Laddar grafiken.
//-----------------------------------------------------------------------------
// rymdskeppet man spelar
var skepp_gfx = new Image();   // skapa ett Image object  
skepp_gfx.src = 'images/vicviper_normal.png'; // Set source
var skeppwithpowerup_gfx = new Image();   // skapa ett Image object  
skeppwithpowerup_gfx.src = 'images/vicviper_powerup.png'; // Set source
// lila liten fiende
var invsmall_gfx = new Image();
invsmall_gfx.src = 'images/invader_small.png';
var invsmall_hit_gfx = new Image();  // grafik om den blir tr�ffad
invsmall_hit_gfx.src = 'images/invader_smallhit.png';
// gr�n stor fiende
var invgreen_gfx = new Image();
invgreen_gfx.src = 'images/invader_green.png';
var invgreen_hit_gfx = new Image();
invgreen_hit_gfx.src = 'images/invader_greenhit.png';
// r�d fiende
var invred_gfx = new Image();
invred_gfx.src = 'images/invader_red.png';
var invred_hit_gfx = new Image();
invred_hit_gfx.src = 'images/invader_redhit.png';
// bossen 
var boss_gfx = new Image();
boss_gfx.src = 'images/monster.png';
// powerup ikon
var powerup_gfx = new Image();
powerup_gfx.src = 'images/powerup.png';
// initiera powerup-objektet .. kanske ska ligga n�gon annastans?
powerup = new mob(650, 300, powerup_gfx);
powerup.alive = false;
powerup.life = 1;
// startbilden och slutbilder
var start_screen = new Image();
start_screen.src = 'images/gradius-js-start.png';
var gameover_screen = new Image();
gameover_screen.src = 'images/game-over.png';
var end_screen = new Image();
end_screen.src = 'images/the-end.png';
// den scrollande bakgrunden
var bakgrund = new Image();
bakgrund.src = 'images/clouds-background.jpg';
var framgrund = new Image();
framgrund.src = 'images/clouds-foreground.png';
// explosion f�r skott-tr�ffar
var boom = new Image();
boom.src = 'images/boom.png';
var boom2 = new Image();
boom2.src = 'images/boom_storre.png';
window.onload = starta;
