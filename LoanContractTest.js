const TimeBasedContract = artifacts.require('./TimeBasedContract');
const helper = require('ganache-time-traveler');

const Thu_Aug_10_00_00_00_UTC_2023 = 1691625600;
const Wed_Sep_20_00_00_00_UTC_2023 = 1695168000;
const secondsInOneDAY = 86400;

contract('TimeBasedContract', async (accounts) =>  {
    before('deploy TimeBasedContract', async() => {
        instance_1 = await TimeBasedContract.new(Thu_Aug_10_00_00_00_UTC_2023);
        instance_2 = await TimeBasedContract.new(Wed_Sep_20_00_00_00_UTC_2023);
    });

    beforeEach(async() => {
        snapShot = await helper.takeSnapshot();
        snapshotId = snapShot['result'];
    });
    afterEach(async() => {
        await helper.revertToSnapShot(snapshotId);
    });

    it("Thu Aug 10 00:00:00 UTC 2023 (before current time)", async() => {
        var output = await instance_1.isNowAfter.call();
        assert.equal(output, true, "output should be true");
    });

    it("Wed Sep 20 00:00:00 UTC 2023 (after current time)", async() => {
        var output = await instance_2.isNowAfter.call();
        assert.equal(output, false, "output should be false");
    });

    it("Wed Sep 20 00:00:00 UTC 2023 (after current time)", async() => {
        await helper.advanceTimeAndBlock(secondsInOneDAY * 100);
        var output = await instance_2.isNowAfter.call();
        assert.equal(output, true, "output should be true");
    });
});