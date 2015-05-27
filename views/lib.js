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