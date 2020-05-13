const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

// require desired models
const Message = require('../models/Message');
const User = require('../models/User');

// helper which returns condition query
const getConditionQuery = id => ({ $eq: ['$sender', id] });

/**
 * GET
 * get messages route - /message
 * gets newly recieved messages for required user
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ reciever: req.user._id }, { sender: req.user._id }]
        }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: getConditionQuery(req.user._id),
              then: '$reciever',
              else: '$sender'
            }
          },
          message: {
            $last: {
              sentBy: {
                $cond: {
                  if: getConditionQuery(req.user._id),
                  then: req.user._id,
                  else: '$sender'
                }
              },
              body: '$body',
              date: '$date',
              status: '$status'
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          'user.name': 1,
          'user.profile_picture': 1,
          'user._id': 1,
          'user.register_date': 1,
          message: 1,
          _id: 0
        }
      }
    ]);

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'internal server error ' });
  }
});

/**
 * POST
 * create message route - /message
 * creates a new message
 */
router.post('/:id', async (req, res) => {
  try {
    // create a new message
    const newMessage = new Message({
      sender: getObjectId(socket.user._id),
      reciever: getObjectId(reciever),
      body: body,
      date: Date.now()
    });
    // save in db
    const savedMessage = await newMessage.save();
    const message = {
      body: savedMessage.body,
      date: savedMessage.date,
      sentBy: savedMessage.sender
    };

    // send response
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'internal server error ' });
  }
});

/**
 * GET
 * get chat route - /message/<some-user-id>
 * returns chat between two users
 */
router.get('/:id', async (req, res) => {
  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [{ sender: req.params.id }, { sender: req.user._id }]
            },
            {
              $or: [{ reciever: req.params.id }, { reciever: req.user._id }]
            }
          ]
        }
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%m-%d-%Y',
                date: { $toDate: '$date' }
              }
            },
            user: {
              $cond: {
                if: getConditionQuery(req.user._id),
                then: '$reciever',
                else: '$sender'
              }
            }
          },
          messages: {
            $push: {
              sentBy: {
                $cond: {
                  if: getConditionQuery(req.user._id),
                  then: req.user._id,
                  else: '$sender'
                }
              },
              body: '$body',
              date: '$date'
            }
          }
        }
      },
      { $sort: { '_id.date': -1 } },
      {
        $group: {
          _id: '$_id.user',
          messagesByDate: {
            $push: { date: '$_id.date', messages: '$messages' }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          'user.name': 1,
          'user.friends': 1,
          'user.profile_picture': 1,
          'user.register_date': 1,
          'user.email': 1,
          'user._id': 1,
          _id: 0,
          messagesByDate: 1
        }
      }
    ]);

    if (messages.length === 0) {
      messages.push({
        messagesByDate: [],
        user: await User.findById(req.params.id)
      });
    }

    res.json(messages[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'internal server error ' });
  }
});
module.exports = router;
