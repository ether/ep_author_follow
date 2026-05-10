'use strict';

const {template} = require('ep_plugin_helpers');

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
const settings = require('ep_etherpad-lite/node/utils/Settings');

// Single source of truth for the runtime configuration: defaults applied
// once on first read so both the client-vars hook and the settings template
// see the same values.
const getConfig = () => {
  const cfg = settings.ep_author_follow ||= {};
  if (typeof cfg.followAll === 'undefined') cfg.followAll = true;
  if (typeof cfg.enableFollow === 'undefined') cfg.enableFollow = true;
  return cfg;
};

exports.clientVars = (hook, context, callback) => {
  const {followAll, enableFollow} = getConfig();
  callback({ep_author_follow: {followAll, enableFollow}});
};

exports.eejsBlock_mySettings = template('ep_author_follow/templates/settings.ejs', {
  vars: () => {
    const {followAll, enableFollow} = getConfig();
    return {followAll, enableFollow};
  },
});

exports.eejsBlock_styles = template('ep_author_follow/templates/styles.html');
