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

this.youtubeStorage = new YoutubeStorage(chrome.storage.sync);

function YoutubeStorage(store) {
    this.store = store;
    this.changedListeners = [];
    chrome.storage.onChanged.addListener(youtubeStorageChangedListener(this));
}

YoutubeStorage.prototype.fetch = function YoutubeStorage_fetch(videoId, callback) {
    var videoKey = storageKey(videoId);
    this.store.get(videoKey, function (items) {
        callback(items[videoKey]);
    });
};

YoutubeStorage.prototype.fetchAll = function YoutubeStorage_fetchAll(options, callback) {
    if (!callback && typeof(options) === 'function') {
        callback = options;
    }
    if (!options) {
        options = {};
    }

    this.store.get(function (items) {
        var records = [];
        for (var key in items) {
            if (key.indexOf('veep-youtube-') !== 0) {
                continue;
            }
            records.push(items[key]);
        }
        if (options.sort) {
            if (options.sort === 'by-date') {
                records.sort(function (record1, record2) {
                    return record1.updated_at - record2.updated_at;
                });
            } else if (options.sort === 'most-recent') {
                records.sort(function (record1, record2) {
                    return record2.updated_at - record1.updated_at;
                });
            }
        }
        callback(records);
    });
};

YoutubeStorage.prototype.save = function YoutubeStorage_save(videoData, callback) {
    var videoKey = storageKey(videoData.videoId);
    var storageData = {};
    storageData[videoKey] = {
        _id: videoKey,
        videoId: videoData.videoId,
        time: videoData.time,
        updated_at: Date.now(),
    };
    this.store.set(storageData, callback);
};

YoutubeStorage.prototype.delete = function YoutubeStorage_delete(videoId, callback) {
    this.store.remove(storageKey(videoId), callback);
};

YoutubeStorage.prototype.addChangedListener = function YoutubeStorage_addChangedListener(listener) {
    this.changedListeners.push(listener);
};

YoutubeStorage.prototype.removeChangedListener = function YoutubeStorage_removeChangedListener(listener) {
    var listenerIndex = this.changedListeners.indexOf(listener);
    if (listenerIndex >= 0) {
        this.changedListeners.splice(listenerIndex, 1);
    }
};

function storageKey(videoId) {
    return 'veep-youtube-' + videoId;
}

function youtubeStorageChangedListener(youtubeStorage) {
    return function(changes, area) {
        var hasChanges = false;
        var key;

        // Filtered changes of non-youtube keys
        for (key in changes) {
            if (!changes.hasOwnProperty(key)) {
                continue;
            }
            if (key.indexOf('veep-youtube-') === -1) {
                delete changes[key];
            } else {
                hasChanges = true;
            }
        }

        // If the changes do not concern youtube storage, do not trigger the event
        if (!hasChanges) {
            return;
        }

        // Trigger the event to every listeners
        youtubeStorage.changedListeners.forEach(function (listener) {
            listener(changes, area);
        });
    };
}
