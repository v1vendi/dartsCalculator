if (!Array.prototype.last) {
    Array.prototype.last = function () {
        return this[this.length - 1];
    }
}

if (!Array.prototype.shuffle) {
    Array.prototype.shuffle = function () {
        var i = this.length, j, temp;
        if (i == 0) return this;
        while (--i) {
            j = Math.floor(Math.random() * (i + 1));
            temp = this[i];
            this[i] = this[j];
            this[j] = temp;
        }
        return this;
    }
}

if (!Array.prototype.orderBy) {
    Array.prototype.orderBy = function (predicate, ascending) {

        function sortFn(a, b) {
            if (a[predicate] && !b[predicate]) {
                return 1;
            } else if (!a[predicate] && b[predicate]) {
                return -1;
            } else if (a[predicate] < b[predicate]) {
                return 1;
            } else if (a[predicate] > b[predicate]) {
                return -1;
            } else {
                return 0;
            }
        }

        if (typeof predicate !== "string") {
            throw new TypeError("predicate must be a string");
        }

        this.sort(sortFn);
        if (!ascending) {
            this.reverse();
        }

        return this;
    };
}

if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;
        
        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

function where(filterObj) {
    
    function keysEqual(elm) {
        
        var keys = Object.keys(filterObj);
        
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!elm || elm[key] != filterObj[key]) {
                return false;
            }
        }
        return true;
    }
    
    return keysEqual;
}