import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import { useSession } from "next-auth/react";

import { fetchLatestUserData, updateUser } from "../data/userData";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(0);

  const isInitialized = useRef(false);

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);
    if (status === "loading") return;

    if (session?.user) {
      console.log("User is authenticated, fetching user data.");
      userResponse();
    } else {
      console.log("User is not authenticated, redirecting to login.");
      router.push("/login2");
    }
  }, [session, status]);

  const userResponse = async () => {
    try {
      console.log("Fetching latest user data...");
      const userData = await fetchLatestUserData(session);
      console.log("Fetched user data:", userData);
      if (userData && userData._id) {
        setProfile(userData);
        setBalance(userData.currentBalance);
      } else {
        console.error("Invalid user data received, redirecting to login.");
        router.push("/login2");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.push("/login2");
    }
  };

  useEffect(() => {
    if (profile && typeof window !== "undefined" && !isInitialized.current) {
      isInitialized.current = true;
      initializeGame();
    }
  }, [balance, profile]);

  const initializeGame = () => {
    if (window.CMain) {
      const oMain = new window.CMain({
        win_occurrence: 30,
        slot_cash: 0,
        min_reel_loop: 0,
        reel_delay: 6,
        time_show_win: 2000,
        time_show_all_wins: 2000,
        money: balance,
        paytable_symbol_1: [0, 0, 100, 150, 200],
        paytable_symbol_2: [0, 0, 50, 100, 150],
        paytable_symbol_3: [0, 10, 25, 50, 100],
        paytable_symbol_4: [0, 10, 25, 50, 100],
        paytable_symbol_5: [0, 5, 15, 25, 50],
        paytable_symbol_6: [0, 2, 10, 20, 35],
        paytable_symbol_7: [0, 1, 5, 10, 15],
        audio_enable_on_startup: true,
        fullscreen: true,
        check_orientation: true,
        show_credits: true,
        ad_show_counter: 3,
      });

      // Listen for balance changes from the game
      $(oMain).on("balance_change", (event, newBalance) => {
        setBalance(newBalance); // Update React state
      });

      // Listen for save_spin event and send data to API
      $(oMain).on("save_spin", (event, spinData) => {
        const { spinPrice, outcome, moneyEarned } = spinData;
        try {
          setProfile((prevProfile) => {
            const updatedProfile = {
              ...prevProfile,
              currentBalance:
                outcome !== false
                  ? prevProfile.currentBalance + moneyEarned - spinPrice
                  : prevProfile.currentBalance - spinPrice,
              totalSpins: prevProfile.totalSpins + 1,
              ...(outcome !== false && {
                spinsWon: prevProfile.spinsWon + 1,
                totalEarnings: prevProfile.totalEarnings + moneyEarned,
              }),
            };
            updateUser(updatedProfile);
            console.log("User profile updated successfully!");
            return updatedProfile;
          });
        } catch (error) {
          console.error("Error updating user profile: ", error);
        }

        fetch("/api/spin/route", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: profile.username,
            pfpUrl: profile.pfpUrl,
            spinPrice,
            outcome,
            moneyEarned,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Spin saved:", data);
          })
          .catch((error) => {
            console.error("Error saving spin:", error);
          });
      });

      $(oMain).on("recharge", function (evt) {
        window.location.href = "/bank";
        var iMoney = 0;
        if (window.s_oGame !== null) {
          window.s_oGame.setMoney(iMoney);
        }
      });

      if (window.isIOS()) {
        setTimeout(() => window.sizeHandler(), 200);
      } else {
        window.sizeHandler();
      }
    } else {
      console.error("CMain is not available.");
      // Handle redirection or other logic if needed
    }
  };

  return (
    <>
      <Head>
        <title>Nite Slot</title>
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui"
        />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Script src="/js/jquery-3.2.1.min.js" strategy="beforeInteractive" />
      <Script
        src="/js/createjs-2015.11.26.min.js"
        strategy="beforeInteractive"
      />
      <Script src="/js/howler.min.js" strategy="beforeInteractive" />
      <Script src="/js/screenfull.js" strategy="beforeInteractive" />
      <Script src="/js/platform.js" strategy="beforeInteractive" />
      <Script src="/js/ios_fullscreen.js" strategy="beforeInteractive" />
      <Script src="/js/ctl_utils.js" strategy="beforeInteractive" />
      <Script src="/js/sprite_lib.js" strategy="beforeInteractive" />
      <Script src="/js/settings.js" strategy="beforeInteractive" />
      <Script src="/js/CSlotSettings.js" strategy="beforeInteractive" />
      <Script src="/js/CLang.js" strategy="beforeInteractive" />
      <Script src="/js/CPreloader.js" strategy="beforeInteractive" />
      <Script src="/js/CMain.js" strategy="beforeInteractive" />
      <Script src="/js/CTextButton.js" strategy="beforeInteractive" />
      <Script src="/js/CGfxButton.js" strategy="beforeInteractive" />
      <Script src="/js/CToggle.js" strategy="beforeInteractive" />
      <Script src="/js/CBetBut.js" strategy="beforeInteractive" />
      <Script src="/js/CMenu.js" strategy="beforeInteractive" />
      <Script src="/js/CGame.js" strategy="beforeInteractive" />
      <Script src="/js/CReelColumn.js" strategy="beforeInteractive" />
      <Script src="/js/CInterface.js" strategy="beforeInteractive" />
      <Script src="/js/CPayTablePanel.js" strategy="beforeInteractive" />
      <Script src="/js/CStaticSymbolCell.js" strategy="beforeInteractive" />
      <Script src="/js/CTweenController.js" strategy="beforeInteractive" />
      <Script src="/js/CCreditsPanel.js" strategy="beforeInteractive" />
      <Script src="/js/CCTLText.js" strategy="beforeInteractive" />
      <Script src="/js/CRechargePanel.js" strategy="beforeInteractive" />

      <div
        style={{
          position: "fixed",
          backgroundColor: "transparent",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      ></div>
      <div className="check-fonts">
        <p className="check-font-1">test 1</p>
      </div>
      <canvas
        id="canvas"
        className="ani_hack"
        width="1500"
        height="640"
      ></canvas>
      <div data-orientation="landscape" className="orientation-msg-container">
        <p className="orientation-msg-text">Please rotate your device</p>
      </div>
      <div
        id="block_game"
        style={{
          position: "fixed",
          backgroundColor: "transparent",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "none",
        }}
      ></div>
    </>
  );
}
