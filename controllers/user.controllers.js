const User = require('../models/user.model');
const Memory = require('../models/memory.model');

const getDashboard = (req, res) => {
  res.render("dashboard", { user: req.user });
}

// Create Memory

const postMemory = async (req, res) => {
  let { memory } = req.body;
  console.log(memory);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No file provided" });
  }

  // Assuming 'images' is the field name for the uploaded files
  const images = req.files.map((file) => file.filename);
  console.log(images);
  const userId = req.user._id;
  const user = await User.findById(userId);
  console.log(user);

  const newMemory = new Memory({
    momoryownerid: userId,
    memory,
    images,
  });

  try {
    await newMemory.save();
    res.redirect('/welcome');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save memory" });
  }
};


// Read Memory
const getWelcome = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  const memories = await Memory.find({momoryownerid: userId});
  res.render('welcome', {user: user, memories: memories});
}

// Update Memory
const updateMemory = async (req, res) => {
  const {updatedMemory, memoryId} = req.body;
  console.log(memoryId);
  await Memory.findByIdAndUpdate(memoryId, {memory: updatedMemory});
  console.log('Updated');
  res.redirect('/welcome');
}

// Delete Memory
const deleteMemory = async (req, res) => {
  const memoryId = req.params.id;
  console.log(memoryId);
  await Memory.findByIdAndDelete(memoryId);
  console.log('Deleted');
  res.redirect('/welcome');
}


module.exports = {
  getDashboard,
  getWelcome,
  postMemory,
  updateMemory,
  deleteMemory
}
