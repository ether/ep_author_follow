![Publish Status](https://github.com/ether/ep_author_follow/workflows/Node.js%20Package/badge.svg) ![Backend Tests Status](https://github.com/ether/ep_author_follow/workflows/Backend%20tests/badge.svg)


# Author Follow / Track Etherpad plugin

![Usage](https://user-images.githubusercontent.com/220864/84521458-f3188e00-accc-11ea-8f1d-c5cfa20f0e9c.gif)

[![Travis (.org)](https://img.shields.io/travis/ether/ep_author_follow)](https://travis-ci.org/github/ether/ep_author_follow)

Follow an authors contributions to a pad in real time in Etherpad.

To follow an author click on the users icon in the user area.

Followed AuthorIDs are stored in cookies so you will automatically follow them in future pads.

Following of authors does not happen within 5 seconds of an edit event by the user or within 1 second of a pad being loaded.  This is to stop focus being drawn when an author is editing a pad.

# Installing

Option 1.

Use the ``/admin`` interface, search for ``ep_author_follow`` and click Install

Option 2.
```
npm install ep_author_follow
```
Option 3.
```
cd your_etherpad_install/node_modules
git clone https://github.com/ether/ep_author_follow
```

# Settings

``followAll`` [default: false] follows every author by default.
``enableFollow`` [default: true] follows followed authors when they edit.

## Example block
```
"ep_author_follow":{
  "followAll" : true,
  "enableFollow" : true
}
```

## Bug Reports

Please submit bug reports or patches at https://github.com/ether/ep_author_follow/issues

## Todo
- [ ] Stats
- [ ] Full test coverage
