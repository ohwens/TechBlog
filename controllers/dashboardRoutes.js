const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment} = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req,res)=> {
    try {
      
        const post = await Post.findAll({
            where: {
                user_id: req.session.user_id
            },
            
                attributes: [
                    'id', 'textbody', 'title', 'createdAt',
                ],

            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'createdAt'],
                    include: {
                        model: User,
                        attributes: ['username']
                    },
                },
            ],

        });
        // console.log(post);
        const posts = post.map(post => post.get({plain:true}));
        // console.log(posts)

        // res.render('post', {
        //     posts,
        //     loggedIn: req.session.logged_in,
        //     userName: req.session.username,
        // res.render('postedInfo', {
        //     layout: 'dashboard',
        //     posts,
        //   });
        res.render('dashboard', { 
            posts, 
            logged_in: req.session.logged_in,
            user_name: req.session.username,
          });
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
    
})

router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            attributes: [
                'id', 'comment_text', 'post_id', 'user_id', 'createdAt'
            ],
            include: {
                model: User,
                attributes: ['username'],
            }
        });
        const posts = postData.map((post) => post.get({ plain: true }));

        res.render('editPost', {
            posts,
            loggedIn: req.session.logged_in,
            userName: req.session.username
        })

    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    };
});


module.exports = router