class Common {
  constructor() {
    console.log('>>> Common constructor');
    Common.fixedI10();
    Common.disableZoomGesture();
  }

  static fixedI10() {
    console.log('fixedI10');
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
      const msViewportStyle = document.createElement('style');
      msViewportStyle.appendChild(
        document.createTextNode('@-ms-viewport{width:auto!important}'),
      );
      document.querySelector('head').appendChild(msViewportStyle);
    }
  }

  static disableZoomGesture() {
    console.log('disableZoomGesture');
    document.addEventListener('gesturestart', function (e) {
      e.preventDefault();
    });
  }
}

export default Common;
