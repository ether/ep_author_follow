describe('enable and disable author follow', function() {
  context('author follow is disabled', function() {
    before(function(done) {
      // Make sure webrtc is disabled, and reload with the firefox fake webrtc pref
      // (Chrome needs a CLI parameter to have fake webrtc)
      helper.newPad({
        padPrefs: {},
        cb: done
      });
      this.timeout(60000);
    });

    it('disables author follow if the user uses the checkbox', function(done) {
      var chrome$ = helper.padChrome$;
      var $cb = chrome$("#options-enableFollow");
      expect($cb.prop("checked")).to.be(true)
      expect(clientVars.ep_author_follow.enableFollow).to.be(true);
      $cb.click();

      expect($cb.prop("checked")).to.be(false)

      helper.waitFor(function(){
        return clientVars.ep_author_follow.enableFollow === false;
      }, 1000).done(done);
    });
  });

  it('enables author follow if the user uses the checkbox', function(done) {
    var chrome$ = helper.padChrome$;
    var $cb = chrome$("#options-enableFollow");
    expect($cb.prop("checked")).to.be(true)
    expect(clientVars.ep_author_follow.enableFollow).to.be(true);
    $cb.click();
    $cb.click();
    expect($cb.prop("checked")).to.be(true)

    helper.waitFor(function(){
      return clientVars.ep_author_follow.enableFollow === true;
    }, 1000).done(done);
  });
});


});
