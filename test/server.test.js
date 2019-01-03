const {expect} = require('chai');
describe('server', () => {
    it('It should delete key when delete called', function(){
        const userNames = {
            'id': 'name'
        };
        expect(userNames['id']).to.equal('name');
        delete userNames['id'];
        expect(userNames['id']).to.be.undefined;
    });
    it('Test distribution of indexes', () => {
        const n = 10;
        const arr = require('../server/indexes-generator').generate(n);
        console.log(arr);
        expect(arr.length).to.equal(10);
        // all distinct
        expect(Array.from(new Set(arr)).length).to.equal(10);
        expect(Math.max(...arr)).to.equal(9);
        expect(Math.min(...arr)).to.equal(0);
        for(var i=0;i<n;i++){
            expect(arr[i]).to.not.equal(i);
        }
    });
});