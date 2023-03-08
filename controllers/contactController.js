const asyncHandler = require("express-async-handler");
const contacts = require("../models/contactModel");
//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContact = asyncHandler(async (req, res) => {
  const contact = await contacts.find({user_id:req.user.id});
  res.status(200).json(contact);
});
 
//@desc Get  contact
//@route GET /api/contacts
//@access private
const getContactById = asyncHandler(async (req, res) => {
  const contact = await contacts.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

//@desc create contact
//@route POST /api/contacts
//@access private
const postContact = asyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const contact = await contacts.create({
    name,
    email,
    phone,
    user_id:req.user.id,
  });
  res.status(201).json(contact);
});

//@desc Update contact
//@route PUT /api/contacts
//@access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await contacts.findById(req.params.id);
    if (!contact) {
      res.status(404);
      throw new Error("Contact not found");
    }
    if(contact.user_id.toString()!== req.user.id)
    {
      res.status(403);
      throw new Error("User don't have permission to update other user contacts")
    }

    const updatedContact = await contacts.findByIdAndUpdate(
        req.params.id,
        req.body,{new:true}
    )
  res.status(201).json(updatedContact);
});

//@desc Delete contact
//@route DELETE /api/contacts
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await contacts.findById(req.params.id);
    if (!contact) {
      res.status(404);
      throw new Error("Contact not found");
    }

    if(contact.user_id.toString()!== req.user.id)
    {
      res.status(403);
      throw new Error("User don't have permission to update other user contacts")
    }

    await contacts.deleteOne({_id:req.params.id});
  res.status(200).json(contact);
});
module.exports = {
  getContact,
  postContact,
  getContactById,
  updateContact,
  deleteContact,
};
