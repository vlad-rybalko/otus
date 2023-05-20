const fn1 = () => {
    console.log('fn1')
    return Promise.resolve(1)
}
const fn2 = () => new Promise(resolve => {
    console.log('fn2')
    setTimeout(() => resolve(2), 1000)
})

async function promiseReduce(asyncFunctions = [], reduce, initialValue = 0) {
    return asyncFunctions.reduce(
        (promise, fun) => promise.then(
            async sum => {
                try {
                    return reduce(sum, await fun());
                } catch (e) {
                    console.warn(fun.name, e);
                    return sum;
                }
            }
        ),
        Promise.resolve(initialValue)
    );
}

promiseReduce(
    [fn1, fn2],
    function (memo, value) {
        console.log('reduce')
        return memo * value
    }, 1).then(console.log)