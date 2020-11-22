/**
 * Copyright 2020 John McLear <john@mclear.co.uk>
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
const log4js = require('ep_etherpad-lite/node_modules/log4js');
const statsLogger = log4js.getLogger('stats');
const eejs = require('ep_etherpad-lite/node/eejs/');
const settings = require('ep_etherpad-lite/node/utils/Settings');
const stats = require('ep_etherpad-lite/node/stats');

exports.clientVars = function (hook, context, callback) {
  if (!settings.ep_author_follow) settings.ep_author_follow = {};
  return callback({
    ep_author_follow: {
      followAll: settings.ep_author_follow.followAll || false,
      enableFollow: settings.ep_author_follow.enableFollow || true,
    },
  });
};

exports.eejsBlock_mySettings = function (hook, context, callback) {
  if (!settings.ep_author_follow) settings.ep_author_follow = {};
  context.content += eejs.require('ep_author_follow/templates/settings.ejs', {
    followAll: settings.ep_author_follow.followAll || false,
    enableFollow: settings.ep_author_follow.enableFollow || true,
  });
  callback();
};

exports.eejsBlock_styles = function (hook_name, args, cb) {
  args.content += eejs.require('ep_author_follow/templates/styles.html', {}, module);
  return cb();
};
