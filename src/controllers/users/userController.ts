import { Request, Response } from "express";
import { IUser } from "../../utils/userInterface";
import { User } from "../../models/users/userModel";
import { UserInfo } from "../../models/users/userInfoModel";
import { Staff } from "../../models/team/staffModel";
import { handleError } from "../../utils/errorHandler";
import { queryData, search, followAccount } from "../../utils/query";
import { uploadFilesToS3 } from "../../utils/fileUpload";
import bcrypt from "bcryptjs";
import { Follower, Post } from "../../models/users/postModel";
import { io } from "../../app";
import { sendEmail, sendNotification } from "../../utils/sendEmail";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, signupIp, password } = req.body;

    const userBio = new UserInfo({ email, signupIp });
    await userBio.save();

    const newUser = new User({
      userId: userBio._id,
      email,
      signupIp,
      password: await bcrypt.hash(password, 10),
    });

    await newUser.save();
    await UserInfo.updateOne(
      { _id: userBio._id },
      { $set: { accountId: newUser._id } }
    );
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await User.findById(req.params.id);
    const followerId = req.query.userId;
    const follow = await Follower.findOne({
      userId: user?._id,
      followerId: followerId,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followedUser = {
      ...user.toObject(),
      isFollowed: !!follow,
    };
    res.status(200).json(followedUser);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IUser>(User, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
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

    await UserInfo.findByIdAndUpdate(user.userId, req.body, {
      new: true,
      runValidators: true,
    });

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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

//-----------------INFO--------------------//
export const updateUserInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  switch (req.body.action) {
    case "Contact":
      const result = await UserInfo.findOne({ phone: req.body.phone });
      if (result) {
        res.status(400).json({
          message: `Sorry a user with this phone number: ${result.phone} already exist`,
        });
      } else {
        update(req, res);
      }
      break;
    case "EducationHistory":
      req.body.pastSchool = JSON.parse(req.body.pastSchools);
      update(req, res);
      break;
    case "EducationDocument":
      const pastSchools = JSON.parse(req.body.pastSchools);
      const uploadedFiles = await uploadFilesToS3(req);
      uploadedFiles.forEach((file) => {
        req.body[file.fieldName] = file.s3Url;
      });
      pastSchools[req.body.number].schoolCertificate = req.body.certificate;
      pastSchools[req.body.number].schoolTempCertificate = undefined;
      req.body.pastSchool = pastSchools;
      req.body.pastSchools = JSON.stringify(pastSchools);
      update(req, res);
      break;
    case "Document":
      const user = await UserInfo.findOne({ username: req.params.username });
      const documents = user?.documents;
      const id = req.body.id;
      if (documents) {
        const uploadedFiles = await uploadFilesToS3(req);
        uploadedFiles.forEach((file) => {
          req.body[file.fieldName] = file.s3Url;
        });
        const result = documents.find((item) => item.docId === id);
        if (result) {
          result.doc = uploadedFiles[0].s3Url;
          result.name = req.body.name;
          documents.map((item) => (item.docId === id ? result : item));
          await UserInfo.updateOne(
            { _id: req.params.id },
            { documents: documents },
            {
              new: true,
              upsert: true,
            }
          );
        } else {
          const doc = {
            doc: uploadedFiles[0].s3Url,
            name: req.body.name,
            docId: id,
            tempDoc: "",
          };
          documents.push(doc);
          await UserInfo.updateOne(
            { username: req.params.username },
            { documents: documents },
            {
              new: true,
              upsert: true,
            }
          );
        }
      }
      update(req, res);
      break;
    default:
      update(req, res);
      break;
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const userInfo = await UserInfo.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      {
        new: true,
      }
    );

    const user = await User.findByIdAndUpdate(req.body.ID, req.body, {
      new: true,
      runValidators: false,
    });

    if (
      user &&
      user.isBio &&
      user.isContact &&
      user.isDocument &&
      user.isOrigin &&
      user.isEducation &&
      user.isEducationHistory &&
      user.isEducationDocument &&
      !user.isOnVerification &&
      user.isRelated &&
      !user.isVerified
    ) {
      await User.findByIdAndUpdate(req.body.ID, {
        isOnVerification: true,
        verifyingAt: new Date(),
      });
      await UserInfo.findOneAndUpdate(
        { username: req.params.username },
        {
          isOnVerification: true,
          verifyingAt: new Date(),
        }
      );
      const newNotification = await sendNotification(
        "verification_processing",
        {
          username: String(user?.username),
          receiverUsername: String(user.username),
          userId: user._id,
        }
      );
      io.emit(req.body.ID, newNotification);
      io.emit("team", { action: "verifying", type: "stat" });
    }

    res.status(200).json({
      userInfo,
      user,
      results: req.body.pastSchool,
      message: "your account is updated  successfully",
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getUserInfo = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await UserInfo.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const searchUserInfo = (req: Request, res: Response) => {
  return search(UserInfo, req, res);
};

export const updateUserVerification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.body.action === "bio") {
      req.body.isBio = false;
    } else if (req.body.action === "ori") {
      req.body.isOrigin = false;
    } else if (req.body.action === "cont") {
      req.body.isContact = false;
    } else if (req.body.action === "rel") {
      req.body.isRelated = false;
    } else if (req.body.action === "doc") {
      req.body.isDocument = false;
    } else if (req.body.action === "edu") {
      req.body.isEducation = false;
    } else if (req.body.action === "pas") {
      req.body.isEducationHistory = false;
    }

    if (req.body.status === "Approved") {
      req.body.isOnVerification = false;
      req.body.isVerified = true;
    }

    const userInfo = await UserInfo.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      {
        new: true,
      }
    );

    const user = await User.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
      runValidators: false,
    });

    if (req.body.status === "Rejected") {
      const newNotification = await sendNotification("verification_fail", {
        username: String(user?.username),
        receiverUsername: String(user?.username),
        userId: String(user?._id),
      });
      // sendEmail(
      //   String(user?.username),
      //   String(user?.email),
      //   "verification_fail"
      // );

      io.emit(req.body.id, newNotification);
    } else {
      const newNotification = await sendNotification(
        "verification_successful",
        {
          username: String(user?.username),
          receiverUsername: String(user?.username),
          userId: String(user?._id),
        }
      );
      const notificationData = { ...newNotification, user };
      io.emit(req.body.id, notificationData);
    }

    res.status(200).json({
      userInfo,
      user,
      results: req.body.pastSchool,
      message:
        "The verification status has been sent to the user successfully.",
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};
//-----------------FOLLOW USER--------------------//
export const followUser = async (req: Request, res: Response) => {
  try {
    const { follow, message } = await followAccount(req, res);
    const user = req.body.user;
    user.isFollowed = follow ? false : true;
    user.followers = follow
      ? Number(user.followers) - 1
      : Number(user.followers) + 1;

    res.status(200).json({
      message: message,
      data: user,
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};
