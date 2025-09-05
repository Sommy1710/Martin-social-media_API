import { ValidationError } from "../../lib/error-definitions.js";
import { Validator } from "../../lib/validator.js";
import { sendMessageRequest } from "../requests/send.message.request.js";
import { Message } from "../schema/message.schema.js";
import { v2 as cloudinary } from 'cloudinary';
import {Readable} from 'stream';

/*export const getMessages = async (req, res) => {
    const {userId} = req.params;
    const messages = await Message.find({
        $or: [{sender: userId}, {receiver: userId}]
    })
    .populate("sender receiver", "username")
    .sort({timestamp: 1});
    res.json(messages);
}*/

export const getMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Ensure the authenticated user matches the requested userId
    if (!req.user || req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these messages"
      });
    }

    // Fetch messages where the user is either sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .populate("sender receiver", "username")
      .sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (err) {
    next(err);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    // Helper to convert buffer to stream
    const bufferToStream = (buffer) => {
      const readable = new Readable();
      readable._read = () => {};
      readable.push(buffer);
      readable.push(null);
      return readable;
    };

    let photoUrls = [];

    // Handle multiple image uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUri = await new Promise((resolve, reject) => {
          bufferToStream(file.buffer).pipe(
            cloudinary.uploader.upload_stream(
              { resource_type: 'image' },
              (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
              }
            )
          );
        });

        photoUrls.push(imageUri);
      }

      // Inject array of image URLs into request body
      req.body.photos = photoUrls;
    }

    // Validate the request body
    const validator = new Validator();
    const { error, value } = validator.validate(sendMessageRequest, req.body);

    if (error) {
      throw new ValidationError(
        'The request failed with the following errors',
        error
      );
    }

    // Create the message
    const message = await Message.create({
      sender: value.sender,
      receiver: value.receiver,
      content: value.content,
      photos: value.photos,
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message,
    });
  } catch (err) {
    next(err);
  }
}