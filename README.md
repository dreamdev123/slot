“Slot Machine - Nite Slots” 


Table of Contents
A. Description
B. Folder Content
C. Getting Started
D.HTML Structure
E. CSS Files and Structure
F. JavaScript
G. Game functions
H. Asset Files
I. Change symbols
J. Change Graphic
K. Hide Credits
L. Disable Sounds

A) Description
Nite Slot Machine - Nite Slot is a NextJS 14 Pages router casino game. Enjoy this slot machine with classic crypto symbols!
Sounds are enabled for mobile but we can't grant full audio compatibility on all mobile devices due to some well-know issue between some mobile-browser and HTML5. So if you want to avoid sound loading, please read Disable Sound section).
WARNING: Sounds can't be enabled for Windows Phone as this kind of device have unsolved issues with 'audio' and 'video' tag.

B) Folder Content
public
This folder contains the full game source code ready to be edited.

public/css
This folder contains the styles and fonts of the game.

public/js
This folder contains the scripts and logic of the game.

public/sounds
This folder contains the sounds of the game.

public/sprites
This folder contains the sprite assets and ui of the game.

B) Getting Started

Save Score: if you need to call your php function for saving score, you can add it in the index.html file:

$(document).ready(function(){
var oMain = new CMain();

    $(oMain).on("save_score", function(evt,iMoney) {
        //ADD YOUR CODE HERE
    });

});
Localization: You can easily change game text for different languages, changing string in CLang.js

TEXT_MONEY = "MONEY";
TEXT_PLAY = "PLAY";
TEXT_BET = "BET";
TEXT_COIN = "COIN";
TEXT_MAX_BET = "MAX BET";
TEXT_INFO = "INFO";
TEXT_LINES = "LINES";
TEXT_SPIN = "SPIN";
TEXT_WIN = "WIN";
TEXT_HELP_WILD = "THIS SIMBOL IS A WILD BELL WHICH CAN REPLACE ANY OTHER SYMBOL TO MAKE UP A COMBO";
TEXT_CREDITS_DEVELOPED = "MADE BY";
TEXT_CURRENCY = "$";

TEXT_SHARE_IMAGE = "200x200.jpg";
TEXT_SHARE_TITLE = "Congratulations!";
TEXT_SHARE_MSG1 = "You collected <strong>";
TEXT_SHARE_MSG2 = " points</strong>!<br><br>Share your score with your friends!";
TEXT_SHARE_SHARE1 = "My score is ";
TEXT_SHARE_SHARE2 = " points! Can you do better?";

Game option: You can easily customize game setting when creating a new instance of the game in index.html file

var oMain = new CMain({
win_occurrence:30, //WIN PERCENTAGE.SET A VALUE FROM 0 TO 100.
slot_cash: 100, //THIS IS THE CURRENT SLOT CASH AMOUNT. THE GAME CHECKS IF THERE IS AVAILABLE CASH FOR WINNINGS.
min_reel_loop:2, //NUMBER OF REEL LOOPS BEFORE SLOT STOPS  
 reel_delay: 6, //NUMBER OF FRAMES TO DELAY THE REELS THAT START AFTER THE FIRST ONE
time_show_win:2000, //DURATION IN MILLISECONDS OF THE WINNING COMBO SHOWING
time_show_all_wins: 2000, //DURATION IN MILLISECONDS OF ALL WINNING COMBO
money:100, //STARING CREDIT FOR THE USER

                /***********PAYTABLE********************/
                //EACH SYMBOL PAYTABLE HAS 5 VALUES THAT INDICATES THE MULTIPLIER FOR X1,X2,X3,X4 OR X5 COMBOS
                paytable_symbol_1: [0,0,100,150,200], //PAYTABLE FOR SYMBOL 1
                paytable_symbol_2: [0,0,50,100,150],  //PAYTABLE FOR SYMBOL 2
                paytable_symbol_3: [0,10,25,50,100],  //PAYTABLE FOR SYMBOL 3
                paytable_symbol_4: [0,10,25,50,100],  //PAYTABLE FOR SYMBOL 4
                paytable_symbol_5: [0,5,15,25,50],    //PAYTABLE FOR SYMBOL 5
                paytable_symbol_6: [0,2,10,20,35],    //PAYTABLE FOR SYMBOL 6
                paytable_symbol_7: [0,1,5,10,15],     //PAYTABLE FOR SYMBOL 7
                /*************************************/
                audio_enable_on_startup:false, //ENABLE/DISABLE AUDIO WHEN GAME STARTS
                fullscreen:true,           //SET THIS TO FALSE IF YOU DON'T WANT TO SHOW FULLSCREEN BUTTON
                check_orientation:true,    //SET TO FALSE IF YOU DON'T WANT TO SHOW ORIENTATION ALERT ON MOBILE DEVICES
                show_credits:true,         //ENABLE/DISABLE CREDITS BUTTON IN THE MAIN SCREEN
                ad_show_counter:3         //NUMBER OF SPIN PLAYED BEFORE AD SHOWING
                //
                //// THIS FEATURE  IS ACTIVATED ONLY WITH CTL ARCADE PLUGIN.///////////////////////////
                /////////////////// YOU CAN GET IT AT: /////////////////////////////////////////////////////////
                // http://codecanyon.net/item/ctl-arcade-wordpress-plugin/13856421///////////

            });

C) HTML Structure
This game have the canvas tag in the body. The ready event into the body calls the main function of the game: CMain().
The head section declares all the javascript functions of the game. The whole project uses a typical object-oriented approach.
In the init function there are 5 mapped events that can be useful eventually for stats

  <script>
   $(document).ready(function(){
             var oMain = new CMain();
             
             $(oMain).on("start_session", function(evt) {
                    //THIS EVENT IS TRIGGERED WHEN PLAY BUTTON IN MENU SCREEN IS CLICKED
             });
              
            $(oMain).on("end_session", function(evt) {
                    //THIS EVENT IS TRIGGERED WHEN THE EXIT BUTTON IS CLICKED.
            });
             
            $(oMain).on("bet_placed", function (evt, oBetInfo) {
                    //THIS EVENT IS CALLED WHEN SPIN BUTTON IS CLICKED (NOT IF YOU SPIN AFTER HOLDING REELS)
            });
             
            $(oMain).on("save_score", function(evt,iScore, szMode) {
                    //THIS EVENT IS TRIGGERED WHEN REELS STOPS AFTER A SPIN. IT CAN BE USEFUL TO CALL PHP SCRIPTS (NOT PROVIDED IN THE PACKAGE) THAT SAVE THE SCORE.
             });
             
            $(oMain).on("show_preroll_ad", function (evt) {
                    //THIS EVENT IS TRIGGERED WHEN THE START BUTTON IN THE PRELOADER IS CLICKED.
            });
     
             $(oMain).on("show_interlevel_ad", function(evt) {
                    //THIS EVENT IS TRIGGERED EVERY N SPIN. MAY BE USEFUL TO CALL ADS SCRIPT. PLEASE EDIT PARAM 'ad_show_counter' in INDEX.HTML TO SET THIS VALUE.
             });
              
             $(oMain).on("share_event", function(evt,iScore) {
                    //THIS EVENT IS TRIGGERED WHEN USER CLICK EXIT BUTTON. CAN BE USEFUL TO CALL SHARING FEATURE SCRIPTS.
             });
   });
         
  </script>

<canvas id="canvas" class="ani_hack" width="1500" height="640"> </canvas>

D) CSS Files and Structure
The game use two CSS files. The first one is a generic reset file. Many browser interpret the default behavior of html elements differently. By using a general reset CSS file, we can work round this. Keep in mind, that these values might be overridden somewhere else in the file.

The second file contains all of the specific stylings for the canvas and some hack to be fully compatible with all most popular mobile devices

E) JavaScript
This game contains:

jQuery
Our custom scripts
CreateJs plugin
Howler plugin
Screenfull plugin
jQuery is a Javascript library that greatly reduces the amount of code that you must write.
The game have the following js files:
CMain: the main class called by the index file.
This file controls the sprite_lib.js file that manages the sprite loading, the loop game and initialize the canvas with the CreateJs library
ctl_utils: this file manages the canvas resize and its centering
sprite_lib: this class loads all images declared in the main class
settings: general game settings
CLang: global string variables for language localization
CPreloader: simple text preloader to show resources loading progress
CMenu: simple menu with play button
CGfxButton: this class create a standard button
CTextButton: this class create a standard text button
CHelp: this class manages the help panel that appears when game starts
CGame: this class manages the game logic
CPayTablePanel: this class manages the paytable panel that is shown clicking the info button
CInterface: this class controls game GUI that contains text and buttons
CEndPanel: this class controls the game over panel that appears when player lose all the lives
CSlotSettings: this class contains all infos relative to symbols, combos and their animations
CreateJs is a suite of modular libraries and tools which work together to enable rich interactive content on open web technologies via HTML5.
Howler is a javascript Audio library.
Resuming, the complete game flow is the following:

The index.html file calls the CMain.js file after ready event is called
The main class calls CPreloader.js to init preloader text and start sprite loading
When all sprites contained in "/sprites" folder are loaded, the main class removes the preloader and calls the CMenu.js file that shows the main menu
If user click on the play button in main menu, the CGame.js class is called and the game starts
The User can start slot spinning, clicking the spin button on the right
If user click on the exit button in the up-right corner, the game returns to the menu screen
F) Game functions - top
In this section will be explained all the most important functions used in CGame.js file.

\_init()
This function attach on the canvas some game sprites like background (oBg), GUI, help panel and paytable. It also init the reels.
unload()
This function removes all images from canvas and event listeners on buttons. It's called when user decide to exit from the game.
generateFinalSymbols()
This function choose randomically the final symbols to show after reel spinning. It also check if user have winning combos
reelArrived()
This function manages reel loop during slot spinning
\_endReelAnimation()
This function reset slot buttons and increase eventually user money if there are winning combos
\_showWin()
This function shows next winning combo after slot spinning.
onSpin()
This function is called when user click spin button.
update()
This function manages the game loop.
