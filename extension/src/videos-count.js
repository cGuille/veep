// Copyright 2016 Guillaume Charmetant

// This file is part of Veep.

// Veep is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Veep is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Veep.  If not, see <http://www.gnu.org/licenses/>.

var badgeCounter = 0;

youtubeStorage.fetchAll({ sort: 'most-recent' }, function (records) {
    badgeCounter += records.length;
    chrome.browserAction.setBadgeText({ text: badgeCounter.toString(10) });
});

youtubeStorage.addChangedListener(function (changes, area) {
    var changedRecordsCount = 0;
    var key;

    for (key in changes) {
        if (changes.hasOwnProperty(key)) {
            if (!changes[key].oldValue) {
                ++changedRecordsCount;
            }
            if (!changes[key].newValue) {
                --changedRecordsCount;
            }
        }
    }

    badgeCounter += changedRecordsCount;

    if (changedRecordsCount !== 0) {
        chrome.browserAction.setBadgeText({ text: badgeCounter.toString(10) });
    }
});
