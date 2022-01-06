const findCountries = require('./cli');

let tests = [
    ['name','bra',true],
    ['name','zzzz',false],
    ['code','pol',true],
    ['code','12345',false],
    ['code','prn',true],
];

runTests();

async function runTests() {
    for (t of tests) {
        let [pname,pvalue,expected] = [...t];
        result = await findCountries(pname, pvalue);
        //console.log("RRR", result);
        let verdict = result && expected ? 'PASS' :   // positive tests
				  !result && !expected ? 'PASS' : // negative tests
				  'FAIL';
        t.push(verdict);
	}
    console.log(tests);
    process.exit();
}
