var common;
var swiper;
var speed = 1000;
var timerOtp;
var otpCountValue = 60;
var currentPhone = "0902572962";

function countOtp() {
  timerOtp = setInterval(function () {
    var minSecond = otpCountValue < 10 ? "0" + otpCountValue : otpCountValue;
    document.querySelector(".time__count").innerHTML = minSecond;
    otpCountValue--;
    if (otpCountValue < 0) {
      clearInterval(timerOtp);
    }
  }, 1000);
}

function validText(byThis) {
  var result = true;
  if ($(byThis).val() === "") {
    result = false;
  }
  return result;
}

function numberInput(byThis) {
  $(byThis).val(
    $(byThis)
      .val()
      .replace(/[^0-9]/g, "")
  );
}

function validEmail(byThis) {
  var email = $(byThis).val();
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function otpValid() {
  var result = true;
  if (
    $("#otp1").val() === "" ||
    $("#otp2").val() === "" ||
    $("#otp3").val() === "" ||
    $("#otp4").val() === ""
  ) {
    result = false;
  }
  return result;
}

function sendOTP(currentPhone) {
  if (currentPhone) {
    if (!$(".loading__box").hasClass("active")) {
      $(".loading__box").addClass("active");
    }
    var url =
      "/get-otp?phone=" + currentPhone + "&utmstring=" + window.location.search;
    var settings = {
      url: url,
      method: "GET",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings)
      .done(function (response) {
        console.log("sendOTP done", response);
        // Clear OTP
        otpCountValue = 60;
        clearInterval(timerOtp);

        if ($(".loading__box").hasClass("active")) {
          $(".loading__box").removeClass("active");
        }
        $(".your-phone").html("+84 " + currentPhone);

        // add valid to show otp error
        $(".otp__list, .otp__error, .otp__message").removeClass("invalid");
        $(".otp__list, .otp__message").addClass("valid");

        // Goto Completed step
        swiper.slideTo(2, speed, null);

      })
      .fail(function (response) {
        console.log("sendOTP fail", response);
        if ($(".loading__box").hasClass("active")) {
          $(".loading__box").removeClass("active");
        }
        $(".your-phone").html("+84 " + currentPhone);

        // add invalid to show otp error
        $(".otp__list, .otp__message").removeClass("valid");
        $(".otp__list, .otp__error, .otp__message").addClass("invalid");
      });
  } else {
    console.log("No phone to send otp");
  }
}

function loginValid() {
  var username = validText("#lg_name");
  var phone = validText("#lg_phone");
  var email = validText("#lg_email");


  if (username && phone && email) {
    $("#loginSubmit").attr("disabled", false);
    $("#lg_name, #lg_phone, #lg_email").parent().removeClass("show__error");
  } else {
    $("#loginSubmit").attr("disabled", true);

    if (username) {
      $("#lg_name").parent().removeClass("show__error");
    } else {
      $("#lg_name").parent().addClass("show__error");
    }

    if (phone) {
      $("#lg_phone").parent().removeClass("show__error");
    } else {
      $("#lg_phone").parent().addClass("show__error");
    }

    if (email) {
      $("#lg_email").parent().removeClass("show__error");
    } else {
      $("#lg_email").parent().addClass("show__error");
    }
  }
}

function scrollTop() {
  $('html, body').scrollTop(0);
}

(function () {
  const modules = Lib.modules;
  const Swiper = modules.Swiper;

  common = new modules.Common();
  common.init();

  // common.onScroll = function () {
  //   console.log("scroll open");
  // };

  // FE here
  if (document.querySelector(".login__slider")) {
    swiper = new Swiper(".login__slider", {
      effect: "slide",
      loop: false,
      speed: speed,
      disableOnInteraction: true,
      pauseOnMouseEnter: true,
      slidesPerView: 1,
      spaceBetween: 10,
      watchOverflow: true,
      initialSlide: 0,
      allowTouchMove: false,
      on: {
        init: function () {},
        slideChange: function () {},
        transitionStart: function () {},
        transitionEnd: function () {},
        resize: function () {},
      },
    });
    swiper.update();
  }



  // BE here
  // OTP Checking
  $(document).on("input", ".otp__list input", function () {
    numberInput(this);
    $(".otp__error").removeClass("invalid");
    $(".otp__list").removeClass("invalid");

    if ($(this).val().length == this.maxLength) {
      $(this).next("input").focus();
    }

    if (otpValid()) {
      $(".otp__list").addClass("valid");
      otpCountValue = 60;
      countOtp();

      // Send OTP
      sendOTP(currentPhone);
      
      // BE close this
      scrollTop();
      swiper.slideTo(2, speed, null);
      common.openPopup('#popCool');

    } else {
      $(".otp__list").removeClass("valid");
    }
  });

  // Login checking
  $("#lg_name, #lg_phone, #lg_email")
    .focus(function (e) {
      $(this).parent().removeClass("show__error");
    })
    .focusout(function (e) {
      loginValid();
  });

  $("#lg_name, #lg_phone, #lg_email").on("input", function () {
    if ($(this).val() !== "") {
      loginValid();
    }
  });

  // Login
  $(document).on("click", "#loginSubmit", function () {
    // OTP Step
    scrollTop();
    swiper.slideTo(1, speed, null);
  });

  // Backto home
  $(document).on('click', '.master__back__home a', function(){
    // Giả lập save voted to Localstrage and redirect to index
    localStorage.setItem("voted", true);
    window.location = 'index.html';

  });

  // See Chart [ this case show Ranking Lit]
  $(document).on('click', '#btnSeeChart', function(){
    common.openPopup('#popRanking');
    
  });
  
  
  // Open Share Popup
  $(document).on("click", ".master__share-but", function () {
    common.openPopup('#popShare');
  });

  
  // Close Popup
  $(document).on("click", ".popup-close", function () {
    common.closePopup();
  });

  
  

})();
