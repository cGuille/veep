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

var cleanupInterval = 15; // minutes
var maxNumberOfRecords = 100;

cleanupOldVideoData();

function cleanupOldVideoData() {
    chrome.storage.sync.get(function (items) {
        var records = [];
        for (var key in items) {
            if (key.indexOf('veep-youtube-') !== 0) {
                continue;
            }
            records.push(items[key]);
        }

        if (records.length >= maxNumberOfRecords) {
            records.sort(function (record1, record2) {
                return record1.updated_at - record2.updated_at;
            });
            records.slice(maxNumberOfRecords + 1).forEach(function (record) {
                delete items[record._id];
            });
        }

    });

    setTimeout(cleanupOldVideoData, cleanupInterval * 60 * 1000);
}
