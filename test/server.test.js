const { expect } = require('chai');
const { generate } = require('../server/indexes-generator');

describe('Index generator', () => {
    it('should perform shuffle algorithm on 0 to N generated array of integers.', () => {
        const n = 10;
        const arr = generate(n);
        console.log(arr);
        expect(arr.length).to.equal(10);
        expect(Array.from(new Set(arr)).length).to.equal(10);
        expect(Math.max(...arr)).to.equal(9);
        expect(Math.min(...arr)).to.equal(0);
        for(var i=0;i<n;i++){
            expect(arr[i]).to.not.equal(i);
        }
    });
});