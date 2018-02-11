class Q {
    constructor() { 
        this.arr = [1,2,3]
    }
    log(e) {
        console.log(e)
    }
    test() {
        this.arr.forEach(e => {
            this.log(e); // this undefined в отладчике!
        })
    }
}

const f = new Q().test()

export default Q