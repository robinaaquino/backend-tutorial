const { mongoose, Todo } = require('../../db');
const { delay } = require('../../lib/delay');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();


describe('For the route for getting one todo GET: (/todo/:id)', () => {
    let app;
    const ids = [];

    before(async() => {
        //initialize backend application
        app = await build();

        for(let i = 0; i<1; i++){
            const response = await app.inject({
                method: 'POST',
                url: '/todo',
                payload: {
                    text: `Todo ${i}`, //usage of backticks for addresses
                    done: false
                }
            });


            const payload = response.json();

            console.log(payload);
            const { data } = payload;
            const { id } = data; //we need ids

            ids.push(id); //allows the deletion later on
            await delay(1000);
        }

        //best case is to use a control data set


        
    })

    after(async () => {
        //clean up the database
        for (const id of ids){
            await Todo.findOneAndDelete({ id });
        }

        await mongoose.connection.close();
    });


    it('it should return { success: true, data: todo} and has a status code of 200 when called using GET', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/todo/${ids[0]}`
        });

        const payload = response.json();

        console.log(payload);
        console.log(response.statusCode);

        const { statusCode } = response;
        const { success, data } = payload;
        const { text,id,done } = data;

        success.should.equal(true);
        statusCode.should.equal(200);

        const todo = await Todo
            .findOne({ id })
            .exec();

        text.should.equal(todo.text);
        done.should.equal(todo.done);
        id.should.equal(todo.id);
    });

    it('it should return { success: false, message: error message} and has a status code of 404 when called using GET and the id of the todo is non-existing', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/todo/non-existing-id`
        });

        const payload = response.json();

        console.log(payload);
        console.log(response.statusCode);

        const { statusCode } = response;
        const { success, code, message } = payload;

        success.should.equal(false);
        statusCode.should.equal(404);

        should.exists(code);
        should.exists(message);

    });
});