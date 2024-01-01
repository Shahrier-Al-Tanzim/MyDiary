const User = require('../models/user.model');
const Memory = require('../models/memory.model');

const getDashboard = (req, res) => {
  res.render("dashboard", { user: req.user });
}

// Create Memory

const postMemory = async (req, res) => {
  let { memory } = req.body;
  console.log(memory);
  let images = null; // Use 'let' instead of 'const'
  if (!req.files || req.files.length === 0) {
    images = null;
    // return res.status(400).json({ message: "No file provided" });
  } else {
    images = req.files.map((file) => file.filename);
    console.log(images);
  }
  
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
// const updateMemory = async (req, res) => {
//   const { updatedMemory, memoryId } = req.body;
//   console.log(memoryId);
//   let images = null; // Use 'let' instead of 'const'
//   if (!req.files || req.files.length === 0) {
//     images = null;
//     // return res.status(400).json({ message: "No file provided" });
//   } else {
//     images = req.files.map((file) => file.filename);
//     console.log(images);
//   }
//   if (images) {
//     let memory = await Memory.findById(memoryId);
//     let updatedImages = memory.images;
//     for (let i = 0; i < images.length; i++) {
//       updatedImages.push(images[i]);
//     }
//   }
//   await Memory.findByIdAndUpdate(memoryId, { memory: updatedMemory, images: updatedImages });
//   console.log('Updated');
//   res.redirect('/welcome');
// }
const updateMemory = async (req, res) => {
  const { updatedMemory, memoryId } = req.body;
  console.log(memoryId);
  let images = null;
  let updatedImages = null; // Define updatedImages outside the conditional scope
  
  if (!req.files || req.files.length === 0) {
    images = null;
    updatedImages = null; // Initialize updatedImages in case no files are provided
    console.log('No files provided')
  } else {
    images = req.files.map((file) => file.filename);
    console.log(images);
    let memory = await Memory.findById(memoryId);
    updatedImages = memory.images ? [...memory.images] : []; // Create a copy of existing images or initialize as empty array
    console.log('Updated images - ' + updatedImages);
    for (let i = 0; i < images.length; i++) {
      updatedImages.push(images[i]);
    }
  }

  try {
    await Memory.findByIdAndUpdate(memoryId, { memory: updatedMemory, images: updatedImages });
    console.log('Updated');
    res.redirect('/welcome');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update memory" });
  }
}

// Delete Memory
const deleteMemory = async (req, res) => {
  const memoryId = req.params.id;
  console.log(memoryId);
  await Memory.findByIdAndDelete(memoryId);
  console.log('Deleted');
  res.redirect('/welcome');
}

// Creating a postMemory function where I can take the req.user_id and use it to create a new memory
// and then save it to the database.


module.exports = {
  getDashboard,
  getWelcome,
  postMemory,
  updateMemory,
  deleteMemory
}
