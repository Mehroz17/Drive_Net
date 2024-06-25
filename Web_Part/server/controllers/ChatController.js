import ChatModel from "../models/chatModel.js";

export const createChat = async (req, res) => {
  
  try {
    console.log(req.body.senderId);
    console.log(req.body.receiverId);
    const chat = await ChatModel.find({
      members: [req.body.senderId, req.body.receiverId],
    });
    // console.log('chat: ',chat);
    if (chat.length == 0){
      const newChat = new ChatModel({
        members: [req.body.senderId, req.body.receiverId],
      });
      const result = await newChat.save();
      res.status(200).json(result);
    }else
      res.status(200).json(chat);
    //res.status(200).json({msg:'0k'})
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error)
  }
};