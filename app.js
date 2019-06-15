'use strict';

const cron   = require('node-cron');
const config = require('./config');
const logger = require('./logger');

// eosjs require
const { JsonRpc, RpcError } = require('eosjs');
const fetch = require('node-fetch');                                    // node only; not needed in browsers

// eosjs set
const rpc = new JsonRpc(config.rpc_addr, { fetch });

/**
 * fetch table
 */
const fetchglobal = async (trytimes) => {
    if (!trytimes || trytimes < 0) {
        logger.info('cancel fetchglobal cause trytimes:', trytimes);
        return;
    }

    try {
        let result = await rpc.get_table_rows({
            code: 'eosio',
            scope: 'eosio',
            table: 'global',
        });
        if (result && result.rows && result.rows.length) {
            logger.info('pervote_bucket:', result.rows[0].pervote_bucket);
        } else {
            logger.error('get_table_row fail:\n', result);
        }
    } catch (err) {
        logger.error('fetchglobal caught exeption:\n', err);
        // if (err instanceof RpcError) {
        //     logger.error('rpc error:\n', JSON.stringify(err.json, null, 2));
        // }
        setTimeout(() => {
            fetchglobal(--trytimes);
        }, 1000 * 30);  // try again 30s later
    }
};

/**
 * run app
 */
const run = async () => {
    let expression = config.schedule_time;
    if (cron.validate(expression)) {
        logger.info('start a schedule...');
        cron.schedule(expression, () => {
            fetchglobal(3);
        });
        logger.info('started a schedule successfully(second minute hour day_of_month month day_of_week): ', expression, '\n');
    } else {
        logger.error('invalid expression: ', expression);
        process.exit(1);
    }
}

run();