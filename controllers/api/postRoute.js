const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
  // console.log("I AM IN POST ROUTE");
  try {
    const postData = await Post.findAll({
      attributes: [
        'id', 'title', 'textbody' , 'createdAt'
      ],
      order: [['createdAt', 'DESC']],
      include: [
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

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      attributes: [
        'id',
        'textbody',
        'title',
        'createdAt'
      ],

      include: [
        {
          model: Comment,
          attributes: ['id','comment_text', 'post_id', 'user_id', 'createdAt'],
          include: {
            model: User,
            attributes: ['username'],
          }
        },
      ],
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', withAuth, async (req, res) => {
  console.log(req.body)
  try {
    const newPost = await Post.create({
      title: req.body.title,
      textbody: req.body.textbody,
      user_id: req.session.user_id
    });
  
    // console.log(newPost);
    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {
    const updatePost = await Post.update({
      title: req.body.title,
      textbody: req.body.textbody,
      
        where: {
          id: req.paramas.id
        }
      
    });

    res.status(200).json(updatePost);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
