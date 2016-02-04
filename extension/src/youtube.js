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
var videoTitleElt = document.querySelector('.watch-title');
var videoTitle = videoTitleElt ? (videoTitleElt.title || '') : '';

// Fetch video details to set the current time with the saved one:
youtubeStorage.fetch(videoId, function (videoData) {
    if (videoData && videoData.time) {
        videoElt.currentTime = videoData.time;
    }
});

// Save the current time regularly:
var minimalSaveInterval = 3000; // ms
var lastSavedTime = Date.now() - minimalSaveInterval - 1;
videoElt.addEventListener('timeupdate', function (event) {
    var now = Date.now();
    if (now - lastSavedTime < minimalSaveInterval) {
        return; // Throttle the save operations:
    }
    youtubeStorage.save({ videoId: videoId, title: videoTitle, time: this.currentTime });
    lastSavedTime = now;
});

// Clean the saved time when the video playing has ended:
videoElt.addEventListener('ended', function (event) {
    youtubeStorage.delete(videoId);
});
