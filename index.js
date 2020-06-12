// vim: et:ts=2:sw=2:sts=2:ft=javascript
/**
 * Copyright 2013 j <j@mailb.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var log4js = require('ep_etherpad-lite/node_modules/log4js')
var statsLogger = log4js.getLogger("stats");
var eejs = require('ep_etherpad-lite/node/eejs/');
var settings = require('ep_etherpad-lite/node/utils/Settings');
var sessioninfos = require('ep_etherpad-lite/node/handler/PadMessageHandler').sessioninfos;
var stats = require('ep_etherpad-lite/node/stats')
var socketio;

/**
 * Handles an RTC Message
 * @param client the client that send this message
 * @param message the message from the client
 */
function handleRTCMessage(client, payload)
{
  var userId = sessioninfos[client.id].author;
  var to = payload.to;
  var padId = sessioninfos[client.id].padId;
  var room = socketio.sockets.adapter.rooms[padId];
  var clients = [];

  if (room && room.sockets) {
    for (var id in room.sockets) {
      clients.push(socketio.sockets.sockets[id]);
    }
  }

  var msg = {
    type: "COLLABROOM",
    data: {
      type: "RTC_MESSAGE",
      payload: {
        from: userId,
        data: payload.data
      }
    }
  };
  // Lookup recipient and send message
  for(var i = 0; i < clients.length; i++) {
    var session = sessioninfos[clients[i].id];
    if(session && session.author == to) {
      clients[i].json.send(msg);
      break;
    }
  }
}

// Make sure any updates to this are reflected in README
const statErrorNames = [
  "Abort",
  "Hardware",
  "NotFound",
  "NotSupported",
  "Permission",
  "SecureConnection",
  "Unknown"
]

function handleErrorStatMessage(statName) {
  if (statErrorNames.indexOf(statName) !== -1) {
    stats.meter("ep_author_follow_err_" + statName).mark();
  } else {
    statsLogger.warn("Invalid ep_author_follow error stat: " + statName);
  }
}

exports.clientVars = function(hook, context, callback)
{
  if(!settings.ep_author_follow) settings.ep_author_follow = {};
  return callback({
    ep_author_follow: {
      followAll: settings.ep_author_follow.followAll || false,
      enableFollow: settings.ep_author_follow.enableFollow || true
    }
  });
};

exports.eejsBlock_mySettings = function (hook, context, callback)
{
  if(!settings.ep_author_follow) settings.ep_author_follow = {};
  console.warn(settings.ep_author_follow)
  context.content += eejs.require('ep_author_follow/templates/settings.ejs', {
    followAll : settings.ep_author_follow.followAll || false,
    enableFollow : settings.ep_author_follow.enableFollow || true
  });
  callback();
};

exports.eejsBlock_styles = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_author_follow/templates/styles.html", {}, module);
  return cb();
};
