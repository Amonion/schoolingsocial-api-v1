import { Request, Response } from "express";
import { IUser } from "../../utils/userInterface";
import { User } from "../../models/users/userModel";
import { UserInfo } from "../../models/users/userInfoModel";
import { Staff } from "../../models/team/staffModel";
import { handleError } from "../../utils/errorHandler";
import { queryData } from "../../utils/query";
import { uploadFilesToS3 } from "../../utils/fileUpload";
import bcrypt from "bcryptjs";
import { Post } from "../../models/users/postModel";

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

export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
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
  try {
    if (req.body.isEducationHistory) {
      req.body.pastSchool = JSON.parse(req.body.pastSchools);
    }

    if (req.body.isEducationDocument) {
      const pastSchools = JSON.parse(req.body.pastSchools);
      const uploadedFiles = await uploadFilesToS3(req);
      uploadedFiles.forEach((file) => {
        req.body[file.fieldName] = file.s3Url;
      });
      pastSchools[req.body.number].schoolCertificate = req.body.certificate;
      pastSchools[req.body.number].schoolTempCertificate = undefined;
      req.body.pastSchool = pastSchools;
      req.body.pastSchools = JSON.stringify(pastSchools);
    }

    if (req.body.isDocument) {
      const user = await UserInfo.findById(req.params.id);
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
            { _id: req.params.id },
            { documents: documents },
            {
              new: true,
              upsert: true,
            }
          );
        }
      }
    }

    await UserInfo.updateOne({ _id: req.params.id }, req.body, {
      new: true,
    });

    const user = await User.findByIdAndUpdate(req.body.ID, req.body, {
      new: true,
      runValidators: false,
    });

    res.status(200).json({
      user,
      results: req.body.pastSchool,
      message: "your account is updated  successfully",
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getUserInfoById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await UserInfo.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};
