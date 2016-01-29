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

this.UrlParams = { get: getSearchParam, set: setSearchParam };

function getSearchParam(paramName) {
    var params = parseLocationSearch();
    if (typeof(params) === 'undefined') {
        return params;
    }
    return params[paramName];
}

function setSearchParam(paramName, value) {
    var params;

    if (typeof(paramName) !== 'string') {
        params = paramName;
    } else {
        params = parseLocationSearch();
        params[paramName] = value;
    }

    document.location.search = stringifySearchParams(params);
}

function parseLocationSearch() {
    var searchParts = document.location.search.slice(1).split('&');
    var searchParams = {};

    searchParts.forEach(function (part) {
        var slices = part.split('=');
        if (slices.length < 2) {
            return;
        }
        var paramName = decodeURIComponent(slices.shift());
        var paramValue = decodeURIComponent(slices.join('='));
        searchParams[paramName] = paramValue;
    });

    return searchParams;
}

function stringifySearchParams(params) {
    var search = '';
    var searchParts = [];

    for (var paramName in params) {
        if (!params.hasOwnProperty(paramName)) {
            continue;
        }
        searchParts.push(
            encodeURIComponent(paramName) +
            '=' +
            encodeURIComponent(params[paramName])
        );
    }

    if (searchParts.length) {
        search = '?' + searchParts.join('&');
    }

    return search;
}
