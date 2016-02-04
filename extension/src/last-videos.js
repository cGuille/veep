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

updateVideoList(document.querySelector('.videos'));

function updateVideoList(videoListElt) {
    fetchLastVideos({ limit: 10 }, function (videos) {
        if (!videos.length) {
            videoListElt.innerHTML = '<p>No currently watching videos. Sorry pal!</p>';
            return;
        }
        videoListElt.innerHTML = '';
        videos.map(videoListItem).forEach(function (listItem) {
            videoListElt.appendChild(listItem);
        });
    });
}

function fetchLastVideos(options, callback) {
    youtubeStorage.fetchAll({ sort: 'most-recent' }, function (records) {
        records = records.slice(0, options.limit);
        records.forEach(function (record) { record.url = videoUrl(record); });
        callback(records);
    });
}

function videoListItem(video) {
    var listItemElt = document.createElement('div');
    var videoTitleElt = document.createTextNode(displayableTitle(video.title));
    var videoOpeningBtn = document.createElement('button');
    var videoRemovalBtn = document.createElement('button');

    videoOpeningBtn.innerHTML = '▶ ';
    videoOpeningBtn.addEventListener('click', function (event) {
        chrome.tabs.create({ url: video.url });
    });

    videoRemovalBtn.innerHTML = '×';
    videoRemovalBtn.addEventListener('click', function (event) {
        youtubeStorage.delete(video.videoId);
        window.close();
    });

    videoOpeningBtn.appendChild(videoTitleElt);
    listItemElt.appendChild(videoOpeningBtn);
    listItemElt.appendChild(videoRemovalBtn);

    return listItemElt;
}

var veepFeatureQueryPart = encodeURIComponent('feature') + '=' + encodeURIComponent('veep');
function videoUrl(video) {
    return 'https://www.youtube.com/watch?v=' + encodeURIComponent(video.videoId) + '&' + veepFeatureQueryPart;
}

var titleMaxLength = 45;
var titlePartsLength = (titleMaxLength / 2) - 2;
function displayableTitle(title) {
    if (typeof(title) !== 'string') {
        return '';
    }

    if (title.length < titleMaxLength) {
        return title;
    }

    return [
        title.slice(0, titlePartsLength),
        '[…]',
        title.slice(-titlePartsLength),
    ].join(' ');
}
