exports.generate = function(n) {
    const arr = [];
    for(var i=0;i<n;i++) arr.push(i);
    for(var i=0;i<n-1;i++){
        const swapWith = i + 1 + ~~(Math.random() * (n - i - 1));
        const temp = arr[i];
        arr[i] = arr[swapWith]; arr[swapWith] = temp;
    }
    return arr;
}