export const hashCode = (string) => {
    // from Barak at stack overflow q 6122571
    var hash = 0;
    if (string.length == 0) {
        return hash;
    }
    for (var i = 0; i < string.length; i++) {
        var char = string.charCodeAt(i);
        hash = ( (hash << 5) - hash) + char;
        hash &= hash; // Convert to 32bit integer
    }
    return hash;
}