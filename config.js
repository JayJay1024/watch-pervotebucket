'use strict';

const config = {
    debug: true,
    log_dir: `${__dirname}/logs`,

    // https://www.npmjs.com/package/node-cron
    // # ┌────────────── second (optional)
    // # │ ┌──────────── minute
    // # │ │ ┌────────── hour
    // # │ │ │ ┌──────── day of month
    // # │ │ │ │ ┌────── month
    // # │ │ │ │ │ ┌──── day of week
    // # │ │ │ │ │ │
    // # │ │ │ │ │ │
    // # * * * * * *
    // 任务计划时间
    schedule_time: '10 29,59 * * * *', // 每小时的29分10秒和59分10秒

    rpc_addr: 'http://127.0.0.1:8888',
};
module.exports = config;
