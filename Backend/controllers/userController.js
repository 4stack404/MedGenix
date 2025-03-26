import userModel from "../models/userModels.js";

export const getUserData = async (req, res) => {
  try {
    const {userID} = req.body;
    

    const user = await userModel.findById(userID);

    if(!user) {
        return res.status(404).json({success: false, message: "User not found"});
    }

    res.json({
        success: true,
        userData: {
            name: user.name,
            isAccountVerified: user.isAccountVerified,  
        }
        });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadUserPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.photoUrl = req.file.path;
    await user.save();

    res.status(200).json({ success: true, message: "Photo uploaded successfully", photoUrl: user.photoUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
