/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hmenzagh <hmenzagh@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/05/23 16:39:04 by hmenzagh          #+#    #+#             */
/*   Updated: 2019/05/23 18:43:10 by hmenzagh         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

'use strict';

const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const md5 = require('md5');
const axios = require('axios');
const { boomify } = require('boom');

const users = {
    hugo: {
        username: 'hugo',
        password: '3ba1994d8539fcea2a6db5845f1ae44a',
        name: 'Hugo',
        id: 'hugo01'
    }
};

const validate = async (request, username, password, h) => {

    const user = users[username];
    if (!user) {
        return { credentials: null, isValid: false };
	}
    const isValid = md5(password) === user.password;
    const credentials = { id: user.id, name: user.name };

    return { isValid, credentials };
};

const init = async () => {
    const server = Hapi.server({
        port: 8888,
        host: 'localhost'
	});

	await server.register(require('@hapi/basic'));

    server.auth.strategy('simple', 'basic', { validate });
    server.auth.default('simple');

	server.route({
        method: 'POST',
		path:'/',
		config: {
			validate: {
				payload: {
					method: Joi.string().required(),
					url: Joi.string().required(),
					payload: Joi.object().optional(),
					headers: Joi.object().required(),
				},
			},
		},
        handler: async (request, h) => {
			const { method, url, payload, headers } = request.payload;
			console.log('Incoming request 🔮');
			try {
				const resp = await axios({
					method,
					url,
					data: { ...payload },
					headers,
				});
				console.log('Request answered  🎉');
				return resp.data;
			} catch (e) {
				console.log('Request error 😨');
				return boomify(e);
			}
        }
    });
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();