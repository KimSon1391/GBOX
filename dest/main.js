$(document).ready(function () {
  //project tag
  let projectTag = $(".project__tag li");
  let projectTagItem = $(".project__wrap");
  projectTag.click(function () {
    projectTag.removeClass("active");
    $(this).addClass("active");

    let projectTagIndex = $(this).index();
    let projectTagItemIndex = projectTagItem.eq(projectTagIndex);

    projectTagItem.removeClass("active");
    projectTagItemIndex.addClass("active");
  });

  // rental tag
  let rentalTag = $(".rental__tag-item");
  let rentalTagItem = $(".rental__tab .yellowtag .number");
  rentalTag.click(function () {
    rentalTag.removeClass("active");
    $(this).addClass("active");

    let rentalTagIndex = $(this).index() + 1;
    rentalTagItem.text(rentalTagIndex.toString().padStart(2, 0));
  });

  //Back to top
  let header = $(".header");
  let backTopFooter = $(".backtotop-footer");
  let backtotop = $(".backtotop");
  backTopFooter.click(function () {
    $(window).scrollTop(0);
  });
  backtotop.click(function () {
    $(window).scrollTop(0);
  });
  $(window).scroll(function () {
    let scrollY = $(window).scrollTop();
    if (scrollY > header.outerHeight()) {
      backtotop.addClass("active");
    } else {
      backtotop.removeClass("active");
    }
  });

  // book button hover
  let bookBtn = $(".book__btn");
  bookBtn.hover(function () {
    $(".book__txt").toggleClass("transform");
    $(".book__arrow").toggleClass("active");
  });

  //loading
  $(window).on("load", function () {
    // loading page
    $(".loading").removeClass("active");

    //change color SVG
    $(".svg").svgToInline();

    // photoswipe lib
    initPhotoSwipeFromDOM(".cafe__gallery-wrap");

    // AOS animation
    AOS.init({
      duration: 1500,
    });

    //menu and button nav
    function removeNav() {
      btnmenu.removeClass("tranform");
      navMenu.removeClass("active");
      $(".bgopacity").removeClass("active");
    }
    function showNavBtn() {
      let windowWidth = $(window).width();
      if (windowWidth < 768) {
        btnmenu.addClass("active");
      } else {
        btnmenu.removeClass("active");
        removeNav();
      }
    }

    let btnmenu = $(".btnmenu");
    let navMenu = $(".nav");

    showNavBtn();

    $(window).resize(function () {
      showNavBtn();
    });

    btnmenu.click(function (e) {
      e.stopPropagation();
      navMenu.toggleClass("active");
      $(this).toggleClass("tranform");
      $(".bgopacity").toggleClass("active");
    });

    $(document).click(function (e) {
      removeNav();
    });

    $(document).scroll(function (e) {
      removeNav();
    });
  });
});

//  studio Detail slider
let $carousel = $(".studio__detail-top-wrap");
$carousel.flickity({
  //Options
  cellAlign: "left",
  contain: true,
  wrapAround: true,
  prevNextButtons: false,
  pageDots: false,
  autoPlay: true,
  friction: 0.6,
  on: {
    change: function (index) {
      let number = $(".yellowtag .number");
      let indexSlider = index + 1;
      number.text(indexSlider.toString().padStart(2, 0));
    },
  },
});
let preBtn = $(".prebtn");
let nextBtn = $(".nextbtn");
preBtn.on("click", function () {
  $carousel.flickity("previous");
});
nextBtn.on("click", function () {
  $carousel.flickity("next");
});

//  cafe slider

//Gallery Photo Swiper
var initPhotoSwipeFromDOM = function (gallerySelector) {
  var parseThumbnailElements = function (el) {
    var thumbElements = el.childNodes,
      numNodes = thumbElements.length,
      items = [],
      figureEl,
      linkEl,
      size,
      item;
    for (var i = 0; i < numNodes; i++) {
      figureEl = thumbElements[i]; // <figure> element
      if (figureEl.nodeType !== 1) {
        continue;
      }
      linkEl = figureEl.children[0]; // <a> element
      size = linkEl.getAttribute("data-size").split("x");
      item = {
        src: linkEl.getAttribute("href"),
        w: parseInt(size[0], 10),
        h: parseInt(size[1], 10),
      };
      if (figureEl.children.length > 1) {
        item.title = figureEl.children[1].innerHTML;
      }
      if (linkEl.children.length > 0) {
        // <img> thumbnail element, retrieving thumbnail url
        item.msrc = linkEl.children[0].getAttribute("src");
      }
      item.el = figureEl; // save link to element for getThumbBoundsFn
      items.push(item);
    }
    return items;
  };
  var closest = function closest(el, fn) {
    return el && (fn(el) ? el : closest(el.parentNode, fn));
  };
  var onThumbnailsClick = function (e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    var eTarget = e.target || e.srcElement;
    var clickedListItem = closest(eTarget, function (el) {
      return el.tagName && el.tagName.toUpperCase() === "FIGURE";
    });
    if (!clickedListItem) {
      return;
    }
    var clickedGallery = clickedListItem.parentNode,
      childNodes = clickedListItem.parentNode.childNodes,
      numChildNodes = childNodes.length,
      nodeIndex = 0,
      index;
    for (var i = 0; i < numChildNodes; i++) {
      if (childNodes[i].nodeType !== 1) {
        continue;
      }
      if (childNodes[i] === clickedListItem) {
        index = nodeIndex;
        break;
      }
      nodeIndex++;
    }
    if (index >= 0) {
      openPhotoSwipe(index, clickedGallery);
    }
    return false;
  };
  var photoswipeParseHash = function () {
    var hash = window.location.hash.substring(1),
      params = {};
    if (hash.length < 5) {
      return params;
    }
    var vars = hash.split("&");
    for (var i = 0; i < vars.length; i++) {
      if (!vars[i]) {
        continue;
      }
      var pair = vars[i].split("=");
      if (pair.length < 2) {
        continue;
      }
      params[pair[0]] = pair[1];
    }
    if (params.gid) {
      params.gid = parseInt(params.gid, 10);
    }
    return params;
  };
  var openPhotoSwipe = function (
    index,
    galleryElement,
    disableAnimation,
    fromURL
  ) {
    var pswpElement = document.querySelectorAll(".pswp")[0],
      gallery,
      options,
      items;
    items = parseThumbnailElements(galleryElement);
    options = {
      galleryUID: galleryElement.getAttribute("data-pswp-uid"),
      getThumbBoundsFn: function (index) {
        var thumbnail = items[index].el.getElementsByTagName("img")[0], // find thumbnail
          pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop,
          rect = thumbnail.getBoundingClientRect();

        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
      },
      showAnimationDuration: 0,
      hideAnimationDuration: 0,
    };
    if (fromURL) {
      if (options.galleryPIDs) {
        for (var j = 0; j < items.length; j++) {
          if (items[j].pid == index) {
            options.index = j;
            break;
          }
        }
      } else {
        options.index = parseInt(index, 10) - 1;
      }
    } else {
      options.index = parseInt(index, 10);
    }
    if (isNaN(options.index)) {
      return;
    }
    if (disableAnimation) {
      options.showAnimationDuration = 0;
    }
    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
  };
  var galleryElements = document.querySelectorAll(gallerySelector);
  for (var i = 0, l = galleryElements.length; i < l; i++) {
    galleryElements[i].setAttribute("data-pswp-uid", i + 1);
    galleryElements[i].onclick = onThumbnailsClick;
  }
  var hashData = photoswipeParseHash();
  if (hashData.pid && hashData.gid) {
    openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
  }
};
