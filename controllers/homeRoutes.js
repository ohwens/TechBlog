const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  console.log("MAIN PAGE HIT")
  try {
    // Get all projects and JOIN with user data
    const postData = await Post.findAll({
      attributes: [ 'id', 'title', 'createdAt'],
      include: [User,
        {
         model: Comment, 
         attributes: ['id','comment_text', 'post_id', 'user_id', 'createdAt'],
          include: {
            model: User,
           attributes: ['username']
          }
       },
      ],
    });
    console.log(postData)
    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));
    console.log(posts)
    // Pass serialized data and session flag into template
    res.render('starterPage', { 
      posts, 
      logged_in: req.session.logged_in,
      user_name: req.session.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  console.log(req.params.id)
  try {
    const postData = await Post.findByPk(req.params.id,
      {
        attributes: [ 'id', 'title', 'textbody', 'createdAt'],
        include: [User,
          {
           model: Comment, 
           attributes: ['id','comment_text', 'post_id', 'user_id', 'createdAt'],
            include: {
              model: User,
             attributes: ['username']
            }
         },
        ],
      });

    const post = postData.get({ plain: true });

    console.log(post);

    res.render('showPost', {
      ...post,
      logged_in: req.session.logged_in,
      user_name: req.session.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/login', (req, res) => {
  if(req.session.logged_in) {
    res.redirect('/');
    return;
  }else{
    res.render('signin');
  }
});

router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});

module.exports = router;
