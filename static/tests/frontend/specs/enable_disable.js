'use strict';

describe('enable and disable author follow', function () {
  beforeEach(function (cb) {
    // Make sure webrtc is disabled, and reload with the firefox fake webrtc pref
    // (Chrome needs a CLI parameter to have fake webrtc)
    helper.newPad(cb);
    this.timeout(60000);
  });

  it('disables author follow if the user uses the checkbox', function (done) {
    const chrome$ = helper.padChrome$;
    const $cb = chrome$('#options-enableFollow');
    expect($cb.prop('checked')).to.be(true);
    expect(chrome$.window.clientVars.ep_author_follow.enableFollow).to.be(true);
    $cb.click();

    expect($cb.prop('checked')).to.be(false);

    helper.waitFor(
        () => chrome$.window.clientVars.ep_author_follow.enableFollow === false, 1000).done(done);
  });

  it('enables author follow if the user uses the checkbox', function (done) {
    const chrome$ = helper.padChrome$;
    const $cb = chrome$('#options-enableFollow');
    expect($cb.prop('checked')).to.be(true);
    expect(chrome$.window.clientVars.ep_author_follow.enableFollow).to.be(true);
    $cb.click();
    $cb.click();
    expect($cb.prop('checked')).to.be(true);

    helper.waitFor(
        () => chrome$.window.clientVars.ep_author_follow.enableFollow === true, 1000).done(done);
  });
});
