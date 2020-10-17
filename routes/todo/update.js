const { Todo } = require('../../db');

/**
 * Updates one todo
 * 
 * @param {*} app 
 */
exports.update = app => { //arrow function which allows modification of global variables,
    /**
     * This updates one todo from the database given a unique ID and a payload
     * 
     * @param {import('fastify').FastifyRequest} request
     * @param {import('fastify').FastifyReply<Response>} response
     */
    app.put('/todo/:id', async (request, response) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
        const { params, body } = request; //use url to get info
        const { id } = params;
        //get text and done from body
        //ensure that when using Postman to check this that it's set to json not text
        const { text, done } = body || {};
       
        //expect that we should be getting at least a test or a done property
        if (!text && (done === null || done === undefined)){ 
            return response
                .code(400)
                .send({
                    success: false,
                    code: 'todo/malformed',
                    message: 'Payload doesn\'t have text property'
                });
        }

        const oldData = await Todo.findOne({ id }).exec();

        if (!oldData){ //it's -1
            return response
                .code(404)
                .send({
                    success: false,
                    code: 'todo/not found',
                    message: 'Todo doesn\'t exist'
                });
        } 



        const update = {};

        if(text){
            update.text = text;
        }

        if(done !== undefined && done !== null){
            update.done = done;
        }

        update.dateUpdated = new Date().getTime();

        const data = await Todo.findOneAndUpdate(
            { id },
            update,
            { new: true } //i want to see new object that I created
        )
            .exec();

        return {
            success: true,
            data
        };
    }); 
}; // dont forget semi-colon
