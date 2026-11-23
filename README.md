# Armor web test fixtures

Practice targets for Scripture Armor's full web test (the release-blocker lane).

- `bad.html?run=1` — loads `bad.js` from a third-party script host (jsDelivr). The script sends data to a third host, injects `stage2.js`, submits a form off-site, and reaches for the local network. Expected result: PROVEN findings for the send, the injection, and the form; a SHIELDED finding for the local-network reach (the cell blocks it); the third-party script named in the census.
- `clean.html` — loads one same-host script and does nothing else. Expected result: no findings.

Without `?run=1`, the bad page is inert text. Nothing in this repo is a real payload; every behavior is a labeled test act against public fixture endpoints.
