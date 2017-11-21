var builder = require('botbuilder');
var restify = require('restify');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 8080, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: 'fe2a3999-9482-4807-9a8f-903265a0b78c',
    appPassword: 'zdeelBQZL][ofKHF58932#}'
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, [
    function(session,results,next){
        session.userData = [];
        session.send('Hey there! I am AutoOps bot.');
        builder.Prompts.choice(session,'How can I help you?',"Access Git|About Me",{listStyle:3})
    },
    function(session,results,next){
        if(results.response.entity=='Access Git'){
            session.send('Okay...');
            next();
        }else if(results.response.entity=='About Me'){
            session.beginDialog('aboutMe');
        }
    },
    function(session){
        session.beginDialog('getName');
    },
    function(session){
        session.beginDialog('getEmail');
    },
    function(session){
        session.beginDialog('getRepo');
    },
    function(session){
        session.beginDialog('end');
    },
]);


bot.dialog('getName',[
    function(session){
        builder.Prompts.text(session,'What is your name?');
    },
    function(session,results){
        session.userData.name = session.message.text;
        session.send('%s',session.message.text);
        builder.Prompts.choice(session,'Is this the name you entered?',"Yes|No",{listStyle:3})
    },
    function(session,results,next){
        if(results.response.entity=='Yes'){
            session.send('Okay...');
            next();
        }else if(results.response.entity=='No'){
            session.send('Only type in your name in this format: Format here');
            session.beginDialog('getName');
        }
    },
    function(session,results){
        session.endDialog();
    }
]);

bot.dialog('getEmail',[
    function(session){
        builder.Prompts.text(session,'Please enter your E-mail address');
    },
    function(session,results){
        session.userData.email = session.message.text;
        session.send('%s',session.message.text);
        builder.Prompts.choice(session,'Is this the mail you entered?',"Yes|No",{listStyle:3})
    },
    function(session,results,next){
        if(results.response.entity=='Yes'){
            session.send('Okay...');
            next();
        }else if(results.response.entity=='No'){
            session.send('Only type in your email in this format: format here');
            session.beginDialog('getEmail');
        }
    },
    function(session,results){
        session.endDialog();
    }
]);

bot.dialog('getRepo',[
    function(session){
        builder.Prompts.text(session,'Please enter your Git repository');
    },
    function(session,results){
        session.userData.repo = session.message.text;
        session.send('%s',session.message.text);
        builder.Prompts.choice(session,'Is this the repo you entered?',"Yes|No",{listStyle:3})
    },
    function(session,results,next){
        if(results.response.entity=='Yes'){
            session.send('Okay...');
            next();
        }else if(results.response.entity=='No'){
            session.send('Enter in this format: Format here');
            session.beginDialog('getRepo');
        }
    },
    function(session,results){
        session.endDialog();
    }
]);

bot.dialog('end',[
    function(session,results){
        session.send('Account created succesfully with the following details:');
        session.send('Name : %s',session.userData.name);
        session.send('Email : %s',session.userData.email);
        session.send('Git Repo : %s',session.userData.repo);
        session.send('Goodbye!');
        session.endDialog();
    }
]);

bot.dialog('aboutMe',[
    function(session,results){
        session.send('Bot Details here');
        session.beginDialog('/');
    }
]);
