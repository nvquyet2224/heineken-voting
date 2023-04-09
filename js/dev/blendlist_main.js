var voted = false;
var swiper;
var common;
var speed = 700;

var btnTimer = 600;

function scrollTop() {
  $("html, body").scrollTop(0);
}

(function () {
  const modules = Lib.modules;
  const Swiper = modules.Swiper;

  common = new modules.Common();
  common.init();

  function setSlideItem() {
    if (document.querySelector(".itemSlider") !== null) {
      var swiperItem = new Swiper(".itemSlider", {
        slidesPerView: 6.2,
        grid: {
          rows: 2,
        },
        spaceBetween: 0,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });
      swiperItem.update();
    }
  }

  function ajaxLoadBlend(url) {
    $("#ajaxResult").html("");
    $(".loading__box").addClass("active");
    $("#ajaxResult").removeClass("active");
    $("#ajaxResult").removeClass("flex__center");
    $.ajax({
      type: "GET",
      url: url,
      success: function (data) {
        $("#ajaxResult").html(data);
        setTimeout(function () {
          if ($("#ajaxResult .swiper-slide").length <= 12) {
            $("#ajaxResult").addClass("flex__center");
          }
          setSlideItem();
          var popH = $(".blendlist__step2 .item-content").innerHeight();
          $(".blendlist__step2 .slide-item").css({ "min-height": popH + "px" });
          $(".loading__box").removeClass("active");
          $("#ajaxResult").addClass("active");
        }, 500);
      },
      error: function (err) {
        $(".loading__box").removeClass("active");
        $("#ajaxResult").addClass("active");
      },
    });
  }

  if (document.querySelector(".blendlist__slider")) {
    swiper = new Swiper(".blendlist__slider", {
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

    setTimeout(() => {
      setSlideItem();
    }, 300);
  }

  // Choose Category item
  $(document).on("click", ".master__cate--item", function () {
    $(this).toggleClass("current");
    if ($(".blendlist__cate .master__cate--item.current").length > 0) {
      $("#btnRefreshCategory").attr("disabled", false);
    } else {
      $("#btnRefreshCategory").attr("disabled", true);
    }
  });

  // Refresh Category item
  $(document).on("click", "#btnRefreshCategory", function () {
    $("#blendCateTitle").html($(this).attr("data-title"));

    setTimeout(function () {
      $(".blendlist__step2").removeClass("bg3");
      $(".blendlist__step2").addClass("bg2");
      //$("#blendCateTitle").html($(this).attr("data-title"));

      if ($(".blendlist__step1 .master__cate--item.current").length > 0) {
        scrollTop();
        swiper.slideTo(1, speed, null);
        // Load Ajax dummy
        ajaxLoadBlend("blend-cate.html");
      }
    }, btnTimer);
  });

  // Goto Category List
  $(document).on("click", "#btnCateList", function () {
    $("#blendCateTitle").html($(this).attr("data-title"));

    setTimeout(function () {
      $(".blendlist__step2").removeClass("bg2");
      $(".blendlist__step2").addClass("bg3");
      //$("#blendCateTitle").html($(this).attr("data-title"));

      scrollTop();
      swiper.slideTo(1, speed, null);
      // Load Ajax dummy
      ajaxLoadBlend("blend-all.html");
    }, btnTimer);
  });

  // Prev Step
  $(document).on("click", ".master__nav__prev", function () {
    if (!$(this).hasClass("disabled")) {
      $(".blendlist__step2 .slide-item").css({ "min-height": "auto" });
      scrollTop();
      var index = +$(this).attr("data-next");
      swiper.slideTo(index, speed, null);
    }
  });
})();
