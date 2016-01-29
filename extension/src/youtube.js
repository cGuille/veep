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

var videoId = UrlParams.get('v');
var videoElt = document.querySelector('video.html5-main-video');

fetchVideoTime(videoId, function (videoTime) {
    videoElt.currentTime = videoTime;
});

var minimalSaveInterval = 3000; // ms
var lastSavedTime = Date.now() - minimalSaveInterval - 1;
videoElt.addEventListener('timeupdate', function (event) {
    var now = Date.now();
    if (now - lastSavedTime < minimalSaveInterval) {
        return; // Throttle the save operations:
    }
    saveVideoTime(videoId, this.currentTime);
    lastSavedTime = now;
});

videoElt.addEventListener('ended', function (event) {
    deleteVideoTime(videoId);
});

function saveVideoTime(videoId, time) {
    var videoKey = videoStorageKey(videoId);
    var storageData = {};
    storageData[videoKey] = {
        _id: videoKey,
        videoId: videoId,
        time: time,
        updated_at: Date.now(),
    };
    chrome.storage.sync.set(storageData);
}

function deleteVideoTime(videoId) {
    chrome.storage.sync.remove(videoStorageKey(videoId));
}

function fetchVideoTime(videoId, callback) {
    var videoKey = videoStorageKey(videoId);
    chrome.storage.sync.get(videoKey, function (items) {
        var videoData = items[videoKey] || {};
        callback(videoData.time);
    });
}

function videoStorageKey(videoId) {
    return 'veep-youtube-' + videoId;
}
