if(window.matchMedia('(min-width: 728px)').matches) {
  CN.site.name = 'wiredcom.dart';
} else {
// CN.site.name = 'wired.mobile.dart';
// Mobile ads not working. Trying normal ad server.
  CN.site.name = 'wiredcom.dart';
}
