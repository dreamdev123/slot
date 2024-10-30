function CMenu() {
  var _pStartPosAudio;
  var _pStartPosFullscreen;
  var _pStartPosCredits;
  var _oButProfile;
  var _pStartPosProfile;

  var _fRequestFullScreen = null;
  var _fCancelFullScreen = null;
  var _oBg;
  var _oButPlay;
  var _oButCreateAccount;
  var _oButLogin;
  var _oAudioToggle;
  var _oButCredits;
  var _oButFullscreen;
  var _oFade;
  var _oButBank;
  var _oButDashboard;
  var _bSessionExists = false;
  var _bIsAdmin = false;

  this._init = function () {
    _oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
    s_oStage.addChild(_oBg);

    var oSprite = s_oSpriteLibrary.getSprite("but_bg");

    // Check for existing session
    this._checkSession();

    if (_bSessionExists) {
      var buttonWidth = 200; // Reduced button width
      var buttonHeight = 60; // Reduced button height
      var buttonSpacing = 20; // Reduced spacing between buttons
      var startY = CANVAS_HEIGHT / 2; // Center vertically

      _oButPlay = new CTextButton(
        CANVAS_WIDTH / 2 - buttonWidth - buttonSpacing,
        startY,
        oSprite,
        TEXT_PLAY,
        FONT_GAME,
        "#ffffff",
        30, // Reduced font size
        s_oStage
      );
      _oButPlay.getButtonImage().scaleX = buttonWidth / oSprite.width;
      _oButPlay.getButtonImage().scaleY = buttonHeight / oSprite.height;
      _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);

      if (_bIsAdmin) {
        _oButDashboard = new CTextButton(
          CANVAS_WIDTH / 2,
          startY,
          oSprite,
          "DASHBOARD",
          FONT_GAME,
          "#ffffff",
          30, // Reduced font size
          s_oStage
        );
        _oButDashboard.getButtonImage().scaleX = buttonWidth / oSprite.width;
        _oButDashboard.getButtonImage().scaleY = buttonHeight / oSprite.height;
        _oButDashboard.addEventListener(
          ON_MOUSE_UP,
          this._onButDashboardRelease,
          this
        );
      }

      _oButBank = new CTextButton(
        CANVAS_WIDTH / 2 + buttonWidth + buttonSpacing,
        startY,
        oSprite,
        TEXT_BANK,
        FONT_GAME,
        "#ffffff",
        30, // Reduced font size
        s_oStage
      );
      _oButBank.getButtonImage().scaleX = buttonWidth / oSprite.width;
      _oButBank.getButtonImage().scaleY = buttonHeight / oSprite.height;
      _oButBank.addEventListener(ON_MOUSE_UP, this._onButBankRelease, this);
    } else {
      _oButCreateAccount = new CTextButton(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - 164,
        oSprite,
        "CREATE ACCOUNT",
        FONT_GAME,
        "#ffffff",
        40,
        s_oStage
      );
      _oButCreateAccount.addEventListener(
        ON_MOUSE_UP,
        this._onButCreateAccountRelease,
        this
      );
    }

    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      var oSprite = s_oSpriteLibrary.getSprite("audio_icon");
      _pStartPosAudio = {
        x: CANVAS_WIDTH - oSprite.width / 4 - 10,
        y: oSprite.height / 2 + 10,
      };

      _oAudioToggle = new CToggle(
        _pStartPosAudio.x,
        _pStartPosAudio.y,
        oSprite,
        s_bAudioActive
      );
      _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
    }

    if (SHOW_CREDITS) {
      var oSprite = s_oSpriteLibrary.getSprite("but_credits");
      _pStartPosCredits = {
        x: oSprite.height / 2 + 10,
        y: oSprite.height / 2 + 10,
      };
      _oButCredits = new CGfxButton(
        _pStartPosCredits.x,
        _pStartPosCredits.y,
        oSprite,
        s_oStage
      );
      _oButCredits.addEventListener(
        ON_MOUSE_UP,
        this._onButCreditsRelease,
        this
      );

      _pStartPosFullscreen = {
        x: oSprite.height / 2 + 10,
        y: oSprite.height / 2 + 10,
      };
    } else {
      _pStartPosFullscreen = {
        x: oSprite.height / 2 + 10,
        y: oSprite.height / 2 + 10,
      };
    }

    var doc = window.document;
    var docEl = doc.documentElement;
    _fRequestFullScreen =
      docEl.requestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.webkitRequestFullScreen ||
      docEl.msRequestFullscreen;
    _fCancelFullScreen =
      doc.exitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;

    if (ENABLE_FULLSCREEN === false) {
      _fRequestFullScreen = false;
    }

    if (_fRequestFullScreen && screenfull.enabled) {
      const oSprite = s_oSpriteLibrary.getSprite("but_fullscreen");
      _pStartPosFullscreen = {
        x: oSprite.height / 2 + 10,
        y: oSprite.height / 2 + 10,
      };
      _oButFullscreen = new CToggle(
        _pStartPosFullscreen.x,
        _pStartPosFullscreen.y,
        oSprite,
        s_bFullscreen,
        s_oStage
      );
      _oButFullscreen.addEventListener(
        ON_MOUSE_UP,
        this._onFullscreenRelease,
        this
      );

      this._updateProfileLoginButton();
    }

    _oFade = new createjs.Shape();
    _oFade.graphics
      .beginFill("black")
      .drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    s_oStage.addChild(_oFade);

    createjs.Tween.get(_oFade)
      .to({ alpha: 0 }, 400)
      .call(function () {
        _oFade.visible = false;
      });

    this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
  };

  this.unload = function () {
    if (_bSessionExists) {
      _oButPlay.unload();
      _oButPlay = null;
      if (_bIsAdmin) {
        _oButDashboard.unload();
        _oButDashboard = null;
      }
      _oButBank.unload();
      _oButBank = null;
    } else {
      _oButCreateAccount.unload();
      _oButCreateAccount = null;
    }

    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      _oAudioToggle.unload();
      _oAudioToggle = null;
    }
    if (SHOW_CREDITS) {
      _oButCredits.unload();
    }
    if (_fRequestFullScreen && screenfull.enabled) {
      _oButFullscreen.unload();
    }
    s_oStage.removeChild(_oBg);
    _oBg = null;

    s_oStage.removeChild(_oFade);
    _oFade = null;

    s_oMenu = null;
  };

  this.refreshButtonPos = function (iNewX, iNewY) {
    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      _oAudioToggle.setPosition(
        _pStartPosAudio.x - iNewX,
        iNewY + _pStartPosAudio.y
      );
    }
    if (SHOW_CREDITS) {
      _oButCredits.setPosition(
        _pStartPosCredits.x + iNewX,
        _pStartPosCredits.y + iNewY
      );
    }
    if (_fRequestFullScreen && screenfull.enabled) {
      _oButFullscreen.setPosition(
        _pStartPosFullscreen.x + iNewX,
        _pStartPosFullscreen.y + iNewY
      );
      if (_bSessionExists) {
        _oButProfile.setPosition(
          _pStartPosProfile.x + iNewX,
          _pStartPosProfile.y + iNewY
        );
      } else {
        _oButLogin.setPosition(
          _pStartPosLogin.x + iNewX,
          _pStartPosLogin.y + iNewY
        );
      }
    }
  };

  this._checkSession = function () {
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((session) => {
        _bSessionExists = !!session.user;
        _bIsAdmin = session.user?.isAdmin === true;
        this._updateButtons();
        this._updateProfileLoginButton();
      })
      .catch((error) => {
        console.error("Error checking session:", error);
        _bSessionExists = false;
        _bIsAdmin = false;
        this._updateButtons();
        this._updateProfileLoginButton();
      });
  };

  this._updateButtons = function () {
    if (_bSessionExists) {
      var buttonWidth = 200;
      var buttonHeight = 60;
      var buttonSpacing = 20;
      var startY = CANVAS_HEIGHT / 2;

      if (_oButCreateAccount) {
        _oButCreateAccount.unload();
        _oButCreateAccount = null;
      }
      if (!_oButPlay) {
        _oButPlay = new CTextButton(
          CANVAS_WIDTH / 2 - buttonWidth - buttonSpacing,
          startY,
          s_oSpriteLibrary.getSprite("but_bg"),
          TEXT_PLAY,
          FONT_GAME,
          "#ffffff",
          30,
          s_oStage
        );
        _oButPlay.getButtonImage().scaleX =
          buttonWidth / s_oSpriteLibrary.getSprite("but_bg").width;
        _oButPlay.getButtonImage().scaleY =
          buttonHeight / s_oSpriteLibrary.getSprite("but_bg").height;
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
      }
      if (_bIsAdmin && !_oButDashboard) {
        _oButDashboard = new CTextButton(
          CANVAS_WIDTH / 2,
          startY,
          s_oSpriteLibrary.getSprite("but_bg"),
          "DASHBOARD",
          FONT_GAME,
          "#ffffff",
          30,
          s_oStage
        );
        _oButDashboard.getButtonImage().scaleX =
          buttonWidth / s_oSpriteLibrary.getSprite("but_bg").width;
        _oButDashboard.getButtonImage().scaleY =
          buttonHeight / s_oSpriteLibrary.getSprite("but_bg").height;
        _oButDashboard.addEventListener(
          ON_MOUSE_UP,
          this._onButDashboardRelease,
          this
        );
      }
      if (!_oButBank) {
        _oButBank = new CTextButton(
          CANVAS_WIDTH / 2 + buttonWidth + buttonSpacing,
          startY,
          s_oSpriteLibrary.getSprite("but_bg"),
          TEXT_BANK,
          FONT_GAME,
          "#ffffff",
          30,
          s_oStage
        );
        _oButBank.getButtonImage().scaleX =
          buttonWidth / s_oSpriteLibrary.getSprite("but_bg").width;
        _oButBank.getButtonImage().scaleY =
          buttonHeight / s_oSpriteLibrary.getSprite("but_bg").height;
        _oButBank.addEventListener(ON_MOUSE_UP, this._onButBankRelease, this);
      }
    } else {
      if (_oButPlay) {
        _oButPlay.unload();
        _oButPlay = null;
      }
      if (_oButDashboard) {
        _oButDashboard.unload();
        _oButDashboard = null;
      }
      if (_oButBank) {
        _oButBank.unload();
        _oButBank = null;
      }
      if (!_oButCreateAccount) {
        _oButCreateAccount = new CTextButton(
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT - 164,
          s_oSpriteLibrary.getSprite("but_bg"),
          "CREATE ACCOUNT",
          FONT_GAME,
          "#ffffff",
          40,
          s_oStage
        );
        _oButCreateAccount.addEventListener(
          ON_MOUSE_UP,
          this._onButCreateAccountRelease,
          this
        );
      }
    }
  };

  this._updateProfileLoginButton = function () {
    if (_bSessionExists) {
      if (_oButLogin) {
        _oButLogin.unload();
        _oButLogin = null;
      }
      if (!_oButProfile) {
        var oSprite = s_oSpriteLibrary.getSprite("but_profile");
        _pStartPosProfile = {
          x: _pStartPosFullscreen.x + oSprite.width + 20,
          y: _pStartPosFullscreen.y,
        };
        _oButProfile = new CGfxButton(
          _pStartPosProfile.x,
          _pStartPosProfile.y,
          oSprite,
          s_oStage
        );
        _oButProfile.addEventListener(
          ON_MOUSE_UP,
          this._onProfileRelease,
          this
        );
      }
    } else {
      if (_oButProfile) {
        _oButProfile.unload();
        _oButProfile = null;
      }
      if (!_oButLogin) {
        var oSprite = s_oSpriteLibrary.getSprite("but_login");
        _pStartPosLogin = {
          x: _pStartPosFullscreen.x + oSprite.width + 20,
          y: _pStartPosFullscreen.y,
        };
        _oButLogin = new CGfxButton(
          _pStartPosLogin.x,
          _pStartPosLogin.y,
          oSprite,
          s_oStage
        );
        _oButLogin.addEventListener(ON_MOUSE_UP, this._onLoginRelease, this);
      }
    }
  };

  this._onButPlayRelease = function () {
    this.unload();
    $(s_oMain).trigger("start_session");
    s_oMain.gotoGame();
  };

  this._onAudioToggle = function () {
    Howler.mute(s_bAudioActive);
    s_bAudioActive = !s_bAudioActive;
  };

  this._onButCreditsRelease = function () {
    new CCreditsPanel();
  };

  this.resetFullscreenBut = function () {
    if (_fRequestFullScreen && screenfull.enabled) {
      _oButFullscreen.setActive(s_bFullscreen);
    }
  };

  this._onFullscreenRelease = function () {
    if (s_bFullscreen) {
      _fCancelFullScreen.call(window.document);
    } else {
      _fRequestFullScreen.call(window.document.documentElement);
    }

    sizeHandler();

    // Adjust positions of profile and login buttons
    this._adjustButtonPositions();
  };

  this._adjustButtonPositions = function () {
    var oFullscreenSprite = s_oSpriteLibrary.getSprite("but_fullscreen");
    var oProfileSprite = s_oSpriteLibrary.getSprite("but_profile");
    var oLoginSprite = s_oSpriteLibrary.getSprite("but_login");

    if (s_bFullscreen) {
      // If fullscreen, move buttons to the left
      if (_bSessionExists) {
        _oButProfile.setPosition(
          _pStartPosFullscreen.x,
          _pStartPosFullscreen.y
        );
      } else {
        _oButLogin.setPosition(_pStartPosFullscreen.x, _pStartPosFullscreen.y);
      }
    } else {
      // If not fullscreen, reset to original positions
      if (_bSessionExists) {
        _oButProfile.setPosition(_pStartPosProfile.x, _pStartPosProfile.y);
      } else {
        _oButLogin.setPosition(_pStartPosLogin.x, _pStartPosLogin.y);
      }
    }
  };

  this._onButBankRelease = function () {
    s_oMenu.unload();
    s_oMain.gotoBank();
  };

  this._onButDashboardRelease = function () {
    window.location.href = "/dashboard";
  };

  this._onProfileRelease = function () {
    // Redirect to profile page
    window.location.href = "/profile";
  };

  this._onLoginRelease = function () {
    // Redirect to login page
    window.location.href = "/login2";
  };

  this._onButCreateAccountRelease = function () {
    window.location.href = "/login2";
  };

  s_oMenu = this;

  this._init();
}

var s_oMenu = null;
