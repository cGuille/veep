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
    youtubeStorage.fetchAll({ sort: 'by-date' }, function (records) {
        if (records.length >= maxNumberOfRecords) {
            records.slice(maxNumberOfRecords).forEach(function (record) {
                youtubeStorage.delete(record.videoId);
            });
        }
        setTimeout(cleanupOldVideoData, cleanupInterval * 60 * 1000);
    });
}
