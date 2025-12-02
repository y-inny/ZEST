/* ============================================================
   통합 스크립트 – visual / sec2 / sec3 / sns
   모든 기능 독립 구조, 충돌 없음
   ============================================================ */

$(function () {

  /* ===============================
     1) VISUAL 페이드 슬라이더
  =============================== */
  const $imgs = $(".visual_bg");
  const $dots = $(".visual_indicator span");

  let current = 0;
  const fadeSpeed = 1400;   // 1.4초
  const delay = 2800;       // 다음 이동까지 대기 시간

  function showImage(index) {
    $imgs.removeClass("active");
    $imgs.eq(index).addClass("active");

    $dots.removeClass("active");
    $dots.eq(index).addClass("active");

    current = index;
  }

  function nextImage() {
    let next = (current + 1) % $imgs.length;
    showImage(next);
  }

  // 자동 슬라이드
  let visualTimer = setInterval(nextImage, fadeSpeed + delay);

  // 인디케이터 클릭
  $dots.on("click", function () {
    let idx = $(this).data("index");
    clearInterval(visualTimer);
    showImage(idx);
    visualTimer = setInterval(nextImage, fadeSpeed + delay);
  });

  showImage(0);


  /* ============================================================
     2) sec2 – 좌측 카테고리 클릭 시 우측 탭 전환
  ============================================================ */
  function sec2Tabs() {
    if ($('.category_list').length === 0) return;

    $('.category_list li a').on('click', function (e) {
      e.preventDefault();
      const target = $(this).data('target');

      $('.category_list li, .category_list li a').removeClass('active');
      $(this).parent().addClass('active');
      $(this).addClass('active');

      $('.tab-pane').removeClass('active');
      $('#' + target).addClass('active');
    });
  }


  /* ============================================================
     3) sec3 – 버튼 + 리스트 + 콘텐츠 3중 연동 탭 + 이미지 애니메이션
  ============================================================ */
  function sec3Tabs() {
    if ($('.sec3_tab-pane').length === 0) return;

    function changeTab(targetId) {
      $('.sec3_tab-pane').removeClass('active');
      $('#' + targetId).addClass('active');

      $('.test_list li').removeClass('active');
      $('.test_list li a[data-target="' + targetId + '"]').parent().addClass('active');

      // sec3_tab3 이미지 + 결과 이름 샤르륵
      if (targetId === 'sec3_tab3') {
        const $imgWrap = $('#sec3_tab3 .test_page_03_img_wrap');
        const $resultName = $('#sec3_tab3 .test_result_name');

        // 초기값
        $imgWrap.css('opacity', 0);
        $resultName.css('opacity', 0);

        // 트리거
        setTimeout(() => {
          $imgWrap.css('opacity', 1);
          $resultName.css('opacity', 1);
        }, 50); // transition 트리거
      }

      // 다른 탭이면 opacity 0
      else {
        $('#sec3_tab3 .test_page_03_img_wrap').css('opacity', 0);
        $('#sec3_tab3 .test_result_name').css('opacity', 0);
      }

      // sec3_tab2 → 4초 뒤 자동 sec3_tab3 이동
      if (targetId === 'sec3_tab2') {
        setTimeout(() => {
          changeTab('sec3_tab3');
        }, 4000);
      }
    }

    $('.test_btn_wrap li a').on('click', function (e) {
      e.preventDefault();
      changeTab('sec3_tab2');
    });

    $('.test_list li a[data-target]').on('click', function (e) {
      e.preventDefault();
      const t = $(this).data('target');
      changeTab(t);
    });

    changeTab('sec3_tab1');
  }


  /* ============================================================
     SNS 무한 슬라이드 (자동 + 버튼) – section4
  ============================================================ */
  function snsSlider() {
    const $wrap = $('.sns_img_wrap');
    const $slider = $wrap.find('.sns_img');
    if ($slider.length === 0) return;

    let $items = $slider.children('li');
    const itemW = $items.eq(0).outerWidth();
    const gap = 40; // HTML/CSS 간격에 맞춰 조정
    const step = itemW + gap;

    // 1회 복제 → 시각적 무한 슬라이드
    $slider.append($items.clone());
    $items = $slider.children('li');

    let pos = 0;
    let snsTimer;

    function moveNext() {
      pos -= step;
      $slider.css('transition', 'transform 0.6s ease');
      $slider.css('transform', `translateX(${pos}px)`);

      if (Math.abs(pos) >= step * ($items.length / 2)) {
        setTimeout(() => {
          pos = 0;
          $slider.css('transition', 'none');
          $slider.css('transform', `translateX(${pos}px)`);
          setTimeout(() => $slider.css('transition', 'transform 0.6s ease'), 20);
        }, 610); // transition 끝난 뒤 초기화
      }
    }

    function movePrev() {
      pos += step;
      $slider.css('transition', 'transform 0.6s ease');
      $slider.css('transform', `translateX(${pos}px)`);

      if (pos > 0) {
        pos = -step * ($items.length / 2);
        $slider.css('transition', 'none');
        $slider.css('transform', `translateX(${pos}px)`);
        setTimeout(() => $slider.css('transition', 'transform 0.6s ease'), 20);
      }
    }

    function auto() {
      snsTimer = setInterval(moveNext, 2500);
    }

    auto(); // 자동 시작

    // 버튼 이벤트
    $wrap.find('.btn.prev').on('click', function () {
      clearInterval(snsTimer);
      movePrev();
      auto();
    });

    $wrap.find('.btn.next').on('click', function () {
      clearInterval(snsTimer);
      moveNext();
      auto();
    });
  }



  /* ============================================================
     실행
  ============================================================ */
  sec2Tabs();
  sec3Tabs();
  snsSlider();

});

/* ============================================================
   5) GNB – 부드러운 스크롤 이동
============================================================ */
$('.gnb li a').on('click', function (e) {
  e.preventDefault();

  const target = $(this).attr('href');
  const $target = $(target);

  if ($target.length) {
    $('html, body').animate(
      { scrollTop: $target.offset().top },
      800, // 스크롤 시간 (0.8s)
      'swing'
    );
  }
});

/* ============================================================
 6) 스크롤시 버튼 나타남 + TOP 이동
============================================================ */
const $btn1 = $('.btn_1');
const $btn2 = $('.btn_2');

$(window).on('scroll', function () {
  const scrollTop = $(this).scrollTop();

  if (scrollTop > 400) {
    $btn1.addClass('btn_visible');
    $btn2.addClass('btn_visible');
  } else {
    $btn1.removeClass('btn_visible');
    $btn2.removeClass('btn_visible');
  }
});

// TOP 버튼 클릭 → 부드러운 스크롤
$('.btn_2 a').on('click', function (e) {
  e.preventDefault();

  $('html, body').animate(
    { scrollTop: 0 },
    800,
    'swing'
  );
});

// gnb 스크립트
$(document).ready(function () {
    $('.gnb li').on('mouseenter', function () {

        const link = $(this).find('a');
        const bar = $('.gnb_bar');

        const width = link.outerWidth();
        const left = link.offset().left - $('.gnb_wrap').offset().left;

        bar.css({
            width: width,
            left: left,
            opacity: 1
        });
    });

    $('.gnb_wrap').on('mouseleave', function () {
        $('.gnb_bar').css({
            opacity: 0
        });
    });
});



