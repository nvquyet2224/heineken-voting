var common;


function winnerControls() {
  $(".tab-item").click(function () {
    if (!$(this).hasClass("current")) {
      var tab = $(this).attr("data-tab");
      $(".tab-item").removeClass("current");
      $(this).addClass("current");
      $(".body-item").removeClass("isAll");
      $(".body-item.current").fadeOut(0);
      $(".body-item.current").removeClass("current");
      $(".body-item[data-tab=" + tab + "]").addClass("current");
      $(".body-item[data-tab=" + tab + "]").fadeIn(300);
    }
  });

  $(".show__all").click(function () {
    $(".body-item.current").addClass("isAll");
  });
}

(function () {
  const modules = Lib.modules;
  common = new modules.Common();
  common.init();

  $(document).on("click", ".copy-but", function () {
    var copyText = $(this).text();
    copyText = copyText.replace(/\s+/g, " ").trim();
    copyText = copyText.split(" ").join("\n");
    var sampleTextarea = document.createElement("textarea");
    document.body.appendChild(sampleTextarea);
    sampleTextarea.value = copyText;
    sampleTextarea.select();
    document.execCommand("copy");
    document.body.removeChild(sampleTextarea);
    $(".copy-status").addClass("active");
  });

  var fullChart = false;
  // Toggle See full chart
  $(document).on("click", "#btnSeeFullChart", function () {
    fullChart = !fullChart;
    if (fullChart) {
      $(".ranking-orther").slideDown(150, function () {
        setTimeout(function () {
          var popH = $("#popRanking .popup-inr").innerHeight();
          $(".master__section__box").css({ "min-height": popH + "px" });
        }, 50);
      });
    } else {
      $("html, body").scrollTop(0);
      $(".ranking-orther").slideUp(150, function () {
        setTimeout(function () {
          $(".master__section__box").css({ "min-height": "auto" });
          var popH = $("#popRanking .popup-inr").innerHeight();
          $(".master__section__box").css({ "min-height": popH + "px" });
        }, 50);
      });
    }
    fullChart && $("#btnSeeFullChart span").text("See Top 3");
    !fullChart && $("#btnSeeFullChart span").text("See Full Chart");
  });


  // For Winner
  winnerControls();

  // For Aimation button

  const arrOpts = {
    duration: 500,
    easing: "easeOutQuad",
    speed: 0.1,
    particlesAmountCoefficient: 10,
    oscillationCoefficient: 80,
  };

  [].slice.call(document.querySelectorAll(".but-wrap")).forEach(function (el) {
    //const bttn = elm;
    const bttn = el.querySelector(".particles-button");
    const bttnBack = el.querySelector(".action");

    let particlesOpts = arrOpts;
    particlesOpts.complete = () => {
      if (!buttonVisible) {
        bttnBack.click();
      }
    };

    var particles = new Particles(bttn, particlesOpts);
    var buttonVisible = true;

    bttn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!particles.isAnimating() && buttonVisible) {
        particles.disintegrate();
        buttonVisible = !buttonVisible;
      }
    });

    bttnBack.addEventListener("click", () => {
      if (!particles.isAnimating() && !buttonVisible) {
        particles.integrate({
          duration: 0,
          easing: "easeOutSine",
        });
        buttonVisible = !buttonVisible;
      }
    });
  });
})();
