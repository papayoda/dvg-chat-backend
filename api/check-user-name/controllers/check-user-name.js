'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async checkUsername(ctx) {
        const id = ctx.params.id;
        const query = await strapi.query('user', 'users-permissions').findOne({ username: id });
        if (query){
            return ctx.send(true)
        }
        return ctx.send(false)
    },
};
