const Router = require('express').Router();
const auth = require('./middlewares/auth');
const UserController = require('./controllers/user');
const TagController = require('./controllers/tag');

Router.post('/user', UserController.signup);
Router.post('/auth', UserController.signIn);

Router.post('/tag', auth, TagController.createTag);
Router.patch('/tag/:tag_id', auth, TagController.updateTag);
Router.delete('/tag/:tag_id', auth, TagController.deleteTag);

Router.get('/tag', auth, TagController.getTags);
Router.get('/user/tag/:user_id', auth, TagController.getUserTags);

module.exports = Router;