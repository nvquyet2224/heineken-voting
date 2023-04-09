var swiper;
var common;
var speed = 700;

var timerOtp;
var otpCountValue = 60;
var currentPhone = "0902572962";

var btnTimer = 600;

var hasOTP = true;
var doneFlow = false;

function scrollTop() {
  $("html, body").scrollTop(0);
}

function change_alias(alias) {
  var str = alias;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  str = str.replace(/ + /g, " ");
  str = str.trim();
  return str;
}

// Login
function countOtp() {
  $(".times").removeClass("isRetry");
  timerOtp = setInterval(function () {
    var minSecond = otpCountValue < 10 ? "0" + otpCountValue : otpCountValue;
    document.querySelector(".time__count").innerHTML = minSecond;
    otpCountValue--;
    if (otpCountValue < 0) {
      clearInterval(timerOtp);
      $(".times").addClass("isRetry");
    }
  }, 1000);
}

// Request OTP
$(document).on("click", ".times", function () {
  if ($(this).hasClass("isRetry")) {
    otpCountValue = 60;
    countOtp();
  }
});

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
  if (email === "") {
    return true;
  } else {
    if (!/^\S*$/.test(email)) {
      return false;
    }
  }
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

function validSelect(byThis) {
  var result = true;
  if ($(byThis).find(".select__input").val() === "") {
    result = false;
  }
  return result;
}

function validSpace(byThis) {
  var result = true;
  var value = $(byThis).val();
  if (value === "") {
    result = false;
  } else if (value !== "") {
    if (/^\S*$/.test(value)) {
      result = true;
    } else {
      result = false;
    }
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
        $(".times").removeClass("isRetry");

        if ($(".loading__box").hasClass("active")) {
          $(".loading__box").removeClass("active");
        }
        $(".your-phone").html("+84 " + currentPhone);

        // add valid to show otp error
        $(".otp__list, .otp__error, .otp__message").removeClass("invalid");
        $(".otp__list, .otp__message").addClass("valid");

        // Goto Completed step
        scrollTop();
        swiper.slideTo(3, speed, null);
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

var username = false,
  cmnd = false,
  city = false,
  dicstrict = false,
  ward = false,
  address = false,
  phone = false,
  email = false,
  chkCtn = false,
  chkPrivacy = false;

// Dùng để active button
function loginValid() {
  username = validText("#lg_name");
  cmnd = validText("#coolIdNumber");
  city = validSelect("#slCity");
  dicstrict = validSelect("#slDicstrict");
  ward = validSelect("#slWard");
  address = validText("#lg_address");

  phone = validSpace("#lg_phone");

  email = validEmail("#lg_email");
  if ($("#lg_email").val() === "") {
    email = true;
  }

  chkCtn = $("#chkCondition").is(":checked") ? true : false;
  chkPrivacy = $("#chkPrivacy").is(":checked") ? true : false;

  if (
    username &&
    cmnd &&
    city &&
    dicstrict &&
    ward &&
    address &&
    phone &&
    email &&
    chkCtn &&
    chkPrivacy
  ) {
    $("#loginSubmit").attr("disabled", false);
  } else {
    $("#loginSubmit").attr("disabled", true);
  }
}

// Backhome --> go to first step and refresh all
$(document).on("click", ".master__back__home a", function () {
  common.closePopup();
  scrollTop();
  swiper.slideTo(0, speed, null);
});

function inputHolder() {
  $(document).on("click", ".error", function () {
    $(this).parent().removeClass("show__error");
    $(this).parent().find("input").focus();
  });

  $(".form-group .input-txt")
    .focus(function (e) {
      $(this).parent().removeClass("show__error");
    })
    .focusout(function (e) {
      // Login Valid dùng để hide or show error
      if ($(this).attr("id") === "lg_name") {
        username = validText("#lg_name");
        if (username) {
          $("#lg_name").parent().removeClass("show__error");
        } else {
          $("#lg_name").parent().addClass("show__error");
        }
      }
      if ($(this).attr("id") === "lg_cmnd") {
        cmnd = validText("#lg_cmnd");
        if (cmnd) {
          $("#lg_cmnd").parent().removeClass("show__error");
        } else {
          $("#lg_cmnd").parent().addClass("show__error");
        }
      }
      if ($(this).attr("id") === "lg_phone") {
        phone = validSpace("#lg_phone");
        if (phone) {
          $("#lg_phone").parent().removeClass("show__error");
        } else {
          $("#lg_phone").parent().addClass("show__error");
        }
      }
      if ($(this).attr("id") === "lg_email") {
        email = validEmail("#lg_email");
        if (email) {
          $("#lg_email").parent().removeClass("show__error");
        } else {
          $("#lg_email").parent().addClass("show__error");
        }
      }
      loginValid();

    });

  $(".form-group .input-txt").on("input", function () {
    // Login
    loginValid();
  });

  // Check Login valid
  $("#chkCondition, #chkPrivacy").change(function () {
    if ($(this).attr("id") === "chkCondition") {
      chkCtn = $("#chkCondition").is(":checked") ? true : false;
      if (chkCtn) {
        $("#chkCondition").removeClass("chk__error");
      } else {
        $("#chkCondition").addClass("chk__error");
      }
    }
    if ($(this).attr("id") === "chkPrivacy") {
      chkPrivacy = $("#chkPrivacy").is(":checked") ? true : false;
      if (chkPrivacy) {
        $("#chkPrivacy").removeClass("chk__error");
      } else {
        $("#chkPrivacy").addClass("chk__error");
      }
    }
    loginValid();
  });
}

$(document).on("click", ".select__header", function (e) {
  var box = $(this).parent();
  if (box.hasClass("open__select")) {
    box.removeClass("open__select");
  } else {
    $(".select").removeClass("open__select");
    box.addClass("open__select");
  }
});

$(document).on("click", ".select__box li", function (e) {
  var that = $(this);
  var box = $(this).parent().parent().parent();

  box.find("li").removeClass("selected");
  that.addClass("selected");
  box.removeClass("open__select");

  box.find(".select__input").val(that.text());
  box.find("li").removeClass("hide");
  box.parent().removeClass("show__error");
  loginValid();
});

$(document).on("keyup", ".select__input", function (e) {
  e.stopPropagation();
  var that = $(this);

  var text_search = change_alias(that.val());
  var box = $(this).parent().parent();
  var list = box.find("ul");
  box.addClass("open__select");

  if (e.keyCode == 13) {
    e.preventDefault();

    if (box.find("li.selected").length) {
      that.val(box.find("li.selected").text());
      box.removeClass("open__select");
      box.find("li").removeClass("hide");
      box.parent().removeClass("show__error");
      loginValid();
    }

    that.blur();
  } else if (e.keyCode == 38) {
    e.preventDefault();
    var prev = box.find("li.selected").prevAll("li").not(".hide").first();
    if (prev.length) {
      box.find("li").removeClass("selected");
      prev.addClass("selected");
      var top = list.scrollTop();
      list.scrollTop(top - 30);
    } else {
      list.scrollTop(0);
      box.find("li").removeClass("selected");
      box.find("li:first-child").addClass("selected");
    }

    return false;
  } else if (e.keyCode == 40) {
    e.preventDefault();
    var next = box.find("li.selected").nextAll("li").not(".hide").first();
    if (next.length) {
      box.find("li").removeClass("selected");
      next.addClass("selected");
      var top = list.scrollTop();
      list.scrollTop(top + 30);
    } else {
      list.scrollTop(0);
      box.find("li").removeClass("selected");
      box.find("li:first-child").addClass("selected");
    }
    return false;
  } else {
    if (text_search == "") {
      console.log(text_search);
      box.find("li").removeClass("hide").removeClass("selected");
      $(list).scrollTop(0);
    } else {
      box.find("li").removeClass("selected");
      box.find("li").each(function () {
        var text = change_alias($(this).text());
        if (text.indexOf(text_search) > -1) {
          $(this).removeClass("hide");
          box.find("li:not(.hide)").first().addClass("selected");
        } else {
          $(this).addClass("hide");
        }
      });
    }
  }
});

(function () {
  const modules = Lib.modules;
  const Swiper = modules.Swiper;

  common = new modules.Common();
  common.init();

  if (document.querySelector(".voting__slider")) {
    swiper = new Swiper(".voting__slider", {
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
      autoHeight: true,
      on: {
        init: function () { },
        slideChange: function () { },
        transitionStart: function () { },
        transitionEnd: function () { },
        resize: function () { },
      },
    });
    swiper.update();
  }

  // Next step
  $(document).on("click", ".master__nav__next", function () {
    if (!$(this).hasClass("disabled")) {
      scrollTop();
      var index = +$(this).attr("data-next");
      swiper.slideTo(index, speed, null);
    }
  });

  // Prev Step
  $(document).on("click", ".master__nav__prev", function () {
    if (!$(this).hasClass("disabled")) {
      scrollTop();
      var index = +$(this).attr("data-next");
      swiper.slideTo(index, speed, null);
    }
  });

  // Hunter Now
  $(document).on("click", "#btnHunterNow", function () {
    setTimeout(function () {
      scrollTop();
      swiper.slideTo(1, speed, null);
    }, btnTimer);
  });

  // Open Share Popup
  $(document).on("click", ".master__share-but", function () {
    common.openPopup("#popShare");
  });

  // Retry from error popup
  $(document).on("click", "#btnRetry", function () {
    setTimeout(function () {
      common.closePopup();
    }, btnTimer);
  });

  // Close Popup
  $(document).on("click", ".popup-close", function () {
    common.closePopup();
  });

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

      // Send OTP
      sendOTP(currentPhone);

      // BE close this
      scrollTop();
      swiper.slideTo(3, speed, null);

      //common.openPopup("#popCool");
    } else {
      $(".otp__list").removeClass("valid");
    }
  });

  // Valid form
  inputHolder();

  // Login
  $(document).on("click", "#loginSubmit", function () {
    setTimeout(function () {

      // Fake hasOTP == true --> goto OTP step
      if(hasOTP) {
        // OTP Step
        scrollTop();
        swiper.slideTo(2, speed, null);
        // Count OTP
        countOtp();
      } else {
        // Fake doneFlow
        // false --> error popup
        // true --> goto done step
        if(doneFlow) {
          scrollTop();
          swiper.slideTo(3, speed, null);
        } else {
          common.openPopup('#popError');
        }
      }
      
    }, btnTimer);
  });

  //Close any Tooltip when click out
  $(document).on("click touchstart", function (event) {
    if (
      $(".select").has(event.target).length == 0 &&
      !$(".select").is(event.target)
    ) {
      if ($(".select.open__select").length > 0) {
        if ($(".select.open__select").attr("id") === "slCity") {
          city = validSelect("#slCity");
          if (city) {
            $("#slCity").parent().removeClass("show__error");
          } else {
            $("#slCity").parent().addClass("show__error");
          }
        }
        if ($(".select.open__select").attr("id") === "slDicstrict") {
          dicstrict = validSelect("#slDicstrict");
          if (dicstrict) {
            $("#slDicstrict").parent().removeClass("show__error");
          } else {
            $("#slDicstrict").parent().addClass("show__error");
          }
        }
        if ($(".select.open__select").attr("id") === "slWard") {
          ward = validSelect("#slWard");
          if (ward) {
            $("#slWard").parent().removeClass("show__error");
          } else {
            $("#slWard").parent().addClass("show__error");
          }
        }
        loginValid();
      }
      $(".select").removeClass("open__select");
    }
  });

})();
