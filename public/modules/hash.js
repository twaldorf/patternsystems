export const hashCode = (string) => {
    var hash = 0;
    if (string.length == 0) {
        return hash;
    }
    for (var i = 0; i < string.length; i++) {
        var char = string.charCodeAt(i);
        hash = ( (hash << 5) - hash) + char;
        hash &= hash;
    }
    return hash;
}
