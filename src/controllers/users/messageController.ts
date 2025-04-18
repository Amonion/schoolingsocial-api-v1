import { Request, Response } from "express";
import { IUser, IUserNotification } from "../../utils/userInterface";
import { User } from "../../models/users/userModel";
import { UserInfo } from "../../models/users/userInfoModel";
import { Staff } from "../../models/team/staffModel";
import { handleError } from "../../utils/errorHandler";
import { queryData } from "../../utils/query";
import { uploadFilesToS3 } from "../../utils/fileUpload";
import bcrypt from "bcryptjs";
import { Post } from "../../models/users/postModel";
import { UserNotification } from "../../models/team/emailModel";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, phone, signupIp, password } = req.body;

    const userBio = new UserInfo({ email, phone, signupIp });
    await userBio.save();

    const newUser = new User({
      userId: userBio._id,
      email,
      phone,
      signupIp,
      password: await bcrypt.hash(password, 10),
    });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IUserNotification>(UserNotification, req);
    const unread = await UserNotification.countDocuments({
      username: req.query.username,
      unread: true,
    });
    res.status(200).json({
      page: result.page,
      page_size: result.page_size,
      results: result.results,
      count: result.count,
      unread: unread,
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  try {
    const uploadedFiles = await uploadFilesToS3(req);
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url;
    });

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.picture) {
      await Post.updateMany(
        { userId: req.params.id },
        { picture: req.body.picture }
      );
    }

    if (req.body.isStaff) {
      const staff = await Staff.findOne({ userId: req.params.id });
      if (staff) {
        await Staff.findOneAndUpdate({ userId: req.body.id }, req.body);
      } else {
        await Staff.create(req.body);
      }
      const result = await queryData<IUser>(User, req);
      const { page, page_size, count, results } = result;
      res.status(200).json({
        message: "User was updated successfully",
        results,
        count,
        page,
        page_size,
      });
    } else if (req.body.media || req.body.picture || req.body.intro) {
      res.status(200).json({
        message: "Your profile was updated successfully",
        data: user,
      });
    }
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};
