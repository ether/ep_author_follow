// Copyright John McLear - Etherpad Foundation 2020, Apache2.
var padcookie = require("ep_etherpad-lite/static/js/pad_cookie").padcookie;
var hooks = require("ep_etherpad-lite/static/js/pluginfw/hooks");
var Changeset = require("ep_etherpad-lite/static/js/Changeset");

exports.postAceInit = function(){
  isEditingTimeout(); // updates the clientVars.ep_author_follow.isEditing value
  settingsListeners(); // enables listeners for settings
  loadSettings(); // loads settings from cookies
  appendUI(); // update the UI to show who we're following
}

exports.handleClientMessage_NEW_CHANGES = function(fnName, msg){

  // This current author is editing so don't move their focus!
  if(clientVars.ep_author_follow.isEditing) return;

  if(clientVars.ep_author_follow.enableFollow){
    var lineNumber = Changeset.opIterator(Changeset.unpack(msg.payload.changeset).ops).next().lines;
    var authorId = msg.payload.author;
    if(followingAuthor(authorId) || clientVars.ep_author_follow.followAll){
      goToLineNumber(lineNumber);
    }
  }
}

exports.handleClientMessage_ACCEPT_COMMIT = function(fnName, msg){
  clientVars.ep_author_follow.isEditing = true;
  clientVars.ep_author_follow.editingTimeout = setTimeout(function(){
    clientVars.ep_author_follow.isEditing = false;  
  }, 5000)
}

function appendUI(){
  $('body').on('click', '#otheruserstable > tbody > tr', function(){
   // already watching so stop watching
   var authorId = $(this).data("authorid");
   if(clientVars.ep_author_follow.following[authorId]){
     $(this).find("td > div").text("");
     unfollow(authorId);
   }else{
     follow(authorId);
     $(this).find("td > div").text("👁");
     $(this).find("td > div").css({"font-size":"12px","color":"#666","line-height":"17px","padding-left":"3px"});
   }
 });
}

function follow(authorId){
  clientVars.ep_author_follow.following[authorId] = true;
  padcookie.setPref("ep_author_follow.following", JSON.stringify(clientVars.ep_author_follow.following));
  updateFollowingUI();
}

function unfollow(authorId){
  delete clientVars.ep_author_follow.following[authorId];
  padcookie.setPref("ep_author_follow.following", JSON.stringify(clientVars.ep_author_follow.following));
  updateFollowingUI();
}

function followingAuthor(authorId){
  return clientVars.ep_author_follow.following[authorId];
}

function goToLineNumber(lineNumber){
  // Sets the Y scrolling of the browser to go to this line
  var $inner = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find('#innerdocbody');
  var $outerdoc = $('iframe[name="ace_outer"]').contents().find("#outerdocbody");
  var $outerdocHTML = $('iframe[name="ace_outer"]').contents().find("#outerdocbody").parent();
  var line = $inner.find("div:nth-child("+(lineNumber+1)+")");
  var newY = $(line)[0].offsetTop + "px";
  $outerdoc.css({top: newY +"px"}); // Chrome
  $outerdocHTML.animate({scrollTop: newY}); // needed for FF
}

function settingsListeners(){
  $('#options-followAll').on('change', function(){
    clientVars.ep_author_follow.followAll = !clientVars.ep_author_follow.followAll; // toggles.
    padcookie.setPref("ep_author_follow.followAll", $(this).prop("checked"));
    // if you enable follow All it will set enable to true
    if($(this).prop("checked")){
      clientVars.ep_author_follow.enableFollow = true;
      $('#options-enableFollow').prop("checked", true);
    }
    updateFollowingUI()
  });

  $('#options-enableFollow').on('click', function(){
    clientVars.ep_author_follow.enableFollow = !clientVars.ep_author_follow.enableFollow; // toggles.
    padcookie.setPref("ep_author_follow.enableFollow", $(this).prop("checked"));
  });
}

function loadSettings(){
  clientVars.ep_author_follow.following = {};

  if(padcookie.getPref("ep_author_follow.enableFollow")){
    clientVars.ep_author_follow.enableFollow = true;
    $('#options-enableFollow').prop("checked", true);
  }else{
    if(padcookie.getPref("ep_author_follow.enableFollow") === false){
      clientVars.ep_author_follow.enableFollow = false;
      $('#options-enableFollow').prop("checked", false);
    }
  }
  if(padcookie.getPref("ep_author_follow.followAll")){
    clientVars.ep_author_follow.followAll = true;
    $('#options-followAll').prop("checked", true);
  }else{
    if(padcookie.getPref("ep_author_follow.followAll") === false){
      clientVars.ep_author_follow.followAll = false;
      $('#options-followAll').prop("checked", false);
    }
  }
  if(padcookie.getPref("ep_author_follow.following")){
    clientVars.ep_author_follow.following = JSON.parse(padcookie.getPref("ep_author_follow.following"));
    updateFollowingUI();
  }

  // handle some bug where buttons dont show as on even if they are checked
  if(clientVars.ep_author_follow.followAll) $('#options-followAll').prop("checked", true);
  if(clientVars.ep_author_follow.enableFollow) $('#options-enableFollow').prop("checked", true);

}

function updateFollowingUI(){
  // For each person we're following add the eye in the users list.
  var userRows = $('#otheruserstable').contents().find("tr")
  $.each(userRows, function(){
    $(this).find("td > div").text("");
  });
  if(clientVars.ep_author_follow.followAll){
    var userRows = $('#otheruserstable').contents().find("tr")
    $.each(userRows, function(){
      $(this).find("td > div").text("👁");
      $(this).find("td > div").css({"font-size":"12px","color":"#666","line-height":"17px","padding-left":"3px"});
    });
  }else{
    $.each(clientVars.ep_author_follow.following, function(authorId){
      // find the authorId item..
      var userRow = $('#otheruserstable').contents().find("[data-authorid='"+authorId+"']")
      $(userRow).find("td > div").text("👁");
      $(userRow).find("td > div").css({"font-size":"12px","color":"#666","line-height":"17px","padding-left":"3px"});
    })
  }
}

function isEditingTimeout(){
  // on initial initialization of pad for 1 second don't drag my focus.
  clientVars.ep_author_follow.isEditing = true;
  clientVars.ep_author_follow.editingTimeout = setTimeout(function(){
    clientVars.ep_author_follow.isEditing = false;
  }, 1000)
}
